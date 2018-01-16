import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { getCommentsForJob, toggleComments } from '../../actions/comments';
import { like, unlike  } from '../../actions/jobs';

/**
 * Contains the commenting and like buttons for a given job; controls showing comments or not
 * @method jobActionSection
 * @module letters/components
 * @param  {Function}        props
 */
const JobActionSection = props => {
    const { likes, liked, unlikeJob, likeJob, loadAndShowComments, showComments } = props;
    return (
        <div className="job-actions">
            <button onClick={ likeJob} > {likes.length } 
            <i className={'fa fa-thumbs-up' } />{' '}
                </button>
                < button onClick={unlikeJob } >
                <i className={'fa fa-thumbs-down'} />{' '}
            </button>
            <button onClick={loadAndShowComments} className="open">
                <i className="fa fa-commenting-o" />{' '}
                <i className={`fa ${showComments ? 'fa-angle-up' : 'fa-angle-down'}`} />
            </button>
        </div>
    );
};

JobActionSection.propTypes = {
    liked: PropTypes.bool.isRequired,
    likes: PropTypes.array.isRequired,
    showComments: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => {
    const { jobId } = ownProps;
    const { likes, showComments } = state.jobs[jobId];
    const comments = state.commentIds.find(commentId => state.comments[commentId].id === jobId);
    const liked = likes.find(like => state.user.id === like.userId);
    return {
        likes,
        liked: Boolean(liked),
        showComments: Boolean(showComments),
        comments
    };
};

const mapDispatchToProps = (dispatch, ownProps) => {
    const { jobId } = ownProps;
    return {
        loadAndShowComments() {
            dispatch(toggleComments(jobId));
            dispatch(getCommentsForJob(jobId));
        },
        likejob() {
            dispatch(like(jobId));
        },
        unlikejob() {
            dispatch(unlike(jobId));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(JobActionSection);
