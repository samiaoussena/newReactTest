import { jobs, jobIds } from '../../src/reducers/jobs';
import initialState from '../../src/constants/initialState';
import * as types from '../../src/constants/types';

describe('jobs', () => {
    test('should return the initial state', () => {
        expect(jobs(initialState.jobs, {})).toEqual(initialState.jobs);
    });
    test(`${types.jobs.GET}`, () => {
        const existingState = { 1: { id: 1, content: 'content' } };
        const mockjobs = [
            { id: 1, content: 'content' },
            { id: 2, content: 'content' },
            { id: 3, content: 'content' }
        ];
        const expectedState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content' },
            3: { id: 3, content: 'content' }
        };
        expect(
            jobs(existingState, {
                type: types.jobs.GET,
                jobs: mockjobs
            })
        ).toEqual(expectedState);
    });
    test(`${types.jobs.CREATE}`, () => {
        const existingState = { 1: { id: 1, content: 'content' } };
        const mockjob = { id: 2, content: 'content' };
        const expectedState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content' }
        };
        expect(
            jobs(existingState, {
                type: types.jobs.CREATE,
                job: mockjob
            })
        ).toEqual(expectedState);
    });
    test(`${types.comments.SHOW}`, function() {
        const existingState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content', showComments: false }
        };
        const expectedState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content', showComments: true }
        };
        expect(
            jobs(existingState, {
                type: types.comments.SHOW,
                jobId: 2
            })
        ).toEqual(expectedState);
    });
    test(`${types.comments.TOGGLE}`, function() {
        const existingState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content', showComments: false }
        };
        const expectedState = {
            1: { id: 1, content: 'content' },
            2: { id: 2, content: 'content', showComments: true }
        };
        expect(
            jobs(existingState, {
                type: types.comments.TOGGLE,
                jobId: 2
            })
        ).toEqual(expectedState);
    });
    test(`${types.jobs.LIKE}`, function() {
        const jobUpdatedWithLike = { id: 1, content: 'content', likes: [1, 2, 3] };
        const existingState = {
            1: { id: 1, content: 'content', likes: [1] },
            2: { id: 2, content: 'content' }
        };
        const expectedState = {
            1: { id: 1, content: 'content', likes: [1, 2, 3] },
            2: { id: 2, content: 'content' }
        };
        expect(
            jobs(existingState, {
                type: types.jobs.LIKE,
                job: jobUpdatedWithLike
            })
        ).toEqual(expectedState);
    });
    test(`${types.jobs.UNLIKE}`, function() {
        const jobUpdatedWithUnlike = { id: 1, content: 'content', likes: [1, 2] };
        const existingState = {
            1: { id: 1, content: 'content', likes: [1, 2, 3] },
            2: { id: 2, content: 'content' }
        };
        const expectedState = {
            1: { id: 1, content: 'content', likes: [1, 2] },
            2: { id: 2, content: 'content' }
        };
        expect(
            jobs(existingState, {
                type: types.jobs.UNLIKE,
                job: jobUpdatedWithUnlike
            })
        ).toEqual(expectedState);
    });
    test(`${types.comments.CREATE}`, function() {
        const comment = { id: 2, jobId: 1, content: 'comment' };
        const existingState = {
            1: { id: 1, content: 'content', comments: [{ id: 1, content: 'comment' }] },
            2: { id: 2, content: 'content' }
        };
        const expectedState = {
            1: {
                id: 1,
                content: 'content',
                comments: [{ id: 1, content: 'comment' }, { id: 2, content: 'comment', jobId: 1 }]
            },
            2: { id: 2, content: 'content' }
        };
        expect(
            jobs(existingState, {
                type: types.comments.CREATE,
                comment
            })
        ).toEqual(expectedState);
    });
});

describe('jobIds', () => {
    test('should return the initial state', () => {
        expect(jobIds(initialState.jobIds, {})).toEqual(initialState.jobIds);
    });
    test(`${types.jobs.GET}`, () => {
        const existingState = [1, 2, 3];
        const mockjobs = [{ id: 1 }, { id: 2 }, { id: 5 }];
        const expectedState = [1, 2, 3, 5];
        expect(
            jobIds(existingState, {
                type: types.jobs.GET,
                jobs: mockjobs
            })
        ).toEqual(expectedState);
    });
    test(`${types.jobs.CREATE}`, () => {
        const existingState = [1, 2, 3];
        const expectedState = [1, 2, 3, 4];
        expect(
            jobIds(existingState, {
                type: types.jobs.CREATE,
                job: {
                    id: 4,
                    content: 'content'
                }
            })
        ).toEqual(expectedState);
    });
    test(`${types.jobs.CREATE}, prevent duplicate`, () => {
        const existingState = [1, 2, 3, 4];
        const expectedState = [1, 2, 3, 4];
        expect(
            jobIds(existingState, {
                type: types.jobs.CREATE,
                job: {
                    id: 4,
                    content: 'content'
                }
            })
        ).toEqual(expectedState);
    });
});
