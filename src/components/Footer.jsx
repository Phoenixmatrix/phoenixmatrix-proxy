import React from 'react';
import pure from '../lib/pure';

import styles from '../../stylesheets/footer';

export default class Footer extends React.Component {
  render() {
    return <div className={styles.footerSection}></div>;
  }
}
pure(Footer);
