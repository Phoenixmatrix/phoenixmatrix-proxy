import React from 'react';
import pure from '../utils/pure';
import HttpHeaders from './HttpHeaders';
import RequestBody from './RequestBody';

export default class ResponseDetail extends React.Component {
  render() {
    const request = this.props.request;

    return (
      <div className="response-detail">
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Response</h4>
          </div>
          <div className="panel-body">
            <HttpHeaders headers={request.responseHeaders} />
            <RequestBody body={request.responseBody} />
          </div>
        </div>
      </div>
    );
  }
}

ResponseDetail.propTypes = {
  request: React.PropTypes.object
};

pure(ResponseDetail);

