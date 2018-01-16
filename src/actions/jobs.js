import parseLinkHeader from 'parse-link-header';

import * as types from '../constants/types';
import * as API from '../shared/http';
import { createError } from './error';
import { getCommentsForjob } from './comments';

/**
 * Updates available jobs
 * @method updateAvailablejobs

 * @param  {Array<job> }             jobs array of incoming jobs
 * @return {object}
 */
export function updateAvailableJobs(jobs) {
    return {
        type: types.jobs.GET,
        jobs
    };
}

/**
 * Updates links used for pagination
 * @method updatePaginationLinks

 * @param  {object}              links parsed link headers
 * @return {object}
 */
export function updatePaginationLinks(links) {
    return {
        type: types.jobs.UPDATE_LINKS,
        links
    };
}

/**
 * Likes a job
 * @method like

 * @param  {string} jobId job id to like
 * @return {object}
 */
export function like(jobId) {
    return (dispatch, getState) => {
        const { user } = getState();
        return API.likejob(jobId, user.id)
            .then(res => res.json())
            .then(job => {
                dispatch({
                    type: types.jobs.LIKE,
                    job
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

/**
 * Unlike a job
 * @method unlike

 * @param  {string} jobId job id to unlike
 * @return {object}
 */
export function unlike(jobId) {
    return (dispatch, getState) => {
        const { user } = getState();
        return API.unlikejob(jobId, user.id)
            .then(res => res.json())
            .then(job => {
                dispatch({
                    type: types.jobs.UNLIKE,
                    job
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

/**
 * Create a new job
 * @method createNewjob

 * @param  {object}      job job payload
 * @return {object}
 */
export function createNewJob(job) {
    return (dispatch, getState) => {
        const { user } = getState();
        job.userId = user.id;
        return API.createJob(job)
            .then(res => res.json())
            .then(newjob => {
                dispatch({
                    type: types.jobs.CREATE,
                    job: newjob
                });
            })
            .catch(err => dispatch(createError(err)));
    };
}

export function saveJob(job) {
    if (!job.id) {
        return (createNewJob(job));
    }
    else {
        return (dispatch, getState) => {
            const { user } = getState();
            job.userId = user.id;
            return API.saveJob(job)
                .then(res => res.json())
                .then(newjob => {
                    dispatch({
                        type: types.jobs.SAVE,
                        id: newjob.id,
                        job: newjob
                    });
                })
                .catch(err => dispatch(createError(err)));
        }

    }
}
    /**
     * Get jobs for a given page ['first', 'prev', 'next']
     * @method getJobsForPage
    
     * @param  {string}        [page='first'] page type to get
     * @return {object}
     */
    export function getJobsForPage(page = 'first') {
        return (dispatch, getState) => {
            const { pagination } = getState();
            const endpoint = pagination[page];
            return API.fetchJobs(endpoint)
                .then(res => {
                    const links = parseLinkHeader(res.headers.get('Link'));
                    return res.json().then(jobs => {
                        dispatch(updatePaginationLinks(links));
                        dispatch(updateAvailableJobs(jobs));
                    });
                })
                .catch(err => dispatch(createError(err)));
        };
    }

    /**
     * Load a given job
     * @method loadjob
    
     * @param  {string} jobId job id to load
     * @return {object}
     */
    export function loadJob(jobId) {
        return dispatch => {
            return API.fetchjob(jobId)
                .then(res => res.json())
                .then(job => {
                    dispatch(updateAvailableJobs([job]));
                    dispatch(getCommentsForJob(jobId));
                })
                .catch(err => dispatch(createError(err)));
        };
    }

