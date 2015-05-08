import React from 'react/addons';
const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  render: function() {
    return (
      <div className="footer-section"></div>
    );
  }
});
