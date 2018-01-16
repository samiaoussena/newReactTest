import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import job from './job';

export function jobs(props) {
    return (
        <div className="jobs">{props.jobs.map(job => <job key={job.id} job={job} />)}</div>
    );
}
jobs.propTypes = {
    jobs: PropTypes.array
};
export function mapStateToProps(state) {
    return {
        jobs: state.jobs
    };
}
export default connect(mapStateToProps)(jobs);
