// @flow

import fs from 'fs';
import crypto from 'crypto';
import {Observable} from 'rxjs';
import {pki, md} from 'node-forge';

const directory = './certificate/';
const caCertPath = directory + 'ca.crt';
const caKeyPath = directory + 'ca.key';

function getSerial(){
  crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase();
}

function getExpirationDate(startDate) {
  const date = new Date();
  date.setFullYear(startDate.getFullYear() + 1);
}

const keyPair$ = Observable.defer(() => {
  return Observable.of(pki.rsa.generateKeyPair(2048));
})
  .publishReplay(1)
  .refCount();

const certificateAuthority$ = keyPair$
  .map((keys) => {
    const startDate = new Date();

    const certificate = pki.createCertificate();
    certificate.publicKey = keys.publicKey;
    certificate.serialNumber = getSerial();
    certificate.validity.notBefore = startDate;
    certificate.validity.notAfter = getExpirationDate(startDate);
    certificate.setExtensions([{
      name: 'basicConstraints',
      cA: true
    }]);

    const attributes = [
      {
        name: 'commonName',
        value: 'phoenixmatrix_do_not_trust'
      },
      {
        name: 'organizationName',
        value: 'do_not_trust_phoenixmatrix'
      },
      {
        name: 'countryName',
        value: 'US'
      }
    ];

    certificate.setSubjects(attributes);
    certificate.setIssuer(attributes);
    certificate.sign(keys.privateKey, md.sha256.create());

    const ca = pki.certificateToPem(certificate);
    const privateKey = pki.privateKeyToPem(keys.privateKey);

    return {privateKey, ca};
  }).mergeMap(({privateKey, ca}) => {
    const writePrivateKey$ = Observable.bindNodeCallback(
      fs.writeFile(caKeyPath, privateKey)
    );

    const writeCA$ = Observable.bindNodeCallback(
      fs.writeFile(caCertPath, ca)
    );

    return Observable
      .forkJoin(writePrivateKey$, writeCA$)
      .map(() => ({privateKey, ca}));
  });


export {
  createCA
};
