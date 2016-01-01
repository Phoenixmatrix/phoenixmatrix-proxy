import React from 'react';
import pure from '../utils/pure';
import _ from 'lodash';

export default class HttpHeaders extends React.Component {
  constructor() {
    super();
    this.state = {showTable: true};
  }

  toggle() {
    this.setState({showTable: !this.state.showTable});
  }

  render() {
    const headers = this.props.headers;

    let content = null;
    let headerTable;

    if (headers && Object.keys(headers).length) {
      if (this.state.showTable) {
        headerTable = (
          <table className="table table-hover">
            <tbody>
            {
              _.map(headers, (value, key) => {
                return (
                  <tr key={key}>
                    <td>{key}</td>
                    <td>{value}</td>
                  </tr>
                );
              })
            }
            </tbody>
          </table>
        );
      }

      content = (
        <div className="panel panel-primary headers-list">
          <div className="panel-heading" onClick={() => this.toggle()}>
            Headers
          </div>
          {headerTable}
        </div>
      );
    }

    return content;
  }
}

HttpHeaders.propTypes = {
  headers: React.PropTypes.object
};

pure(HttpHeaders);
