import angular from '../lib/angular';

export default function() {
  var requests = [];
  var requestsMap = {};
  var filteredRequests = [];
  var filterExpression = '';

  var isMatch = function(request) {
    return (request.url && request.url.indexOf(filterExpression) > -1) ||
      (request.host && request.host.indexOf(filterExpression) > -1) ||
      (request.statusCode && request.statusCode.toString().indexOf(filterExpression) > -1) ||
      (request.method && request.method.indexOf(filterExpression) > -1);
  };

  return {
    addOrUpdate: function(request) {
      var originalRequest = requestsMap[request.id];
      if(originalRequest) {
        var completedRequest = angular.copy(originalRequest);
        requestsMap[request.id] = completedRequest;
        angular.extend(completedRequest, request);

        var index = requests.lastIndexOf(originalRequest);
        requests.splice(index, 1, completedRequest);

        if(!filterExpression || isMatch(completedRequest)) {
          var filteredIndex = filteredRequests.lastIndexOf(originalRequest);
          if(filteredIndex > -1) {
            filteredRequests = filteredRequests.slice();
            filteredRequests.splice(filteredIndex, 1, completedRequest);
          }
        }
      } else if(request.state !== 'response'){ //the user may have paused, and this is a response for a request we never caught
        requests.push(request);
        requestsMap[request.id] = request;

        if(!filterExpression || isMatch(request)) {
          filteredRequests = filteredRequests.slice();
          filteredRequests.push(request);
        }
      }
    },

    clearFilter: function() {
      filterExpression = '';
      filteredRequests = requests.slice();
    },

    filter: function(expression) {
      if(!expression || !expression.trim()) {
        this.clearFilter();
      } else {
        filterExpression = expression;
        filteredRequests = requests.filter(function(request) {
            return isMatch(request);
        });
      }
    },

    getView: function() {
      return filteredRequests;
    },

    getRequest: function(id) {
      return requestsMap[id];
    },

    clear: function() {
      requests = [];
      filteredRequests = [];
    }
  };
};
