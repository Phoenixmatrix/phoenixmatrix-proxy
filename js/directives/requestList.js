import React from 'react/addons';

const ITEM_HEIGHT = 50;
const BUFFER_SIZE = 100;

export default function () {
  var PureRenderMixin = React.addons.PureRenderMixin;
  var RequestRow = React.createClass({
    mixins: [PureRenderMixin],
    handleClick: function (event) {
      this.props.onSelect(this.props.request);
    },
    render: function () {
      var request = this.props.request;
      var classes = React.addons.classSet({
        'request-item': true,
        'selected-request': this.props.selected,
        'pending-request': request.state !== 'response' && request.method !== 'CONNECT',
        'error-request': request.statusCode >= 400 || request.error,
        'cached-request' : request.statusCode === 304
      });

      return React.DOM.li({className: classes, style: { height: ITEM_HEIGHT + 'px' }, onClick: this.handleClick},
        React.DOM.div({className: 'request-properties'},
          React.DOM.span({className: 'request-status-code'}, request.method === 'CONNECT' ? request.method : request.statusCode),
          React.DOM.span({className: 'request-method'}, request.method === 'CONNECT' ? '' : request.method),
          React.DOM.span({className: 'request-protocol'}, request.isSSL ? 'https' : 'http'),
          React.DOM.span({className: 'request-host'}, request.host + (request.port ? ':' + request.port : ''))
        ),
        React.DOM.div({className: 'request-path'}, request.path)
      );
    }
  });

  var RequestList = React.createClass({
    mixins: [PureRenderMixin],
    getInitialState: function () {
      return {selectedRequestId: null};
    },
    setSelectedRequest: function (request) {
      this.setState({selectedRequest: request});
      this.props.onRequestSelected(request);
    },

    onScroll: function () {
      this.forceUpdate();
    },

    attachScrollListener: function () {
      var node = this.getDOMNode();
      node.addEventListener('scroll', this.onScroll);
    },

    detachScrollListener: function () {
      var node = this.getDOMNode();
      node.removeEventListener('scroll', this.onScroll);
    },

    componentDidMount: function () {
      this.attachScrollListener();
    },

    componentWillUnmount: function () {
      this.detachScrollListener();
    },

    componentWillUpdate: function () {
      var node = this.getDOMNode();
      this.scrollPosition = node.scrollTop;
      this.height = node.offsetHeight;
      this.shouldScrollBottom = this.scrollPosition + this.height >= node.scrollHeight;

    },
    componentDidUpdate: function () {
      var node = this.getDOMNode();
      var virtualContainer = node.children[0];
      var list = virtualContainer.children[0];

      var count = this.props.requests.length;
      virtualContainer.style.height = count * ITEM_HEIGHT + 'px';
      list.style.top = this.start * ITEM_HEIGHT + 'px';

      if (this.shouldScrollBottom) {
        node.scrollTop = node.scrollHeight;
      }

      this.attachScrollListener();
    },
    render: function () {
      var requests = this.props.requests;
      var listItems = [];
      var scrollY = this.scrollPosition;
      var start = Math.max((scrollY / ITEM_HEIGHT - BUFFER_SIZE | 0), 0);
      var end = Math.min(start + (this.height / ITEM_HEIGHT + (BUFFER_SIZE * 2) | 0), requests.length);

      this.start = start;
      requests.slice(start, end).forEach(function (request) {
        listItems.push(RequestRow({
          key: request.id,
          request: request,
          selected: this.state.selectedRequest && this.state.selectedRequest.id === request.id,
          onSelect: this.setSelectedRequest
        }));
      }, this);

      return React.DOM.div({
          className: 'request-list-scroll'
        },
        React.DOM.div({className: 'requests-virtual-container'},
          React.DOM.ul({
            className: 'request-list'
          }, listItems)
        )
      );
    }
  });

  var renderList = function (scope, element, updateScroll) {
    var props = {
      requests: scope.requests,
      onRequestSelected: function (request) {
        scope.$apply(function () {
          scope.selectedRequest = request;
          scope.requestSelected(request);
        });
      }
    };

    React.renderComponent(RequestList(props), element[0]);
  };

  return {
    scope: {
      requests: '=',
      requestSelected: '='
    },
    replace: true,
    link: function (scope, element) {
      scope.$watch('requests', function () {
        renderList(scope, element);
      });
    }
  };
}
