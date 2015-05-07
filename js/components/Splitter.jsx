import React from 'react';
import classNames from 'classnames';

export default React.createClass({
  getInitialState: function() {
    return {dragging: false, handlerPos: this.props.initialPosition || 100};
  },

  onMouseUp: function() {
    this.setState({dragging: false});
  },

  onMouseMove: function(e) {
    if(!this.state.dragging) {
      return;
    }

    const bounds = React.findDOMNode(this).getBoundingClientRect();
    const pane1min = this.refs.pane1.props.minSize;
    const pane2min = this.refs.pane2.props.minSize;

    let pos = 0;

    if (this.props.orientation === 'vertical') {
      var height = bounds.bottom - bounds.top;
      pos = e.clientY - bounds.top;

      if (pos < pane1min) {
        return;
      }

      if (height - pos < pane2min){
        return;
      }

      this.setState({ handlerPos: pos});
    } else {
      var width = bounds.right - bounds.left;
      pos = e.clientX - bounds.left;

      if (pos < pane1min){
        return;
      }
      if (width - pos < pane2min) {
        return;
      }

      this.setState({handlerPos: pos});
    }
  },

  onMouseDown: function(e) {
    e.preventDefault();
    this.setState({dragging: true});
  },

  componentDidMount() {
    document.addEventListener('mouseup', this.onMouseUp);
    document.addEventListener('mousemove', this.onMouseMove);
  },

  componentWillUnmount() {
    document.removeEventListener('mouseup', this.onMouseUp);
    document.removeEventListener('mousemove', this.onMouseMove);
  },

  render: function() {
    const horizontal = this.props.orientation === 'horizontal';

    const classes = classNames({
      "split-panes": true,
      "horizontal": horizontal,
      "vertical": !horizontal
    });

    const children = this.props.children;
    const pane1 = children[0];
    const pane2 = children[1];

    const handlerStyles = {};
    const pane1Styles = {};
    const pane2Styles = {};

    const pane1min = pane1.props.minSize || 0;
    const pane2min = pane2.props.minSize || 0;

    const positionStyle = this.state.handlerPos + 'px'

    if(horizontal) {
      pane1Styles.width = pane2Styles.left = handlerStyles.left = positionStyle;
    } else {
      pane1Styles.height = pane2Styles.top = handlerStyles.top = positionStyle;
    }

    return (
      <div className={classes} ref="container">
        <div className="split-pane1" ref="pane1" style={pane1Styles} minSize={pane1min}>{pane1}</div>
        <div className="split-handler" style={handlerStyles} onMouseDown={this.onMouseDown}></div>
        <div className="split-pane2" ref="pane2" style={pane2Styles} minSize={pane2min}>{pane2}</div>
      </div>
    );
  }
});