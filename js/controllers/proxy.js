import proxyFactory from '../lib/proxy';
import config from '../lib/config';

export default ['$scope', '$timeout', '$window', 'requests', function($scope, $timeout, $window, requests) {
  $scope.proxy = {};
  $scope.proxy.requests = [];

  this.config = config;

  var pushData = (data) => {
    if(!this.paused && data.id) {
      requests.addOrUpdate(data);
      if($scope.selectedRequest && $scope.selectedRequest.id && $scope.selectedRequest.id === data.id) {
        $scope.selectedRequest = requests.getRequest(data.id);
      }

      $scope.proxy.requests = requests.getView();
      $scope.$digest();
    }
  };

  var httpProxy;
  var httpsProxy;
  proxyFactory.createHttpProxy({port: config.proxyPort }).then(function(proxy) {
    httpProxy = proxy;
    proxy.on('proxyRequest', pushData);
    proxy.on('proxyResponse', pushData);
    proxy.on('proxyConnect', pushData);
    return proxyFactory.createHttpsProxy({port: config.httpsProxyPort });
  })
  .then(function(proxy) {
    httpsProxy = proxy;
    proxy.on('proxyRequest', pushData);
    proxy.on('proxyResponse', pushData);
    httpProxy.enableHttpsProxy(proxy);
  });

  $scope.$watch('requestFilter', function(newValue, oldValue) {
    if(newValue !== null && newValue !== oldValue) {
      requests.filter(newValue.trim());
      $scope.proxy.requests = requests.getView();
    }
  });

  this.selectRequest = function(request) {
    $scope.selectedRequest = request;
  };

  this.togglePause = () => {
    this.paused = !this.paused;
  };

  this.toggleConnect = () => {
    options.includeConnect = !options.includeConnect;
  };

  this.clear = function() {
    requests.clear();
    $scope.proxy.requests = requests.getView();
  };
}];