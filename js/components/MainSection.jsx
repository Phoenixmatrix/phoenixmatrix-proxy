import React from 'react';
import pure from '../utils/pure';
import RequestDetail from './RequestDetail';
import ResponseDetail from './ResponseDetail';

export default class MainSection extends React.Component {
  render() {
    const request = this.props.selectedRequest;

    let requestDetail;
    let responseDetail;

    if (request) {
      requestDetail = <RequestDetail request={request} />;
      responseDetail = <ResponseDetail request={request} />;
    }

    return (
      <div className="content-section">
        {requestDetail}
        {responseDetail}
      </div>
    );
  }
}

MainSection.propTypes = {
  selectedRequest: React.PropTypes.object
};

pure(MainSection);
