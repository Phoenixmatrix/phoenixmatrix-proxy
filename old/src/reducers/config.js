import {LOAD_CONFIG, TOGGLE_CONNECT} from '../actions/config';

const initialState = {
  includeConnect: false
};

export default function config(state = initialState, action) {
  switch (action.type) {
  case LOAD_CONFIG:
    return {...state, ...action.config, configLoaded: true};
  case TOGGLE_CONNECT:
    return {...state, includeConnect: action.includeConnect};
  default:
    return state;
  }
}
