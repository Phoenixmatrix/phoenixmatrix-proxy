import React from 'react/addons';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import classNames from 'classnames';

import requestActions from '../actions/request-actions';
import configActions from '../actions/config-actions';
const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  onClearClick: function() {
    requestActions.clear();
  },

  onTogglePauseClick: function() {
    requestActions.togglePause();
  },

  onToggleConnectClick: function() {
    configActions.toggleConnect();
  },

  render: function() {
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
        <OverlayTrigger placement='right' overlay={<Tooltip>Clear requests</Tooltip>}>
          <li className="fa fa-ban" onClick={this.onClearClick}></li>
        </OverlayTrigger>
        <OverlayTrigger placement='right' overlay={<Tooltip>Pause capture</Tooltip>}>
          <li className={pauseClasses} onClick={this.onTogglePauseClick}></li>
        </OverlayTrigger>
        <OverlayTrigger placement='right' overlay={<Tooltip>Display CONNECT requests</Tooltip>}>
          <li className={connectClasses} onClick={this.onToggleConnectClick}></li>
        </OverlayTrigger>
      </ul>
    );
  }
});
