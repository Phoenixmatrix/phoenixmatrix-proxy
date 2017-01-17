import * as path from 'path';
import * as fs from 'fs';
import {Observable} from 'rxjs';
import {pki, md} from 'node-forge';
import config from './config';
import lazy from './lazy';
import {generateKeyPair, createCertificateAuthority} from './certificate';

const caCertPath = path.resolve(config.certificatesPath, 'ca.crt');
const caKeyPath = path.resolve(config.certificatesPath, 'ca.key');

const readFile$ = Observable.bindNodeCallback<string, string, string>(fs.readFile);
const writeFile$ = Observable.bindNodeCallback<string, string, void>(fs.writeFile);

const keyPair$ = lazy(() => generateKeyPair());

const readCaPair$ = Observable
  .forkJoin(
    readFile$(caKeyPath, 'utf8'),
    readFile$(caCertPath, 'utf8'),
    (key,  certificate) => ({key, certificate})
  );

const writeCaPair$ = keyPair$
  .map(createCertificateAuthority)
  .mergeMap(({privateKey, certificate}) => {
    return Observable
      .forkJoin(
        writeFile$(caKeyPath, privateKey),
        writeFile$(caCertPath, certificate)
      )
      .map(() => ({privateKey, certificate}));
  });

const [caFound$, caNotFound$] = Observable.defer(() =>
  Observable.of(fs.existsSync(caCertPath) && fs.existsSync(caKeyPath))
)
  .partition(exists => exists);


const certificateAuthority$ = Observable
  .merge(caFound$.mergeMap(() => readCaPair$))
  .merge(caNotFound$.mergeMap(() => writeCaPair$));

export const certificateAuthority = certificateAuthority$;
