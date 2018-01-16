import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import orderBy from 'lodash/orderBy';

import { createError } from '../actions/error';
import { createNewJob, getJobsForPage } from '../actions/jobs';
import { showComments } from '../actions/comments';
import Ad from '../components/ad/Ad';
import CreateJob from '../components/job/Create';
import Job from '../components/job/job';
import Welcome from '../components/welcome/Welcome';

export class Home extends Component {
    componentDidMount() {
        this.props.actions.getJobsForPage();
    }
    componentDidCatch(err, info) {
        this.props.actions.createError(err, info);
    }
    render() {
        return (
            <div className="home">
                <Welcome />
                <div>
                    <CreateJob onSubmit={this.props.actions.createNewJob} />
                    {this.props.jobs && (
                        <div className="jobs">
                            {this.props.jobs.map(job => (
                                <Job
                                    key={job.id}
                                    job={job}
                                    openCommentsDrawer={this.props.actions.showComments}
                                />
                            ))}
                        </div>
                    )}
                    <button className="block" onClick={this.props.actions.getNextPageOfJobs}>
                        Load more jobs
                    </button>
                </div>
                <div>
                    <Ad url="https://ifelse.io/book" imageUrl="/static/assets/ads/ria.png" />
                    <Ad url="https://ifelse.io/book" imageUrl="/static/assets/ads/orly.jpg" />
                </div>
            </div>
        );
    }
}

Home.propTypes = {
    jobs: PropTypes.arrayOf(PropTypes.object),
    actions: PropTypes.shape({
        createNewJob: PropTypes.func,
        getJobsForPage: PropTypes.func,
        showComments: PropTypes.func,
        createError: PropTypes.func,
        getNextPageOfJobs: PropTypes.func
    })
};
export const mapStateToProps = state => {
    const jobs = orderBy(state.jobIds.map(jobId => state.jobs[jobId]), 'date', 'desc');
    return {
        jobs
    };
};
export const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators(
            {
                createNewJob,
                getJobsForPage,
                showComments,
                createError,
                getNextPageOfJobs: getJobsForPage.bind(this, 'next')
            },
            dispatch
        )
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
