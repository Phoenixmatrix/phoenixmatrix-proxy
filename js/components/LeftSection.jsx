import React from 'react/addons';

import VerticalButtonBar from './VerticalButtonBar';
import RequestList from './RequestList';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="left-section">
        <VerticalButtonBar paused={this.props.paused} config={this.props.config} />
        <RequestList
          requests={this.props.requests}
          selectedRequest={this.props.selectedRequest}
        />
      </div>
    );
  }
});
