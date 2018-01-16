jest.mock('../../src/shared/http');

import React from 'react';
import renderer from 'react-test-renderer';
import { Provider } from 'react-redux';
import { shallow } from 'enzyme';

import { Singlejob, mapStateToProps, mapDispatchToProps } from '../../src/pages/job';
import configureStore from '../../src/store/configureStore';
import initialState from '../../src/constants/initialState';
describe('Single job page', () => {
    const state = Object.assign({}, initialState, {
        jobs: {
            1: { content: 'stuff', likes: [] }
        },
        jobIds: [1]
    });
    const store = configureStore(state);
    test('mapStateToProps', () => {
        const ownProps = {
            params: {
                jobId: 1
            }
        };
        expect(mapStateToProps(state, ownProps)).toEqual({
            job: state.jobs[ownProps.params.jobId]
        });
    });
    test('mapDispatchToProps', () => {
        const dispatchStub = jest.fn();
        const mappedDispatch = mapDispatchToProps(dispatchStub);
        expect(mappedDispatch.actions.loadjob).toBeDefined();
        mappedDispatch.actions.loadjob();
        expect(dispatchStub).toHaveBeenCalled();
    });

    test('should render the right components', () => {
        const mockjob = {
            id: 'id',
            content: 'content'
        };
        const component = shallow(<Singlejob job={mockjob} />);
        expect(component.find('Link').length).toEqual(1);
        expect(component.find('job').length).toEqual(1);
        expect(component.find('Ad').length).toEqual(1);
    });
    test('should render a loader when no job loaded', () => {
        const props = {
            job: null,
            actions: { loadjob: jest.fn() },
            router: { params: { jobId: 1 } }
        };
        const component = shallow(<Singlejob {...props} />);
        expect(component.find('Loader').length).toEqual(1);
    });
    test('should load a component if one is not already loaded', function() {
        const props = {
            job: null,
            actions: { loadjob: jest.fn() },
            router: { params: { jobId: 1 } }
        };
        const component = renderer.create(
            <Provider store={store}>
                <Singlejob {...props} />
            </Provider>
        );
        let tree = component.toJSON();
        expect(props.actions.loadjob).toHaveBeenCalled();
        expect(tree).toMatchSnapshot();
    });
    test('should reuse an already loaded job', function() {
        const props = {
            job: {
                id: 1,
                likes: []
            },
            actions: { loadjob: jest.fn() },
            router: { params: { jobId: 1 } }
        };
        const component = renderer.create(
            <Provider store={store}>
                <Singlejob {...props} />
            </Provider>
        );
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
        expect(props.actions.loadjob.mock.calls.length).toEqual(0);
    });
});
