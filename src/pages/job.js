import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { loadJob } from '../actions/jobs';
import Ad from '../components/ad/Ad';
import Job from '../components/job/job';
import Link from '../components/router/Link';
import Loader from '../components/Loader';

/**
 * Component for a single-job page
 * @module letters/components
 * @type {Object}
 */
export class SingleJob extends Component {
    static propTypes = {
        params: PropTypes.shape({
            job: PropTypes.string
        })
    };
    componentDidMount() {
        // If we don't have a job yet, dispatch an action to load it
        if (!this.props.job) {
            this.props.actions.loadJob(this.props.router.params.jobId);
        }
    }
    render() {
        return this.props.job ? (
            <div className="single-job">
                <Link to="/">
                    <div className="back">
                        <i className="fa fa-arrow-left" /> Back
                    </div>
                </Link>
                <Job job={this.props.job} />
                <Ad
                    url="https://www.manning.com/books/react-in-action"
                    imageUrl="/static/assets/ads/ria.png"
                />
            </div>
        ) : (
            <Loader />
        );
    }
}

export const mapStateToProps = (state, ownProps) => {
    return {
        // try to directly read the job from our store and only fetch all jobs in
        // componentDidMount only if we have to
        job: state.jobs[ownProps.params.jobId]
    };
};
export const mapDispatchToProps = dispatch => {
    return {
        actions: bindActionCreators({ loadJob }, dispatch)
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(SingleJob);
