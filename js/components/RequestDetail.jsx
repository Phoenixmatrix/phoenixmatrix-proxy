import React from 'react/addons';
import RequestDetailHeader from './RequestDetailHeader';
import HttpHeaders from './HttpHeaders';
import RequestBody from './RequestBody';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
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
});
