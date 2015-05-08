import React from 'react/addons';
import _ from 'lodash';

const PureRenderMixin = React.addons.PureRenderMixin;

export default React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function() {
    return { showTable: true };
  },

  toggle: function() {
    this.setState({showTable: !this.state.showTable});
  },

  render: function() {
    const headers = this.props.headers;

    let content = null;
    let headerTable;

    if(headers && Object.keys(headers).length) {
      if(this.state.showTable) {
        headerTable =
          <table className="table table-hover" ng-if="!collapseRequestHeaders">
            <tbody>
            {
              _.map(headers, function(value, key) {
                return <tr key={key}>
                  <td>{key}</td>
                  <td>{value}</td>
                </tr>;
              })
            }
            </tbody>
          </table>;
      }

      content = <div className="panel panel-primary headers-list">
        <div className="panel-heading" onClick={this.toggle}>
          Headers
        </div>
        {headerTable}
      </div>;
    }

    return content;
  }
});
