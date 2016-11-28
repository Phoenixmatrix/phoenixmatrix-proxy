import _ from 'lodash';
import config from '../lib/config';

export const TOGGLE_CONNECT = 'TOGGLE_CONNECT';
export const LOAD_CONFIG = 'LOAD_CONFIG';

export const loadConfig = () => {
  return {type: LOAD_CONFIG, config: _.cloneDeep(config)};
};

export const toggleConnect = () => {
  config.includeConnect = !config.includeConnect;
  return {type: TOGGLE_CONNECT, includeConnect: config.includeConnect};
};
