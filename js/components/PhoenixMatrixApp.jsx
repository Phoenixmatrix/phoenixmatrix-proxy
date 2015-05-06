import React from 'react';
import _ from 'lodash';

import Header from './Header';
import LeftSection from './LeftSection';
import MainSection from './MainSection';
import Footer from './Footer';
import Splitter from './Splitter';
import requestStore from '../stores/request-store';
import configStore from '../stores/config-store';

function getRequests() {
  return {
    requests: requestStore.getView(),
    selected: requestStore.getSelectedRequest(),
    paused: requestStore.isPaused()
  };
}

function getConfig() {
  return configStore.getConfig();
}

export default React.createClass({
  onRequestChange: function() {
    this.setState(getRequests());
  },

  onConfigChange: function() {
    this.setState({config: getConfig()});
  },

  getInitialState: function() {
    return _.extend({}, {config: getConfig()}, getRequests());
  },
  componentDidMount: function() {
    requestStore.on('change', this.onRequestChange);
    configStore.on('change', this.onConfigChange);
  },

  componentWillUnmount: function() {
    this.removeListener('change', this.onRequestChange);
    this.removeListener('change', this.onConfigChange);
  },

  render: function() {
    return (
      <div className="view-wrapper">
        <div className="main-section">
          <Header />
          <Splitter orientation="horizontal" initialPosition={400}>
            <div className="leftPane" minSize={275}>
              <LeftSection
                requests={this.state.requests}
                selectedRequest={this.state.selected}
                paused={this.state.paused}
                config={this.state.config}
              />
            </div>
            <div className="rightPane" minSize={300}>
              <MainSection requests={this.state.requests} selectedRequest={this.state.selected} />
            </div>
          </Splitter>
        </div>
        <Footer />
      </div>
    );
  }
});
