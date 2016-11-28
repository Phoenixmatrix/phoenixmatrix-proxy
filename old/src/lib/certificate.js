import fsOrig from 'fs';
import crypto from 'crypto';
import {pki, md} from 'node-forge';
import Promise from 'bluebird';
import moment from 'moment';

import mkdirpOrig from 'mkdirp';
import helpers from './helpers';
import config from './config';

const async = Promise.coroutine;

const fs = Promise.promisifyAll(fsOrig);
const mkdirp = Promise.promisify(mkdirpOrig);

const directory = './certificate/';
const caCertPath = directory + 'ca.crt';
const caKeyPath = directory + 'ca.key';

const domainCertificates = {};
let ca;
const getCA = () => ca;

const getSerial = () => crypto.randomBytes(Math.ceil(16 / 2)).toString('hex').slice(0, 16).toUpperCase();
const keys = pki.rsa.generateKeyPair(2048);

const createCertificateAuthority = async(function* () {
  const certificate = pki.createCertificate();
  certificate.publicKey = keys.publicKey;
  certificate.serialNumber = getSerial();
  certificate.validity.notBefore = new Date();
  certificate.validity.notAfter = new Date();
  certificate.validity.notAfter.setFullYear(certificate.validity.notBefore.getFullYear() + 1);
  const attrs = [{
    name: 'commonName',
    value: 'phoenixmatrix_do_not_trust'
  }, {
    name: 'organizationName',
    value: 'do_not_trust_phoenixmatrix'
  }, {
    name: 'countryName',
    value: 'US'
  }];

  certificate.setExtensions([{
    name: 'basicConstraints',
    cA: true
  }]);

  certificate.setSubject(attrs);
  certificate.setIssuer(attrs);
  certificate.sign(keys.privateKey, md.sha256.create());

  ca = pki.certificateToPem(certificate);

  const privateKey = pki.privateKeyToPem(keys.privateKey);
  yield fs.writeFileAsync(caKeyPath, privateKey);
  return yield fs.writeFileAsync(caCertPath, ca);
});

let keyPairPaths = function(domain) {
  return {
    keyPath: `${directory}domains/${domain}.key`,
    certPath: `${directory}domains/${domain}.crt`
  };
};

let readKeyPair = async(function* (domain) {
  let { keyPath, certPath } = keyPairPaths(domain);
  let [key, certificate] = yield Promise.all([fs.readFileAsync(keyPath), fs.readFileAsync(certPath)]);

  return yield Promise.resolve({ key, certificate });
});

let isCertificateValid = async(function* (certPem) {
  const certificate = pki.certificateFromPem(certPem);
  return certificate.validity.notAfter > Date.now();
});

let getServerCertificate = async(function* (domain) {
  if(domainCertificates[domain]) {
    return yield Promise.resolve(domainCertificates[domain]);
  }

  let { keyPath, certPath } = keyPairPaths(domain);

  let result = null;
  let found = yield helpers.exists(keyPath, certPath);
  if(found) {
    result = yield readKeyPair(domain);
  }

  if(!result || !isCertificateValid(result.certificate)) {
    yield mkdirp(directory + 'domains');
    if(!fs.existsSync(caCertPath)) {
      yield createCertificateAuthority();
    } else {
      ca = yield fs.readFileAsync(caCertPath);
    }

    const csr = pki.createCertificationRequest();
    csr.publicKey = keys.publicKey;
    const attrs = [{
      name: 'commonName',
      value: domain
    }, {
      name: 'organizationName',
      value: 'do_not_trust_phoenixmatrix'
    }, {
      name: 'countryName',
      value: 'US'
    }];

    csr.setSubject(attrs);
    csr.sign(keys.privateKey, md.sha256.create());

    const caKeyPem = yield fs.readFileAsync(caKeyPath);
    const caKey = pki.privateKeyFromPem(caKeyPem);
    const caCertPem = yield fs.readFileAsync(caCertPath);
    const caCert = pki.certificateFromPem(caCertPem);

    var certificate = pki.createCertificate();
    certificate.serialNumber = getSerial();
    certificate.validity.notBefore = new Date();

    const expiration = moment(certificate.validity.notBefore);
    expiration.add(config.certificateExpiration, 'days');
    certificate.validity.notAfter = expiration.toDate();

    certificate.setSubject(csr.subject.attributes);
    certificate.setIssuer(caCert.subject.attributes);
    certificate.publicKey = csr.publicKey;
    certificate.sign(caKey, md.sha256.create());

    const serverCertificate = pki.certificateToPem(certificate);
    const serverKey = pki.privateKeyToPem(keys.privateKey);

    yield Promise.all([
      fs.writeFileAsync(certPath, serverCertificate),
      fs.writeFileAsync(keyPath, serverKey)
    ]);

    result = yield Promise.resolve({key: serverKey, certificate: serverCertificate});
  }

  domainCertificates[domain] = result;
  return yield Promise.resolve(result);
});

export default {
  createCertificateAuthority,
  getServerCertificate,
  getCA
}
