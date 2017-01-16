import {generateKeyPair, createCertificateAuthority} from '../certificate';
import * as forge from 'node-forge';

const forgeFixtures = <any>forge;
const {pki} = forge;

describe('generateKeyPair', () => {
  it('creates a key pair', () => {
    const keyPair = generateKeyPair();
    expect(keyPair).toMatchSnapshot();
  });
});

describe('createCertificateAuthority', () => {
  it('it generates a private key and certificate pair', () => {
    const keyPair = generateKeyPair();

    const ca = createCertificateAuthority(keyPair);
    const spy = <jest.Mock<String>>pki.privateKeyToPem;
    expect(spy.mock.calls.length).toBe(1);
    expect(spy.mock.calls[0]).toEqual([keyPair.privateKey]);

    expect(ca.privateKey).toBe(forgeFixtures.pemPrivateKeyFixture);
    expect(ca.certificate).toBe(forgeFixtures.pemCertificateFixture);
  });
});