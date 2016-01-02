import React from 'react';
import ReactDOM from 'react-dom';
import classNames from 'classnames';
import pure from '../lib/pure';

export default class Splitter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {dragging: false, handlerPos: props.initialPosition || 100};
  }

  componentDidMount() {
    document.addEventListener('mouseup', () => this.onMouseUp());
    document.addEventListener('mousemove', e => this.onMouseMove(e));
  }

  componentWillUnmount() {
    document.removeEventListener('mouseup', () => this.onMouseUp());
    document.removeEventListener('mousemove', e => this.onMouseMove(e));
  }

  onMouseUp() {
    this.setState({dragging: false});
  }

  onMouseMove(e) {
    if (!this.state.dragging) {
      return;
    }

    const bounds = ReactDOM.findDOMNode(this).getBoundingClientRect();
    const pane1min = this.refs.pane1.minSize;
    const pane2min = this.refs.pane2.minSize;

    let pos = 0;

    if (this.props.orientation === 'vertical') {
      const height = bounds.bottom - bounds.top;
      pos = e.clientY - bounds.top;

      if (pos < pane1min) {
        return;
      }

      if (height - pos < pane2min) {
        return;
      }

      this.setState({handlerPos: pos});
    } else {
      const width = bounds.right - bounds.left;
      pos = e.clientX - bounds.left;

      if (pos < pane1min) {
        return;
      }
      if (width - pos < pane2min) {
        return;
      }

      this.setState({handlerPos: pos});
    }
  }

  onMouseDown(e) {
    e.preventDefault();
    this.setState({dragging: true});
  }

  render() {
    const horizontal = this.props.orientation === 'horizontal';

    const classes = classNames({
      'split-panes': true,
      horizontal,
      vertical: !horizontal
    });

    const children = this.props.children;
    const pane1 = children[0];
    const pane2 = children[1];

    const handlerStyles = {};
    const pane1Styles = {};
    const pane2Styles = {};

    const pane1min = pane1.minSize || 0;
    const pane2min = pane2.minSize || 0;

    const positionStyle = this.state.handlerPos + 'px';

    if (horizontal) {
      pane1Styles.width = pane2Styles.left = handlerStyles.left = positionStyle;
    } else {
      pane1Styles.height = pane2Styles.top = handlerStyles.top = positionStyle;
    }

    return (
      <div className={classes} ref="container">
        <div className="split-pane1" ref="pane1" style={pane1Styles} minSize={pane1min}>{pane1}</div>
        <div className="split-handler" style={handlerStyles} onMouseDown={(e) => this.onMouseDown(e)}></div>
        <div className="split-pane2" ref="pane2" style={pane2Styles} minSize={pane2min}>{pane2}</div>
      </div>
    );
  }
}

Splitter.propTypes = {
  orientation: React.PropTypes.string,
  minSize: React.PropTypes.number,
  initialPosition: React.PropTypes.number,
  children: React.PropTypes.node
};


pure(Splitter);
