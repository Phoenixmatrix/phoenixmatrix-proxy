import React from 'react';
import RequestDetailHeader from './RequestDetailHeader';
import HttpHeaders from './HttpHeaders';
import RequestBody from './RequestBody';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
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
});

