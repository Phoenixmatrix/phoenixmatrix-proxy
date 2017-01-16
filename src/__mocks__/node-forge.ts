export const pemPrivateKeyFixture =
`-----BEGIN RSA PRIVATE KEY-----
MGICAQACEQCAovssw5Da4ASH7dFpwwzhAgMBAAECEALPjN11iHy/0FOsIH7T4GEC
CQDTYSxRw2yKPwIJAJvKbc3H4WDfAghy+88iAw5N/QIIZ4IEmH+gH/MCCQCD17z+
oB5vxw==
-----END RSA PRIVATE KEY-----
`;

export const pemCertificateFixture =
`-----BEGIN CERTIFICATE-----
MIICUTCCAfugAwIBAgIBADANBgkqhkiG9w0BAQQFADBXMQswCQYDVQQGEwJDTjEL
MAkGA1UECBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMC
VU4xFDASBgNVBAMTC0hlcm9uZyBZYW5nMB4XDTA1MDcxNTIxMTk0N1oXDTA1MDgx
NDIxMTk0N1owVzELMAkGA1UEBhMCQ04xCzAJBgNVBAgTAlBOMQswCQYDVQQHEwJD
TjELMAkGA1UEChMCT04xCzAJBgNVBAsTAlVOMRQwEgYDVQQDEwtIZXJvbmcgWWFu
ZzBcMA0GCSqGSIb3DQEBAQUAA0sAMEgCQQCp5hnG7ogBhtlynpOS21cBewKE/B7j
V14qeyslnr26xZUsSVko36ZnhiaO/zbMOoRcKK9vEcgMtcLFuQTWDl3RAgMBAAGj
gbEwga4wHQYDVR0OBBYEFFXI70krXeQDxZgbaCQoR4jUDncEMH8GA1UdIwR4MHaA
FFXI70krXeQDxZgbaCQoR4jUDncEoVukWTBXMQswCQYDVQQGEwJDTjELMAkGA1UE
CBMCUE4xCzAJBgNVBAcTAkNOMQswCQYDVQQKEwJPTjELMAkGA1UECxMCVU4xFDAS
BgNVBAMTC0hlcm9uZyBZYW5nggEAMAwGA1UdEwQFMAMBAf8wDQYJKoZIhvcNAQEE
BQADQQA/ugzBrjjK9jcWnDVfGHlk3icNRq0oV7Ri32z/+HQX67aRfgZu7KWdI+Ju
Wm7DCfrPNGVwFWUQOmsPue9rZBgO
-----END CERTIFICATE-----
`

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

const certificateToPem = jest.fn(() => pemCertificateFixture);

const privateKeyToPem = jest.fn(() => pemPrivateKeyFixture);

const rsa = {generateKeyPair};

export const pki = {rsa, createCertificate, certificateToPem, privateKeyToPem};

const sha256 = {
  create: jest.fn()
}
export const md = {sha256};
