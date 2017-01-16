import * as forge from 'node-forge';

declare module "node-forge" {
  type Attributes = Array<{name: string, value: string}>;
  type Extensions = Array<Object>;
  type Hash = Object;
  type Pem = string;

  export module pki {
    interface Certificate {
      setExtensions(extension: Extensions),
      setSubjects(attributes: Attributes),
      setIssuer(attributes: Attributes),
      sign(key: Key, Hash)
    }

    function createCertificate(): forge.pki.Certificate;
    function certificateToPem(Certificate): Pem
  }

  export module md {
    export module sha256 {
      function create(): Hash
    }
  }
}
