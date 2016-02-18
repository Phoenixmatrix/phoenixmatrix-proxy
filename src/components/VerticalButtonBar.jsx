import React from 'react';
import {OverlayTrigger, Tooltip} from 'react-bootstrap';
import classNames from 'classnames';
import pure from '../lib/pure';

import styles from '../../stylesheets/toolbar';

export default class VerticalButtonBar extends React.Component {
  render() {
    const {onClear, onToggleConnect, onTogglePause, paused, includeConnect} = this.props;

    const pauseClasses = classNames({
      'fa': true,
      'fa-pause': true,
      [styles.selected]: paused,
      [styles.li]: true
    });

    const connectClasses = classNames({
      'fa': true,
      'fa-server': true,
      [styles.selected]: includeConnect,
      [styles.li]: true
    });

    return (
      <ul className={styles.buttonToolbar}>
        <OverlayTrigger placement="right" overlay={<Tooltip>Clear requests</Tooltip>}>
          <li className={`fa fa-ban ${styles.li}`} onClick={() => onClear()} />
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
