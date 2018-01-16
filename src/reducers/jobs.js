import initialState from '../constants/initialState';
import * as types from '../constants/types';

/**
 * The jobs reducer controls the state of the actual job objects. We are storing them here in a
 * Map because that data structure is well-suited to shallow key-value lookup with preserved insertion order
 * @method jobs
 * @module letters/reducers
 * @param  {Map} [state=initialState.jobs] initial state of the reducer
 * @param  {object} action                     Redux action
 * @return {object}                            next state for slice
 */
export function jobs(state = initialState.jobs, action) {
    switch (action.type) {
        case types.jobs.GET: {
            const { jobs } = action;
            // Make a copy of the old state
            let nextState = Object.assign({}, state);
            // For each of our incoming jobs, see if we have them in our map yet or not;
            // if they are missing, add them in. JS Maps can be read out in insertion order,
            // so we should still get jobs in the order that we got them back from the API in
            for (let job of jobs) {
                if (!nextState[job.id]) {
                    nextState[job.id] = job;
                }
            }
            return nextState;
        }
        case types.jobs.CREATE: {
            const { job } = action;
            let nextState = Object.assign({}, state);
            if (!nextState[job.id]) {
                nextState[job.id] = job;
            }
            return nextState;
        }
        case types.comments.SHOW: {
            let nextState = Object.assign({}, state);
            nextState[action.jobId].showComments = true;
            return nextState;
        }
        case types.comments.TOGGLE: {
            let nextState = Object.assign({}, state);
            nextState[action.jobId].showComments = !nextState[action.jobId].showComments;
            return nextState;
        }
        // For like/unlike, we just need to update the individual job with the response we
        // get back from the server
        case types.jobs.LIKE: {
            let nextState = Object.assign({}, state);
            const oldjob = nextState[action.job.id];
            nextState[action.job.id] = Object.assign({}, oldjob, action.job);
            return nextState;
        }
        case types.jobs.UNLIKE: {
            let nextState = Object.assign({}, state);
            const oldjob = nextState[action.job.id];
            nextState[action.job.id] = Object.assign({}, oldjob, action.job);
            return nextState;
        }
        case types.comments.CREATE: {
            const { comment } = action;
            let nextState = Object.assign({}, state);
            nextState[comment.jobId].comments.push(comment);
            return state;
        }
        default:
            return state;
    }
}

/**
 * The jobIds reducer is where we keep track of the ids of jobs; this way, we can denormalize our data
 * and treat state more like a database. This way, all we need to do is look things up by ID and leave the
 * rest of the logic to the jobs reducer. This allows for better separation of concerns, although different
 * situations lead to you take a different approach
 * @method jobIds
 * @module letters/reducers
 * @param  {Set} [state=initialState.jobIds] intial or previous state
 * @param  {object} action                       Redux action
 * @return {object}                              next state for slice
 */
export function jobIds(state = initialState.jobIds, action) {
    switch (action.type) {
        case types.jobs.GET: {
            const nextjobIds = action.jobs.map(job => job.id);
            let nextState = Array.from(state);
            for (let job of nextjobIds) {
                if (!state.includes(job)) {
                    nextState.push(job);
                }
            }
            return nextState;
        }
        // When we create a new job, insert it into the collection of job IDs that we already have
        case types.jobs.CREATE: {
            const { job } = action;
            // Make a copy of previous state
            // See https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/from
            let nextState = Array.from(state);
            if (!state.includes(job.id)) {
                nextState.push(job.id);
            }
            return nextState;
        }
        default:
            return state;
    }
}
