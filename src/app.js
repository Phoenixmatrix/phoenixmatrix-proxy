import React from 'react';
import ReactDOM from 'react-dom';
import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';

import PhoenixMatrixApp from './components/PhoenixMatrixApp';
import reducer from './reducers';

const createStoreWithMiddleware = applyMiddleware(
  thunk
)(createStore);
const store = createStoreWithMiddleware(reducer);

ReactDOM.render(
  <Provider store={store}>
    <PhoenixMatrixApp />
  </Provider>,
  document.getElementById('main')
);
