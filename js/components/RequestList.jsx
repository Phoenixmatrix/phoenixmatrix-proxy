import React from 'react/addons';

import RequestListItem from './RequestListItem';

const PureRenderMixin = React.addons.PureRenderMixin;
const ITEM_HEIGHT = 50;
const BUFFER_SIZE = 100;

export default React.createClass({
  mixins: [PureRenderMixin],
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
    var node = React.findDOMNode(this.refs.scrollingList);
    this.scrollPosition = node.scrollTop;
    this.height = node.offsetHeight;
    this.shouldScrollBottom = this.scrollPosition + this.height >= node.scrollHeight;
  },

  componentDidUpdate: function () {
    var node = React.findDOMNode(this.refs.scrollingList);
    var virtualContainer = React.findDOMNode(this.refs.virtualContainer);
    var list = React.findDOMNode(this.refs.requestList);

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
      listItems.push(<RequestListItem
        key={request.id}
        request={request}
        selected={this.props.selectedRequest && this.props.selectedRequest.id === request.id}
      />);
    }, this);

    return (
      <div className="requests">
        <div ref="scrollingList" className="request-list-scroll">
          <div ref="virtualContainer" className="requests-virtual-container">
            <ul ref="requestList" className="request-list">
              {listItems}
            </ul>
          </div>
        </div>
      </div>
    );
  }
});
