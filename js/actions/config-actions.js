import AppDispatcher from '../dispatchers/AppDispatcher';
import configConstants from '../constants/config-constants';

export default {
  toggleConnect: function() {
    AppDispatcher.dispatch({
      action: configConstants.TOGGLE_CONNECT
    });
  }
};
