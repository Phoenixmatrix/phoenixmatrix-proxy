import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';
import pure from '../utils/pure';

import requestActions from '../actions/request-actions';
import configActions from '../actions/config-actions';

export default class VerticalButtonBar extends React.Component {
  onClearClick() {
    requestActions.clear();
  }

  onTogglePauseClick() {
    requestActions.togglePause();
  }

  onToggleConnectClick() {
    configActions.toggleConnect();
  }

  render() {
    const pauseClasses = classNames({
      'fa': true,
      'fa-pause': true,
      'selected': this.props.paused
    });

    const connectClasses = classNames({
      'fa': true,
      'fa-server': true,
      'selected': this.props.config.includeConnect
    });

    return (
      <ul className="button-toolbar">
        <OverlayTrigger placement="right" overlay={<Tooltip>Clear requests</Tooltip>}>
          <li className="fa fa-ban" onClick={() => this.onClearClick()} />
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={<Tooltip>Pause capture</Tooltip>}>
          <li className={pauseClasses} onClick={() => this.onTogglePauseClick()} />
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={<Tooltip>Display CONNECT requests</Tooltip>}>
          <li className={connectClasses} onClick={() => this.onToggleConnectClick()} />
        </OverlayTrigger>
      </ul>
    );
  }
}

VerticalButtonBar.propTypes = {
  paused: React.PropTypes.bool,
  config: React.PropTypes.object
};

pure(VerticalButtonBar);
