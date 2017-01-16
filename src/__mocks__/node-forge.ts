function generateKeyPair() {
  return {privateKey: {}, publicKey: {}};
}

const mockCertificate = {
  validity: {},
  setExtensions: jest.fn(),
  setSubjects: jest.fn(),
  setIssuer: jest.fn(),
  sign: jest.fn()
};

function createCertificate() {
  return mockCertificate;
}

const certificateToPem = jest.fn();

const privateKeyToPem = jest.fn();

const rsa = {generateKeyPair};

export const pki = {rsa, createCertificate, certificateToPem, privateKeyToPem};

const sha256 = {
  create: jest.fn()
}
export const md = {sha256};
