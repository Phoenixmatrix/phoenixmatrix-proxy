import React from 'react';
import pure from '../utils/pure';
import RequestListItem from './RequestListItem';

const ITEM_HEIGHT = 50;
const BUFFER_SIZE = 100;

export default class RequestList extends React.Component {
  componentDidMount() {
    this.attachScrollListener();
  }

  componentWillUpdate() {
    const node = this.refs.scrollingList;
    this.scrollPosition = node.scrollTop;
    this.height = node.offsetHeight;
    this.shouldScrollBottom = this.scrollPosition + this.height >= node.scrollHeight;
  }

  componentDidUpdate() {
    const node = this.refs.scrollingList;
    const virtualContainer = this.refs.virtualContainer;
    const list = this.refs.requestList;

    const count = this.props.requests.length;
    virtualContainer.style.height = count * ITEM_HEIGHT + 'px';
    list.style.top = this.start * ITEM_HEIGHT + 'px';

    if (this.shouldScrollBottom) {
      node.scrollTop = node.scrollHeight;
    }

    this.attachScrollListener();
  }

  componentWillUnmount() {
    this.detachScrollListener();
  }

  onScroll() {
    this.forceUpdate();
  }

  detachScrollListener() {
    const node = this.refs.scrollingList;
    node.removeEventListener('scroll', this.onScroll);
  }

  attachScrollListener() {
    const node = this.refs.scrollingList;
    node.addEventListener('scroll', this.onScroll);
  }

  render() {
    const requests = this.props.requests;
    const listItems = [];
    const scrollY = this.scrollPosition;
    const start = Math.max((scrollY / ITEM_HEIGHT - BUFFER_SIZE | 0), 0);
    const end = Math.min(start + (this.height / ITEM_HEIGHT + (BUFFER_SIZE * 2) | 0), requests.length);

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
}

RequestList.propTypes = {
  requests: React.PropTypes.array,
  selectedRequest: React.PropTypes.object
};

pure(RequestList);
