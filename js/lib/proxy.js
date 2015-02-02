import net from 'net';
import http from 'http';
import https from 'https';
import connect from 'connect';
import crypto from 'crypto';
import uuid from 'node-uuid';
import zlib from 'zlib';
import url from 'url';

import Promise from 'bluebird';
import cert from './certificate';
import config from './config';

var requestProcessors = [];

var handleRequest = function(server, req, res, processors) {
  if(processors.length) {
    processors[0].call(server, req, res, handleRequest.bind(null, server, req, res, processors.slice(1)));
  }
};

requestProcessors.push(function (req, res, next) {
  req.id = uuid.v4();
  req.body = '';

  req.on('error', function(err) {
    console.log(err);
  });

  if(req.method === 'POST') {
    req.on('data', function (chunk) {
      req.body += chunk;
    });
  }
  next();
});

requestProcessors.push(function(req, res, next) {
  var parsedUrl = url.parse(req.url);
  var emitRequest = () => {
    this.emit('proxyRequest', {
      id: req.id,
      url: req.url,
      path: parsedUrl.path,
      port: req.port,
      method: req.method,
      headers: req.headers,
      isSSL: req.isSSL,
      host: req.headers ? req.headers.host : '',
      body: req.body,
      timestamp: new Date().getTime(),
      state: 'request'
    });
  };

  if(req.method === 'POST') {
    req.on('end', function() {
      emitRequest();
    });
  } else {
    emitRequest();
  }

  next();
});

let emitResponse = function(server, req, res, body) {
  server.emit('proxyResponse', {
    id: req.id,
    url: req.url,
    port: req.port,
    method: req.method,
    responseHeaders: res.headers,
    error: req.error,
    state: 'response',
    statusCode: req.error && res.statusCode === 200 ? null : res.statusCode,
    responseBody: body && body.length > 0 ? body : null
  });
};

requestProcessors.push(function(req, res, next) {
  var server = this;
  req.on('response', function(response) {
    var responseDecoder = response;

    if(response.headers['content-encoding'] === 'gzip') {
      var gunzip = zlib.createGunzip();
      responseDecoder = gunzip;
      response.pipe(gunzip);
    }

    var responseBody = '';
    responseDecoder.on('data', function(chunk) {
      responseBody += chunk;
    });

    responseDecoder.on('end', function() {
      emitResponse(server, req, response, responseBody);
    });
  });

  next();
});

requestProcessors.push(function (req, res, next) {
  let server = this;
  var parts = req.headers.host.split(':', 2);
  var options = {};

  ['method', 'headers', 'host', 'hostname'].forEach(function (property) {
    if (req[property]) {
      options[property] = req[property];
    }
  });

  var parsedUrl = url.parse(req.url);
  var isSSL = req.isSSL;

  options.rejectUnauthorized = false;
  options.agent = false;
  options.host = parts[0];
  options.path = parsedUrl.path;
  options.port = parts[1] || (isSSL ? 443 : 80);
  if(isSSL) {
    options.secureProtocol = 'TLSv1_method';
  }

  var forwardRequest = isSSL ? https.request(options) : http.request(options);

  req.on('aborted', function () {
    console.log('aborted!');
    forwardRequest.abort();
  });

  forwardRequest.on('error', function (err) {
    console.log(err);
    forwardRequest.abort();
    if(err.code === "ENOTFOUND") {
      res.statusCode = 400;
    }

    req.error = true;

    res.end();
    emitResponse(server, req, res);
  });

  forwardRequest.on('close', function() {
    forwardRequest.connection.end();
  });

  forwardRequest.on('response', function (response) {
    if (!response.headers.connection) {
      response.headers.connection = req.headers.connection || 'keep-alive';
    }

    Object.keys(response.headers).forEach(function (key) {
      res.setHeader(key, response.headers[key]);
    });

    response.on('end', function() {
      forwardRequest.connection.end();
      res.end();
    });

    res.writeHead(response.statusCode);
    req.emit('response', response);
    response.pipe(res, {end:true});
  });

  req.pipe(forwardRequest);
  next();
});

var getSecureContext = function(keys) {
  return crypto.createCredentials({
    key: keys.key,
    cert: keys.certificate,
    ca: cert.getCA()
  }).context;
};

var certCache = {};

var sniCallback = (hostname) => getSecureContext(certCache[hostname]);

var createHttpsProxy = function(options) {
  return new Promise(function(resolve) {
    cert.getServerCertificate('localhost').then(function(keys) {
      certCache['localhost'] = keys;
      var httpsProxyServer = https.createServer({SNICallback: sniCallback, key: keys.key, cert: keys.certificate, ca: cert.getCA()}, function(req, res) {
        req.isSSL = true;
        handleRequest(httpsProxyServer, req, res, requestProcessors);
      });

      httpsProxyServer.listen(options.port, function() {
        console.log('Proxy listening on port %d', httpsProxyServer.address().port);
      });

      httpsProxyServer.on('error', function(err) {
        console.log(err);
      });

      resolve(httpsProxyServer);
    });
  });
};

var createHttpProxy = function(options) {
  return new Promise(function(resolve) {
    var proxyServer = http.createServer(function (req, res) {
      handleRequest(proxyServer, req, res, requestProcessors);
    });

    proxyServer.on('connect', function (req, socket, head) {
      var parts = req.url.split(':', 2);
      var targetHost = parts[0];

      var port = this.httpsProxyPort ? this.httpsProxyPort : parts[1];
      var host = this.httpsProxyPort ? 'localhost' : parts[0];

      var handleConnect = function () {
        var conn = net.connect(port, host, function () {
          socket.setNoDelay();
          socket.write("HTTP/1.1 200 OK\r\n\r\n");
          socket.pipe(conn);
          conn.pipe(socket);
        });

        socket.on('error', function (err) {
          console.log(err);
          conn.end();
        });

        conn.on('error', function (err) {
          console.log(err);
          socket.end();
        });

        if(config.includeConnect) {
          proxyServer.emit('proxyConnect', {
            id: uuid.v4(),
            url: parts[0],
            host: parts[0],
            method: 'CONNECT',
            port: parts[1],
            timestamp: new Date().getTime(),
            state: 'connect'
          });
        }
      };

      if (!certCache[targetHost]) {
        cert.getServerCertificate(targetHost).then(function (keys) {
          certCache[targetHost] = keys;
          handleConnect();
        });
      } else {
        handleConnect();
      }
    });

    proxyServer.on('error', function (err) {
      console.log(err);
    });

    proxyServer.enableHttpsProxy = function (httpsProxy) {
      this.httpsProxyPort = httpsProxy.address().port;
    };

    proxyServer.disableHttpsProxy = function () {
      delete this.httpsProxyPort;
    };

    proxyServer.listen(options.port, function () {
      console.log('Proxy listening on port %d', proxyServer.address().port);
    });

    resolve(proxyServer);
  });
};

exports.createHttpProxy = createHttpProxy;
exports.createHttpsProxy = createHttpsProxy;
