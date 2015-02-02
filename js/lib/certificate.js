import Promise from 'bluebird';
import fs from 'fs';
import { spawn } from 'child_process';

import mkdirp from 'mkdirp';
import helpers from './helpers';
import _  from 'lodash';
import config from './config';

fs = Promise.promisifyAll(fs);
mkdirp = Promise.promisify(mkdirp);

let directory = './certificate/';
let conf = './openssl.cnf';
let caCertPath = directory + 'ca.crt';
let caKeyPath = directory + 'ca.key';
let serialPath = directory + 'serial.seq';

let spawnCommand = function(command, params, input) {
  params = params.slice(0);
  params.unshift(command);
  let process = spawn('openssl', params);
  let output = '';
  let errorOutput = '';

  return new Promise(function(resolve, reject) {
    process.stdout.on('data', function(data) {
      output += data;
    });

    process.stderr.on('data', function(data) {
      errorOutput += data;
    });

    process.on('close', function(code) {
      if(code > 0) {
        console.log(command + ' exited with code ' + code);
        reject(errorOutput);
      } else {
        resolve(output);
      }
    });

    if(input) {
      process.stdin.write(input);
    }
    process.stdin.end();
  });
};

let runningCommand = Promise.resolve();
let spawnCommandSafe = Promise.coroutine(function* (command, params, input) {
  try {
    yield runningCommand;
    return yield (runningCommand = spawnCommand(command, params, input));
  } catch(err) {
    console.log(err);
    runningCommand = Promise.resolve();
  }
});

var domainCertificates = {};
var ca;
var getCA = () => ca;

var createCertificateAuthority = Promise.coroutine(function* () {
  yield spawnCommandSafe('genrsa', ['-out', caKeyPath, '2048']);
  let request = yield spawnCommandSafe('req', ['-new', '-key', caKeyPath, '-config', conf, '-subj', '/CN=phoenixmatrix_do_not_trust/O=do_not_trust_phoenixmatrix/C=US']);
  let certificate = yield spawnCommandSafe('x509', ['-req', '-sha256', '-days', config.certificateExpiration, '-signkey', caKeyPath], request);
  ca = certificate;
  return yield fs.writeFileAsync(caCertPath, certificate);
});

let keyPairPaths = function(domain) {
  return {
    keyPath: `${directory}domains/${domain}.key`,
    certPath: `${directory}domains/${domain}.crt`
  };
};

let readKeyPair = Promise.coroutine(function* (domain) {
  let { keyPath, certPath } = keyPairPaths(domain);
  let [key, certificate] = yield Promise.all([fs.readFileAsync(keyPath), fs.readFileAsync(certPath)]);

  return yield Promise.resolve({ key, certificate });
});

let isCertificateValid = Promise.coroutine(function* (certificate) {
  let info = yield spawnCommandSafe('x509', ['-noout', '-text'], certificate);
  return Date.parse(info.match(/Not After\s?:\s?([^\n]*)\n/)[1]) < Date.now();
});

let getServerCertificate = Promise.coroutine(function* (domain) {
  if(domainCertificates[domain]) {
    return yield Promise.resolve(domainCertificates[domain]);
  }

  let { keyPath, certPath } = keyPairPaths(domain);

  let result = null;

  let exists = yield helpers.exists(keyPath, certPath);
  if(exists) {
    result = yield readKeyPair(domain);
  }

  if(!result || !isCertificateValid(result.certificate)) {
    yield mkdirp(directory + 'domains');
    if(!fs.existsSync(caCertPath)) {
      yield createCertificateAuthority();
    } else {
      ca = yield fs.readFileAsync(caCertPath);
    }

    yield spawnCommandSafe('genrsa', [ '-out', keyPath, '2048']);
    let request = yield spawnCommandSafe('req', ['-new', '-key', keyPath, '-config', conf, '-subj', '/O=do_not_trust_phoenixmatrix/C=US/CN=' + domain]);
    yield spawnCommandSafe('x509', ['-req', '-out', certPath, '-sha256', '-days', config.certificateExpiration, '-CA', caCertPath, '-CAkey', caKeyPath, '-CAcreateserial', '-CAserial', serialPath], request);

    result = yield readKeyPair(domain);
  }

  domainCertificates[domain] = result;
  return yield Promise.resolve(result);
});

exports.createCertificateAuthority = createCertificateAuthority;
exports.getServerCertificate = getServerCertificate;
exports.getCA = getCA;