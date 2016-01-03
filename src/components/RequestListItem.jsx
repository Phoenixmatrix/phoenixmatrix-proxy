import React from 'react';
import classNames from 'classnames';
import pure from '../lib/pure';

const ITEM_HEIGHT = 50;

export default class RequestListItem extends React.Component {
  render() {
    const {onSelectRequest, request} = this.props;
    const classes = classNames({
      'request-item': true,
      'selected-request': this.props.selected,
      'pending-request': request.state !== 'response' && request.method !== 'CONNECT',
      'error-request': request.statusCode >= 400 || request.error,
      'cached-request': request.statusCode === 304
    });

    const style = {height: ITEM_HEIGHT + 'px'};

    return (
      <li className={classes} style={style} onClick={() => onSelectRequest(request)}>
        <div className="request-properties">
          <span className="request-status-code">
            {request.method === 'CONNECT' ? request.method : request.statusCode}
          </span>
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
  onSelectRequest: React.PropTypes.func
};

pure(RequestListItem);
