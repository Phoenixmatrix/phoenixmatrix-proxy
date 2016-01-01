import AppDispatcher from '../dispatchers/AppDispatcher';
import configConstants from '../constants/config-constants';

export default {
  toggleConnect() {
    AppDispatcher.dispatch({
      action: configConstants.TOGGLE_CONNECT
    });
  }
};
