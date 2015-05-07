import React from 'react';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],

  getInitialState: function() {
    return { showBody: false };
  },

  toggle: function() {
    this.setState({showBody: !this.state.showBody});
  },

  render: function() {
    const body = this.props.body;
    let content = null;
    if(body && body.length) {
      let contentBody;
      if(this.state.showBody) {
        contentBody = <div className="panel-body">{body}</div>;
    }

      content = <div className="panel panel-primary request-body">
        <div className="panel-heading" onClick={this.toggle}>Body</div>
        {contentBody}
      </div>;
    }

    return content;
  }
});
