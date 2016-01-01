import React from 'react';
import ReactDOM from 'react-dom';
import PhoenixMatrixApp from './components/PhoenixMatrixApp';
import requestStore from './stores/request-store';

requestStore.init();

ReactDOM.render(
  <PhoenixMatrixApp />,
  document.getElementById('main')
);
