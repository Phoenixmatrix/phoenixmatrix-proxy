import React from 'react';
import pure from '../utils/pure';
import RequestDetailHeader from './RequestDetailHeader';
import HttpHeaders from './HttpHeaders';
import RequestBody from './RequestBody';

export default class RequestDetail extends React.Component {
  render() {
    const request = this.props.request;

    return (
      <div className="request-detail">
        <RequestDetailHeader request={request} />
        <div className="panel panel-default">
          <div className="panel-heading">
            <h4>Request</h4>
          </div>
          <div className="panel-body">
            <HttpHeaders headers={request.headers} />
            <RequestBody body={request.body} />
          </div>
        </div>
      </div>
    );
  }
}

RequestDetail.propTypes = {
  request: React.PropTypes.object
};

pure(RequestDetail);
