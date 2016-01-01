import React from 'react';
import classNames from 'classnames';
import pure from '../utils/pure';
import requestActions from '../actions/request-actions';

const ITEM_HEIGHT = 50;

export default class RequestListItem extends React.Component {
  handleClick() {
    requestActions.selectRequest(this.props.request);
  }

  render() {
    const request = this.props.request;
    const classes = classNames({
      'request-item': true,
      'selected-request': this.props.selected,
      'pending-request': request.state !== 'response' && request.method !== 'CONNECT',
      'error-request': request.statusCode >= 400 || request.error,
      'cached-request': request.statusCode === 304
    });

    const style = {height: ITEM_HEIGHT + 'px'};

    return (
      <li className={classes} style={style} onClick={() => this.handleClick()}>
        <div className="request-properties">
          <span className="request-status-code">{request.method === 'CONNECT' ? request.method : request.statusCode}</span>
          <span className="request-method">{request.method === 'CONNECT' ? '' : request.method}</span>
          <span className="request-protocol">{request.isSSL ? 'https' : 'http'}</span>
          <span className="request-host">{request.host + (request.port ? ':' + request.port : '')}</span>
        </div>
        <div className="request-path">{request.path}</div>
      </li>
    );
  }
}

RequestListItem.propTypes = {
  request: React.PropTypes.object,
  selected: React.PropTypes.bool,
};

pure(RequestListItem);
