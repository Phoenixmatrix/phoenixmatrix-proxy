import _ from 'lodash';

import React from 'react';
import pure from '../lib/pure';

export default class Header extends React.Component {
  componentWillMount() {
    const {onFilterChange} = this.props;
    this.onFilterChangeDebounced = _.debounce(onFilterChange, 500);
  }

  onChange(e) {
    this.onFilterChangeDebounced(e.target.value);
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

Header.propTypes = {
  onFilterChange: React.PropTypes.func
};

pure(Header);
