import AppDispatcher from '../dispatchers/AppDispatcher';
import requestConstants from '../constants/request-constants';

export default {
  selectRequest: function(request) {
    AppDispatcher.dispatch({
      action: requestConstants.SELECT_REQUEST,
      request: request
    });
  },

  setFilter: function(expression) {
    AppDispatcher.dispatch({
      action: requestConstants.SET_FILTER,
      expression
    });
  },

  clear: function() {
    AppDispatcher.dispatch({
      action: requestConstants.CLEAR
    });
  },

  togglePause: function() {
    AppDispatcher.dispatch({
      action: requestConstants.TOGGLE_PAUSE
    });
  }
};
