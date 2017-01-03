const {generateKeyPair, createCA} = require('../certificate');

describe('generateKeyPair', () => {
  it('creates a key pair', () => {
    const keyPair = generateKeyPair();
    expect(typeof keyPair.privateKey).toBe('string');
    expect(typeof keyPair.publicKey).toBe('string');
  });
});

describe('createCA', () => {
  it('it generates a private key and certificate pair', () => {

  });
});