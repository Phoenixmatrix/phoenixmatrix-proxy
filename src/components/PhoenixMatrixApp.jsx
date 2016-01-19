import React from 'react';
import {connect} from 'react-redux';

import Proxy from './Proxy';
import Header from './Header';
import LeftSection from './LeftSection';
import MainSection from './MainSection';
import Footer from './Footer';
import Splitter from './Splitter';

import {loadConfig, toggleConnect} from '../actions/config';
import {setFilter, selectRequest, pushRequest, togglePause, clear} from '../actions/requests';

import '../../vendor/bootstrap/css/bootstrap.min';
import '../../vendor/font-awesome/css/font-awesome';
import '../../stylesheets/splitter';
import '../../stylesheets/style';

class PhoenixMatrixApp extends React.Component {
  componentWillMount() {
    const {onLoadConfig} = this.props;
    onLoadConfig();
  }

  render() {
    const {
      onProxyEvent,
      onSelectRequest,
      onClear,
      onToggleConnect,
      onTogglePause,
      onFilterChange,
      proxyPort,
      httpsProxyPort,
      requests,
      selectedRequest,
      paused,
      includeConnect,
      configLoaded
    } = this.props;

    let proxy = null;
    if (configLoaded) {
      proxy = <Proxy proxyPort={proxyPort} httpsProxyPort={httpsProxyPort} onProxyEvent={onProxyEvent} />;
    }

    return (
      <div className="view-wrapper">
        {proxy}
        <div className="main-section">
          <Header onFilterChange={onFilterChange}/>
          <Splitter orientation="horizontal" initialPosition={400}>
            <div className="leftPane" minSize={275}>
              <LeftSection
                requests={requests}
                selectedRequest={selectedRequest}
                paused={paused}
                includeConnect={includeConnect}
                onSelectRequest={onSelectRequest}
                onClear={onClear}
                onToggleConnect={onToggleConnect}
                onTogglePause={onTogglePause}
              />
            </div>
            <div className="rightPane" minSize={300}>
              <MainSection requests={requests} selectedRequest={selectedRequest} />
            </div>
          </Splitter>
        </div>
        <Footer />
      </div>
    );
  }
}

PhoenixMatrixApp.propTypes = {
  configLoaded: React.PropTypes.bool,
  proxyPort: React.PropTypes.number,
  httpsProxyPort: React.PropTypes.number,
  requests: React.PropTypes.array,
  selectedRequest: React.PropTypes.object,
  paused: React.PropTypes.bool,
  includeConnect: React.PropTypes.bool,
  onLoadConfig: React.PropTypes.func,
  onProxyEvent: React.PropTypes.func,
  onSelectRequest: React.PropTypes.func,
  onClear: React.PropTypes.func,
  onToggleConnect: React.PropTypes.func,
  onTogglePause: React.PropTypes.func,
  onFilterChange: React.PropTypes.func
};

function mapStateToProps(state) {
  const requests = state.requests.filteredRequests.map(id => state.requests.requestsMap[id]);
  return {
    proxyPort: state.config.proxyPort,
    httpsProxyPort: state.config.httpsProxyPort,
    requests,
    selectedRequest: state.requests.selectedRequest,
    paused: state.requests.paused,
    includeConnect: state.config.includeConnect,
    configLoaded: state.config.configLoaded
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onProxyEvent: (request) => {
      dispatch(pushRequest(request));
    },
    onLoadConfig: () => dispatch(loadConfig()),
    onSelectRequest: request => dispatch(selectRequest(request)),
    onClear: () => dispatch(clear()),
    onToggleConnect: () => dispatch(toggleConnect()),
    onTogglePause: () => dispatch(togglePause()),
    onFilterChange: (filter) => dispatch(setFilter(filter))
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoenixMatrixApp);
