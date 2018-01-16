jest.mock('parse-link-header');
jest.mock('../../src/shared/http');
jest.mock('../../src/actions/comments');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';
import parseLinkHeader from 'parse-link-header';

import initialState from '../../src/constants/initialState';
import * as types from '../../src/constants/types';
import {
    updateAvailablejobs,
    updatePaginationLinks,
    like,
    unlike,
    createNewjob,
    getjobsForPage,
    loadjob
} from '../../src/actions/jobs';
import { getCommentsForjob } from '../../src/actions/comments';
import * as API from '../../src/shared/http';

const mockStore = configureStore([thunk]);
describe('login actions', () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
    });
    test('updateAvailablejobs', () => {
        const jobs = ['job'];
        const actual = updateAvailablejobs(jobs);
        const expected = {
            type: types.jobs.GET,
            jobs
        };
        expect(actual).toEqual(expected);
    });
    test('updatePaginationLinks', () => {
        const links = ['link'];
        const actual = updatePaginationLinks(links);
        const expected = {
            type: types.jobs.UPDATE_LINKS,
            links
        };
        expect(actual).toEqual(expected);
    });
    test('like', async () => {
        const mockjob = {
            id: 'id'
        };
        API.likejob = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(mockjob)
            });
        });
        await store.dispatch(like(mockjob.id));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.jobs.LIKE,

                job: { id: 'id' }
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('unlike', async () => {
        const mockjob = {
            id: 'id'
        };
        API.unlikejob = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(mockjob)
            });
        });
        await store.dispatch(unlike(mockjob.id));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.jobs.UNLIKE,
                job: { id: 'id' }
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('createNewjob, success', async () => {
        const modifiedStoreState = Object.assign(initialState, {
            user: {
                id: '1'
            }
        });
        store = mockStore(modifiedStoreState);
        const mockjob = {
            content: 'content'
        };
        API.createjob = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(mockjob)
            });
        });
        await store.dispatch(createNewjob(mockjob));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.jobs.CREATE,
                job: { content: 'content', userId: '1' }
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('createNewjob, error', async () => {
        const modifiedStoreState = Object.assign(initialState, {
            user: {
                id: '1'
            }
        });
        store = mockStore(modifiedStoreState);
        const mockError = 'error';
        const mockjob = {
            content: 'content'
        };
        API.createjob = jest.fn(() => Promise.reject(mockError));
        await store.dispatch(createNewjob(mockjob));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.app.ERROR,
                error: mockError
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('getjobsForPage, success', async () => {
        const mockjobs = [{ content: 'job' }];
        const mockLinks = {
            first: 'url'
        };
        const mockRes = {
            headers: {
                get: jest.fn()
            },
            json: () => Promise.resolve(mockjobs)
        };
        parseLinkHeader.mockImplementation(() => mockLinks);
        API.fetchjobs = jest.fn(() => Promise.resolve(mockRes));
        await store.dispatch(getjobsForPage());
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.jobs.UPDATE_LINKS,
                links: { first: 'url' }
            },
            {
                type: types.jobs.GET,
                jobs: [{ content: 'job' }]
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('getjobsForPage, error', async () => {
        const mockError = 'error';
        API.fetchjobs = jest.fn(() => Promise.reject(mockError));
        await store.dispatch(getjobsForPage());
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.app.ERROR,
                error: mockError
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('loadjob, success', async () => {
        const mockjob = {
            id: 'id',
            content: 'content'
        };
        const mockRes = {
            json: () => Promise.resolve(mockjob)
        };
        API.fetchjob = jest.fn(() => Promise.resolve(mockRes));
        getCommentsForjob.mockImplementation(() => ({ type: types.comments.GET }));
        await store.dispatch(loadjob(mockjob.id));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.jobs.GET,
                jobs: [{ id: 'id', content: 'content' }]
            },
            { type: types.comments.GET }
        ];

        expect(actions).toEqual(expectedActions);
    });
    test('loadjob, error', async () => {
        const mockjob = {
            id: 'id',
            content: 'content'
        };
        const mockError = 'error';
        API.fetchjob = jest.fn(() => Promise.reject(mockError));
        await store.dispatch(loadjob(mockjob.id));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.app.ERROR,
                error: 'error',
                info: undefined
            }
        ];
        expect(actions).toEqual(expectedActions);
        expect(getCommentsForjob).toHaveBeenCalled();
    });
});
