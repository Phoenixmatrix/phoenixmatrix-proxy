import {combineReducers} from 'redux';
import config from './config';
import requests from './requests';

const rootReducer = combineReducers({
  config,
  requests
});

export default rootReducer;


