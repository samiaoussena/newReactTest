import * as types from '../constants/types';
import * as API from '../shared/http';
import { createError } from './error';

/**
 * Show comments for a job
 * @method showComments

 * @param  {string}     jobId job id
 * @return {object}
 */
export function showComments(jobId) {
    return {
        type: types.comments.SHOW,
        jobId
    };
}

/**
 * Toggle comments for a job open or closed
 * @method toggleComments

 * @param  {string}       jobId job id to toggle comments for
 * @return {object}
 */
export function toggleComments(jobId) {
    return {
        type: types.comments.TOGGLE,
        jobId
    };
}

/**
 * Update what comments are available to the app
 * @method updateAvailableComments

 * @param  {Array<object>}                comments incoming comments
 * @return {object}
 */
export function updateAvailableComments(comments) {
    return {
        type: types.comments.GET,
        comments
    };
}

/**
 * Create a comment
 * @method createComment

 * @param  {object}      payload comment payload
 * @return {object}
 */
export function createComment(payload) {
    return dispatch => {
        return API.createComment(payload)
            .then(res => res.json())
            .then(comment => {
                dispatch({
                    type: types.comments.CREATE,
                    comment
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

/**
 * Load the comments for a particular job
 * @method getCommentsForjob

 * @param  {string}           jobId job id to load for
 * @return {object}
 */
export function getCommentsForJob(jobId) {
    return dispatch => {
        return API.fetchCommentsForjob(jobId)
            .then(res => res.json())
            .then(comments => dispatch(updateAvailableComments(comments)))
            .catch(err => dispatch(createError(err)));
    };
}
