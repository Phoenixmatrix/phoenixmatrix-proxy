import React from 'react';
import pure from '../lib/pure';
import VerticalButtonBar from './VerticalButtonBar';
import RequestList from './RequestList';

export default class LeftSection extends React.Component {
  render() {
    const {
      onSelectRequest,
      onClear,
      onToggleConnect,
      onTogglePause,
      paused,
      includeConnect,
      requests,
      selectedRequest
    } = this.props;

    return (
      <div className="left-section">
        <VerticalButtonBar
          paused={paused}
          includeConnect={includeConnect}
          onClear={onClear}
          onToggleConnect={onToggleConnect}
          onTogglePause={onTogglePause}
        />
        <RequestList
          requests={requests}
          selectedRequest={selectedRequest}
          onSelectRequest={onSelectRequest}
        />
      </div>
    );
  }
}

LeftSection.propTypes = {
  paused: React.PropTypes.bool,
  includeConnect: React.PropTypes.bool,
  requests: React.PropTypes.array,
  selectedRequest: React.PropTypes.object,
  onSelectRequest: React.PropTypes.func,
  onClear: React.PropTypes.func,
  onToggleConnect: React.PropTypes.func,
  onTogglePause: React.PropTypes.func
};


pure(LeftSection);
