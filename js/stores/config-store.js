import { EventEmitter } from 'events';
import _ from 'lodash';
import config from '../lib/config';
import AppDispatcher from '../dispatchers/AppDispatcher';
import configConstants from '../constants/config-constants';

const CHANGE_EVENT = 'change';

const configStore = _.extend({}, EventEmitter.prototype, {
  emitChange: function() {
    this.emit(CHANGE_EVENT);
  },

  toggleConnect: function() {
    config.includeConnect = !config.includeConnect;
  },

  getConfig: function() {
    return _.cloneDeep(config);
  }
});

AppDispatcher.register(function(payload) {
  var action = payload.action;

  switch(action) {
    case configConstants.TOGGLE_CONNECT:
      configStore.toggleConnect();
      configStore.emitChange();
      break;
    default:
      return true;
  }

  return true;
});

export default configStore;
