import React from 'react';
import pure from '../utils/pure';
import VerticalButtonBar from './VerticalButtonBar';
import RequestList from './RequestList';

export default class LeftSection extends React.Component {
  render() {
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
}

LeftSection.propTypes = {
  paused: React.PropTypes.bool,
  config: React.PropTypes.object,
  requests: React.PropTypes.array,
  selectedRequest: React.PropTypes.object
};


pure(LeftSection);
