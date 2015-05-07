import { EventEmitter } from 'events';
import _ from 'lodash';
import { coroutine as async } from 'bluebird';
import AppDispatcher from '../dispatchers/AppDispatcher';
import config from '../lib/config';
import proxyFactory from '../lib/proxy';
import requestConstants from '../constants/request-constants';

let requests = [];
let requestsMap = {};
let filteredRequests = [];
let filterExpression = '';
let paused = false;
let selectedRequest = null;

const CHANGE_EVENT = 'change';

function isMatch(request) {
  return (request.url && request.url.indexOf(filterExpression) > -1) ||
    (request.host && request.host.indexOf(filterExpression) > -1) ||
    (request.statusCode && request.statusCode.toString().indexOf(filterExpression) > -1) ||
    (request.method && request.method.indexOf(filterExpression) > -1);
}

const requestStore = _.extend({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  selectRequest: function(request) {
    selectedRequest = request;
  },

  getSelectedRequest: function() {
    return selectedRequest;
  },

  addOrUpdate: function(request) {
    var originalRequest = requestsMap[request.id];
    if(originalRequest) {
      var completedRequest = _.cloneDeep(originalRequest);
      requestsMap[request.id] = completedRequest;
      _.extend(completedRequest, request);

      var index = requests.lastIndexOf(originalRequest);
      requests.splice(index, 1, completedRequest);

      if(!filterExpression || isMatch(completedRequest)) {
        var filteredIndex = filteredRequests.lastIndexOf(originalRequest);
        if(filteredIndex > -1) {
          filteredRequests = filteredRequests.slice();
          filteredRequests.splice(filteredIndex, 1, completedRequest);
        }
      }
    } else if(request.state !== 'response'){ //the user may have paused, and this is a response for a request we never caught
      requests.push(request);
      requestsMap[request.id] = request;

      if(!filterExpression || isMatch(request)) {
        filteredRequests = filteredRequests.slice();
        filteredRequests.push(request);
      }
    }
  },

  clearFilter: function() {
    filterExpression = '';
    filteredRequests = requests.slice();
  },

  filter: function(expression) {
    if(!expression || !expression.trim()) {
      this.clearFilter();
    } else {
      filterExpression = expression;
      filteredRequests = requests.filter(function(request) {
        return isMatch(request);
      });
    }
  },

  getView: function() {
    return filteredRequests;
  },

  getRequest: function(id) {
    return requestsMap[id];
  },

  isPaused: function() {
    return paused;
  },

  clear: function() {
    requests = [];
    filteredRequests = [];
    requestsMap = {};
  },

  togglePause: function() {
    paused = !paused;
  },

  init: async(function* () {
    const pushData = (data) => {
      if(!paused && data.id) {
        this.addOrUpdate(data);
        if(selectedRequest && selectedRequest.id && selectedRequest.id === data.id) {
          selectedRequest = requests.getRequest(data.id);
        }

        this.emitChange();
      }
    };

    const httpProxy = yield proxyFactory.createHttpProxy({port: config.proxyPort })

    httpProxy.on('proxyRequest', pushData);
    httpProxy.on('proxyResponse', pushData);
    httpProxy.on('proxyConnect', pushData);
    const httpsProxy = yield proxyFactory.createHttpsProxy({port: config.httpsProxyPort });

    httpsProxy.on('proxyRequest', pushData);
    httpsProxy.on('proxyResponse', pushData);
    httpProxy.enableHttpsProxy(httpsProxy);
  })
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action) {
    case requestConstants.SELECT_REQUEST:
      requestStore.selectRequest(payload.request);
      requestStore.emitChange();
      break;
    case requestConstants.SET_FILTER:
      if(payload.expression !== filterExpression) {
        requestStore.filter(payload.expression);
        requestStore.emitChange();
      }
      break;
    case requestConstants.CLEAR:
      requestStore.clear()
      requestStore.emitChange();
      break;
    case requestConstants.TOGGLE_PAUSE:
      requestStore.togglePause();
      requestStore.emitChange();
      break;
    default:
      return true;
  }

  return true;
});

export default requestStore;
