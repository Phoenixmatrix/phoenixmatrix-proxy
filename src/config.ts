import * as path from 'path';
import rootConfig from '../phoenixmatrix.config.js';

type GlobalConfiguration = {
  rootDirectory: string
  certificatesPath: string
}

const globalConfiguration: GlobalConfiguration = {
  rootDirectory: rootConfig.rootDirectory,
  certificatesPath: path.resolve(rootConfig.rootDirectory, rootConfig.certificatesPath)
};

export default globalConfiguration;
