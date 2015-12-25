import 'babel/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import domready from "domready";
import PhoenixMatrixApp from './components/PhoenixMatrixApp';
import requestStore from './stores/request-store';

requestStore.init();

domready(function () {
  ReactDOM.render(
    <PhoenixMatrixApp />,
    document.body
  );
});
