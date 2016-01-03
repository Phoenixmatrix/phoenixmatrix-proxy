export const SELECT_REQUEST = 'SELECT_REQUEST';
export const UPDATE_REQUEST = 'APPEND_REQUEST';
export const SET_FILTER = 'SET_FILTER';
export const CLEAR = 'CLEAR';
export const TOGGLE_PAUSE = 'TOGGLE_PAUSE';

export const selectRequest = request => ({type: SELECT_REQUEST, request});
export const updateRequest = request => ({type: UPDATE_REQUEST, request});
export const setFilter = expression => {
  const filter = expression ? expression.trim() : '';
  return {type: SET_FILTER, filter};
};
export const clear = () => ({type: CLEAR});
export const togglePause = () => ({type: TOGGLE_PAUSE});

export const pushRequest = (data) => {
  return (dispatch, getState) => {
    const {config: {paused}} = getState();
    if (!paused && data.id) {
      dispatch(updateRequest(data));
    }
  };
};

