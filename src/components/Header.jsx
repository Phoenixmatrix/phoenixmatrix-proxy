import _ from 'lodash';

import React from 'react';
import pure from '../lib/pure';

import styles from '../../stylesheets/header';

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
      <div className={styles.headerSection}>
        <span>{'PhoenixMatrix web debugging proxy v0.2.5 Preview'}</span>
        <form className={styles.filterForm}>
          <input
            ref="searchInput"
            type="text"
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
