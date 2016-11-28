// This will eventually become a command line version of the proxy. For now though, it's very broken.

var proxyFactory = require('./src/lib/proxy');

var onRequest = function(data) {
    console.log('request: ' + data.method + ' ' + data.url);
};

var onResponse = function(data) {
    console.log('response: ' + data.method + ' ' + data.url);
};

var httpProxy;
proxyFactory.createHttpProxy({port: 3002}).then(function(proxy) {
    httpProxy = proxy;
    proxy.on('proxyRequest', onRequest);
    proxy.on('proxyResponse', onResponse);
    proxy.on('proxyConnect', function(data) {
        console.log('connect request: ' + data.state + ' ' + data.url + ':' + data.port);
    });
    return proxyFactory.createHttpsProxy({port: 8443});
})
.then(function(httpsProxy) {
    httpsProxy.on('proxyRequest', onRequest);
    httpsProxy.on('proxyResponse', onResponse);
    httpProxy.enableHttpsProxy(httpsProxy);
});







