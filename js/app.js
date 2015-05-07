import 'babel/polyfill';
import React from 'react';
import domready from "domready";
import PhoenixMatrixApp from './components/PhoenixMatrixApp';
import requestStore from './stores/request-store';

requestStore.init();

domready(function () {
  React.render(
    <PhoenixMatrixApp />,
    document.body
  );
});
