import {generateKeyPair, createCertificateAuthority} from '../certificate';

describe('generateKeyPair', () => {
  it('creates a key pair', () => {
    const keyPair = generateKeyPair();
    expect(keyPair).toMatchSnapshot();
  });
});

describe('createCertificateAuthority', () => {
  it('it generates a private key and certificate pair', () => {
    const keyPair = generateKeyPair();

    const certificateAuthority = createCertificateAuthority(keyPair);
  });
});