import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';

import { createComment } from '../../actions/comments';
import Loader from '../Loader';
import Comment from './Comment';
import CreateComment from './Create';

/**
 * Displays a number of comments
 * @method Comments
 * @param  {object} props
 */
const Comments = props => {
    const { comments, show, job, handleSubmit, user } = props;
    if (show && !comments) {
        return <Loader />;
    }
    return (
        <div className="comments">
            {show && [
                ...comments.map(comment => <Comment key={comment.id} comment={comment} />),
                <CreateComment key={job.id} handleSubmit={handleSubmit} job={job} user={user} />
            ]}
        </div>
    );
};

Comments.propTypes = {
    comments: PropTypes.array
};

const mapStateToProps = (state, ownProps) => {
    const { jobId } = ownProps;
    const job = state.jobs[jobId];
    const user = state.user;
    const comments = state.commentIds
        .filter(commentId => state.comments[commentId].jobId === jobId)
        .map(commentId => state.comments[commentId]);
    const show = job.showComments;
    return { comments, show, job, user };
};
const mapDispatchToProps = dispatch => {
    return {
        handleSubmit(comment) {
            dispatch(createComment(comment));
        }
    };
};
export default connect(mapStateToProps, mapDispatchToProps)(Comments);
