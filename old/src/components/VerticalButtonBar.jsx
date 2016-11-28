import React from 'react';
import classNames from 'classnames';
import pure from '../lib/pure';

import styles from '../../stylesheets/toolbar';

export default class VerticalButtonBar extends React.Component {
  render() {
    const {onClear, onToggleConnect, onTogglePause, paused, includeConnect} = this.props;

    const pauseClasses = classNames({
      [styles.selected]: paused,
      [styles.li]: true
    });

    const connectClasses = classNames({
      [styles.selected]: includeConnect,
      [styles.li]: true
    });

    return (
      <ul className={styles.buttonToolbar}>
        <li className={styles.li} onClick={() => onClear()} title='Clear requests'>
          <span className='fa fa-ban'></span>
        </li>
        <li className={pauseClasses} onClick={() => onTogglePause()} title='Pause capture'>
          <span className='fa fa-pause'></span>
        </li>
        <li className={connectClasses} onClick={() => onToggleConnect()} title='Display CONNECT requests'>
          <span className='fa fa-server'></span>
        </li>
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
