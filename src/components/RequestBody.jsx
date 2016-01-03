import React from 'react';
import pure from '../lib/pure';

export default class RequestBody extends React.Component {
  constructor() {
    super();
    this.state = {showBody: false};
  }

  toggle() {
    this.setState({showBody: !this.state.showBody});
  }

  render() {
    const body = this.props.body;
    let content = null;
    if (body && body.length) {
      let contentBody;
      if (this.state.showBody) {
        contentBody = <div className="panel-body">{body}</div>;
      }

      content = (
        <div className="panel panel-primary request-body">
          <div className="panel-heading" onClick={() => this.toggle()}>Body</div>
          {contentBody}
        </div>
      );
    }

    return content;
  }
}

RequestBody.propTypes = {
  body: React.PropTypes.string
};

pure(RequestBody);
