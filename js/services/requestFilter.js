export default function() {
  return {
    includeRequest: function(request, expression) {
      return (request.url && request.url.indexOf(expression) > -1) ||
        (request.statusCode && request.statusCode.toString().indexOf(expression) > -1) ||
        (request.method && request.method.indexOf(expression) > -1);
    },

    filter: function(requests, expression) {
      return requests.filter(function(request) {
        return this.includeRequest(request, expression);
      }, this);
    }
  };
};