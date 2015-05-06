import React from 'react';
import RequestDetail from './RequestDetail';
import ResponseDetail from './ResponseDetail';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    const request = this.props.selectedRequest;

    let requestDetail;
    let responseDetail;

    if(request) {
      requestDetail = <RequestDetail request={request} />;
      responseDetail = <ResponseDetail request={request} />;
    }

    return (
      <div className="content-section">
        {requestDetail}
        {responseDetail}
      </div>
    );
  }
});
