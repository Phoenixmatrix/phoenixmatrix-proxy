import _ from 'lodash';
import {SELECT_REQUEST, UPDATE_REQUEST, SET_FILTER, CLEAR, TOGGLE_PAUSE} from '../actions/requests';

const initialState = {
  requests: [],
  filteredRequests: [],
  requestsMap: {}
};

const isMatch = (filter, request) => {
  return (request.url && request.url.indexOf(filter) > -1) ||
    (request.host && request.host.indexOf(filter) > -1) ||
    (request.statusCode && request.statusCode.toString().indexOf(filter) > -1) ||
    (request.method && request.method.indexOf(filter) > -1);
};

const updateRequest = (state, action) => {
  if (state.paused || !action.request.id) {
    return state;
  }

  const requestsMap = {...state.requestsMap};
  const filteredRequests = [...state.filteredRequests];
  const filter = state.filter;
  const request = action.request;
  const original = requestsMap[request.id];
  const requests = [...state.requests];

  if (original) {
    const updatedRequest = {...original, ...request};
    requestsMap[request.id] = updatedRequest;
    const filteredIndex = filteredRequests.lastIndexOf(request.id);
    if (!filter || isMatch(filter, updatedRequest)) {
      if (filteredIndex < 0) {
        filteredRequests.push(request.id);
      }
    } else if (filteredIndex > 0) {
      filteredRequests.splice(filteredIndex, 1);
    }
  // the user may have paused, and this is a response for a request we never caught
  } else if (request.state !== 'response') {
    requestsMap[request.id] = request;
    requests.push(request.id);
    if (!filter || isMatch(filter, request)) {
      filteredRequests.push(request.id);
    }
  }

  return {...state, requestsMap, requests, filteredRequests};
};

export default function config(state = initialState, action) {
  switch (action.type) {
  case SELECT_REQUEST:
    return {...state, selectedRequest: state.requestsMap[action.request.id]};
  case UPDATE_REQUEST:
    return updateRequest(state, action);
  case SET_FILTER:
    const filter = action.filter;
    const filteredRequests = filter.length
      ? state.requests.filter(id => isMatch(filter, state.requestsMap[id]))
      : [...state.requests];
    return {...state, filter, filteredRequests};
  case CLEAR:
    return {...state, ...initialState};
  case TOGGLE_PAUSE:
    return {...state, paused: !state.paused};
  default:
    return state;
  }
}
