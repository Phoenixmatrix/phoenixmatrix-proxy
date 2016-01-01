import React from 'react';
import pure from '../utils/pure';
import _ from 'lodash';

import Header from './Header';
import LeftSection from './LeftSection';
import MainSection from './MainSection';
import Footer from './Footer';
import Splitter from './Splitter';
import requestStore from '../stores/request-store';
import configStore from '../stores/config-store';

const getRequests = () => {
  return {
    requests: requestStore.getView(),
    selected: requestStore.getSelectedRequest(),
    paused: requestStore.isPaused()
  };
};

const getConfig = () => {
  return configStore.getConfig();
};

export default class PhoenixMatrixApp extends React.Component {
  constructor() {
    super();
    this.state = Object.assign({}, {config: getConfig()}, getRequests());
  }

  componentDidMount() {
    requestStore.on('change', () => this.onRequestChange());
    configStore.on('change', () => this.onConfigChange());
  }

  componentWillUnmount() {
    this.removeListener('change', () => this.onRequestChange());
    this.removeListener('change', () => this.onConfigChange());
  }

  onRequestChange() {
    this.setState(getRequests());
  }

  onConfigChange() {
    this.setState({config: getConfig()});
  }

  render() {
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
}

pure(PhoenixMatrixApp);
