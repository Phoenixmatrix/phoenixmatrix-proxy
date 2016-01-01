import _ from 'lodash';

import React from 'react';
import pure from '../utils/pure';

import requestActions from '../actions/request-actions';

export default class Header extends React.Component {
  componentWillMount() {
    this.setFilter = _.debounce(this.setFilter, 500);
  }

  onChange(e) {
    this.setFilter(e.target.value);
  }

  setFilter(expression) {
    requestActions.setFilter(expression.trim());
  }

  render() {
    return (
      <div className="header-section navbar navbar-inverse navbar-fixed-top">
        <span className="navbar-brand">PhoenixMatrix web debugging proxy v0.1 Preview</span>
        <form className="navbar-form navbar-right">
          <input
            ref="searchInput"
            type="text"
            className="form-control"
            placeholder="Search..."
            onChange={(e) => this.onChange(e)}
          />
        </form>
      </div>
    );
  }
}

pure(Header);
