import * as crypto from 'crypto';
import {pki, md} from 'node-forge';

type KeyPair = {privateKey: string, publicKey: string};
type CertificateAuthorityPair = {privateKey: string, certificate: string};

function getSerial(){
  crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase();
}

function getExpirationDate(startDate: Date) {
  const date = new Date(startDate.getTime);
  date.setFullYear(startDate.getFullYear() + 1);
}

const generateKeyPair = (): string => pki.rsa.generateKeyPair(2048);

function createCertificateAuthority(keyPair: KeyPair): CertificateAuthorityPair {
    const startDate = new Date();
    const certificate = pki.createCertificate();
    certificate.publicKey = keyPair.publicKey;
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
    certificate.sign(keyPair.privateKey, md.sha256.create());

    const ca = pki.certificateToPem(certificate);
    const privateKey = pki.privateKeyToPem(keyPair.privateKey);

    return {privateKey, certificate: ca};
}

export {
  generateKeyPair,
  createCertificateAuthority
};
