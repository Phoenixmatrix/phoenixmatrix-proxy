import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';
import pure from '../lib/pure';

export default class VerticalButtonBar extends React.Component {
  render() {
    const {onClear, onToggleConnect, onTogglePause, paused, includeConnect} = this.props;

    const pauseClasses = classNames({
      'fa': true,
      'fa-pause': true,
      'selected': paused
    });

    const connectClasses = classNames({
      'fa': true,
      'fa-server': true,
      'selected': includeConnect
    });

    return (
      <ul className="button-toolbar">
        <OverlayTrigger placement="right" overlay={<Tooltip>Clear requests</Tooltip>}>
          <li className="fa fa-ban" onClick={() => onClear()} />
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={<Tooltip>Pause capture</Tooltip>}>
          <li className={pauseClasses} onClick={() => onTogglePause()} />
        </OverlayTrigger>
        <OverlayTrigger placement="right" overlay={<Tooltip>Display CONNECT requests</Tooltip>}>
          <li className={connectClasses} onClick={() => onToggleConnect()} />
        </OverlayTrigger>
      </ul>
    );
  }
}

VerticalButtonBar.propTypes = {
  paused: React.PropTypes.bool,
  includeConnect: React.PropTypes.bool,
  onClear: React.PropTypes.func,
  onToggleConnect: React.PropTypes.func,
  onTogglePause: React.PropTypes.func
};

pure(VerticalButtonBar);
