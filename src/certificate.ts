import * as fs from 'fs';
import * as crypto from 'crypto';
import {pki, md} from 'node-forge';
import {invoker} from 'ramda';

function getSerial(){
  crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase();
}

const setFullYearFrom = invoker()

function getExpirationDate(startDate: Date) {
  const date = new Date(startDate.getTime);
  date.setFullYear(startDate.getFullYear() + 1);
}

const generateKeyPair = () => pki.rsa.generateKeyPair(2048);

const keyPair$ = Observable.defer(() => {
  return Observable.of();
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

    return {key: privateKey, certificate: ca};
  }).mergeMap(({key, certificate}) => {    return Observable
      .forkJoin(
        writeFile$(caKeyPath, key),
        writeFile$(caCertPath, certificate)
      )
      .map(() => ({key, certificate}));
  });


export {
  createCA
};
