import _ from 'lodash';

import React from 'react';
import requestActions from '../actions/request-actions';

export default React.createClass({
  setFilter: function(expression) {
    requestActions.setFilter(expression.trim());
  },

  onChange: function(e) {
    this.setFilter(e.target.value);
  },

  componentWillMount: function() {
    this.setFilter = _.debounce(this.setFilter, 500);
  },

  render: function() {
    return (
      <div className="header-section navbar navbar-inverse navbar-fixed-top">
        <span className="navbar-brand">PhoenixMatrix web debugging proxy v0.1 Preview</span>
        <form className="navbar-form navbar-right">
          <input ref="searchInput" type="text" className="form-control" placeholder="Search..." onChange={this.onChange} />
        </form>
      </div>
    );
  }
});
