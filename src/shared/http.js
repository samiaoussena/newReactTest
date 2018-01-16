import fetch from 'isomorphic-fetch';
import Cookies from 'js-cookie';

/**
 * Generates a Fetch confiugration object so we can share headers
 * @method generateFetchConfig
 * @param  {string}            method      HTTP verb
 * @param  {object}            [body=null] payload for job/put
 * @return {object}                        config
 */
function generateFetchConfig(method, body = null) {
    const upCasedMethod = method.toUpperCase();
    const token = Cookies.get('letters-token');
    const config = {
        method: upCasedMethod,
        headers: {
            'Content-Type': 'application/json',
            'Letters-Token': token
        },
        credentials: 'same-origin'
    };
    if (['POST', 'PUT'].includes(upCasedMethod)) {
        config.body = JSON.stringify(body);
    }

    return config;
}

/**
 * Creates a job with the given payload
 * @method createjob
 * @param  {object}   payload job payload
 * @return {Response}           Fetch Response
 */
export function createJob(payload) {
    // Send the new job to the API
    return fetch(`${process.env.ENDPOINT}/jobs`, generateFetchConfig('POST', payload));
}
export function saveJob(payload) {
    return fetch(`${process.env.ENDPOINT}/jobs`, generateFetchConfig('PUT', payload));
}
/**
 * Fetch jobs from the API
 * @method fetchjobs
 * @param  {string}   endpoint URL provided by Redux; the API will yield further endpoints we can access via the Link Header (https://www.w3.org/wiki/LinkHeader)
 * @return {Response}          Fetch API Response
 */
export function fetchJobs(endpoint) {
    return fetch(endpoint);
}

/**
 * Fetch a job from the API
 * @method fetchjob
 * @param  {string}  id job ID
 * @return {Response}     Fetch Response object
 */
export function fetchjob(id) {
    return fetch(
        `${process.env.ENDPOINT}/jobs/${id}?_embed=comments&_expand=user&_embed=likes`,
        generateFetchConfig('GET')
    );
}

/**
 * Fetch a job from the API
 * @method fetchCommentsForjob
 * @param  {string}  jobId job ID
 * @return {Response}  Fetch Response object
 */
export function fetchCommentsForjob(jobId) {
    return fetch(
        `${process.env.ENDPOINT}/comments?jobId=${jobId}&_expand=user`,
        generateFetchConfig('GET')
    );
}

/**
 * Creates a job with the given payload
 * @method createComment
 * @param  {object}   payload job payload
 * @return {Response}           Fetch Response
 */
export function createComment(payload) {
    // Send the new job to the API
    return fetch(`${process.env.ENDPOINT}/comments`, generateFetchConfig('POST', payload));
}

/**
 * Like a job
 * @method likejob
 * @param  {string} jobId job's ID
 * @param  {string} userId user's ID
 * @return {Response}        Fetch Response
 */
export function likejob(jobId, userId) {
    // Create a new like for the user/job
    return fetch(
        `${process.env.ENDPOINT}/jobs/${jobId}/likes/${userId}`,
        generateFetchConfig('PUT', { jobId, userId })
    );
}

/**
 * Unlikes a job for a given user
 * @method unlikejob
 * @param  {string}   jobId
 * @param  {string}   userId
 * @return {Response}
 */
export function unlikejob(jobId, userId) {
    return fetch(
        `${process.env.ENDPOINT}/jobs/${jobId}/likes/${userId}`,
        generateFetchConfig('DELETE')
    );
}

/**
 * Fetch a user from the API
 * @method loadUser
 * @param  {string}  id job ID
 * @return {Response}     Fetch Response object
 */
export function loadUser(id) {
    return fetch(`${process.env.ENDPOINT}/users/${id}`, generateFetchConfig('GET'));
}

/**
 * Fetch a user from the API
 * @method createUser
 * @param  {object}  payload new user payload
 * @return {Response}     Fetch Response object
 */
export function createUser(payload) {
    return fetch(`${process.env.ENDPOINT}/users`, generateFetchConfig('POST', payload));
}
