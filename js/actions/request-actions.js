import AppDispatcher from '../dispatchers/AppDispatcher';
import requestConstants from '../constants/request-constants';

export default {
  selectRequest(request) {
    AppDispatcher.dispatch({
      action: requestConstants.SELECT_REQUEST,
      request
    });
  },

  setFilter(expression) {
    AppDispatcher.dispatch({
      action: requestConstants.SET_FILTER,
      expression
    });
  },

  clear() {
    AppDispatcher.dispatch({
      action: requestConstants.CLEAR
    });
  },

  togglePause() {
    AppDispatcher.dispatch({
      action: requestConstants.TOGGLE_PAUSE
    });
  }
};
