import React from 'react';
import {coroutine as async} from 'bluebird';
import proxyFactory from '../lib/proxyFactory';

const initProxy = async(function* (onProxyEvent, proxyPort, httpsProxyPort) {
  const httpProxy = yield proxyFactory.createHttpProxy({port: proxyPort});

  httpProxy.on('proxyRequest', onProxyEvent);
  httpProxy.on('proxyResponse', onProxyEvent);
  httpProxy.on('proxyConnect', onProxyEvent);
  const httpsProxy = yield proxyFactory.createHttpsProxy({port: httpsProxyPort});

  httpsProxy.on('proxyRequest', onProxyEvent);
  httpsProxy.on('proxyResponse', onProxyEvent);
  httpProxy.enableHttpsProxy(httpsProxy);
});

export default class Proxy extends React.Component {
  componentWillMount() {
    const {onProxyEvent, proxyPort, httpsProxyPort} = this.props;
    initProxy(onProxyEvent, proxyPort, httpsProxyPort);
  }

  render() {
    return false;
  }
}

Proxy.propTypes = {
  onProxyEvent: React.PropTypes.func,
  proxyPort: React.PropTypes.number,
  httpsProxyPort: React.PropTypes.number
};

export default Proxy;
