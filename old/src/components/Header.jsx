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
        <h1 className={styles.title}>{'PhoenixMatrix web debugging proxy v0.2.5 Preview'}</h1>
        <form className={styles.filterForm}>
          <input
            id='filterInput'
            className={styles.filterInput}
            ref='searchInput'
            type='text'
            placeholder='Search...'
            onChange={(e) => this.onChange(e)}
          />
          <label htmlFor='filterInput' className={styles.filterInputLabel}>
            <span className='fa fa-search'></span>
          </label>
        </form>
      </div>
    );
  }
}

Header.propTypes = {
  onFilterChange: React.PropTypes.func
};

pure(Header);
