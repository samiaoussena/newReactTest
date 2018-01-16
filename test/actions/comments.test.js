jest.mock('../../src/shared/http');

import configureStore from 'redux-mock-store';
import thunk from 'redux-thunk';

import initialState from '../../src/constants/initialState';
import * as types from '../../src/constants/types';
import {
    showComments,
    toggleComments,
    updateAvailableComments,
    createComment,
    getCommentsForjob
} from '../../src/actions/comments';
import * as API from '../../src/shared/http';

const mockStore = configureStore([thunk]);
describe('login actions', () => {
    let store;
    beforeEach(() => {
        store = mockStore(initialState);
    });
    test('showComments', () => {
        const jobId = 'id';
        const actual = showComments(jobId);
        const expected = {
            type: types.comments.SHOW,

            jobId
        };
        expect(actual).toEqual(expected);
    });
    test('toggleComments', () => {
        const jobId = 'id';
        const actual = toggleComments(jobId);
        const expected = {
            type: types.comments.TOGGLE,

            jobId
        };
        expect(actual).toEqual(expected);
    });
    test('updateAvailableComments', () => {
        const comments = ['comments'];
        const actual = updateAvailableComments(comments);
        const expected = {
            type: types.comments.GET,

            comments
        };
        expect(actual).toEqual(expected);
    });
    test('createComment', async () => {
        const mockComment = { content: 'great job!' };
        API.createComment = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve([mockComment])
            });
        });
        await store.dispatch(createComment(mockComment));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.comments.CREATE,

                comment: [mockComment]
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
    test('getCommentsForjob', async () => {
        const jobId = 'id';
        const comments = [{ cotent: 'great stuff' }];
        API.fetchCommentsForjob = jest.fn(() => {
            return Promise.resolve({
                json: () => Promise.resolve(comments)
            });
        });
        await store.dispatch(getCommentsForjob(jobId));
        const actions = store.getActions();
        const expectedActions = [
            {
                type: types.comments.GET,

                comments
            }
        ];
        expect(actions).toEqual(expectedActions);
    });
});
