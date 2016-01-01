import React from 'react';
import classNames from 'classnames';
import pure from '../utils/pure';

export default class RequestDetailHeader extends React.Component {

  render() {
    const request = this.props.request;

    const classes = classNames({
      'request-header': true,
      'well': (!request.statusCode || request.statusCode < 400) && !request.error,
      'alert alert-danger': request.error || request.statusCode >= 400
    });

    return (
      <div className={classes}>
        <div className="request-properties">
          <span>{request.statusCode} </span>
          <span>{request.method} </span>
          <span>
            {(request.isSSL ? 'https://' : 'http://') + request.host}
          </span><span>{request.port ? (':' + request.port) : ''}</span>
        </div>
        <div className="request-url">
          <span>{request.path}</span>
        </div>
      </div>
    );
  }
}

RequestDetailHeader.propTypes = {
  request: React.PropTypes.object
};

pure(RequestDetailHeader);
