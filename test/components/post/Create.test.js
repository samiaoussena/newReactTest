jest.mock('mapbox');
import React from 'react';
import renderer from 'react-test-renderer';

import Createjob from '../../../src/components/job/Create';

describe('Createjob', () => {
    test('snapshot', () => {
        const props = { onSubmit: jest.fn() };
        const component = renderer.create(<Createjob {...props} />);
        const tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
    test('handlejobChange', () => {
        const props = { onSubmit: jest.fn() };
        const mockEvent = { target: { value: 'value' } };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.handlejobChange(mockEvent);
        expect(component.setState).toHaveBeenCalled();
    });
    test('handleRemoveLocation', () => {
        const props = { onSubmit: jest.fn() };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.handleRemoveLocation();
        expect(component.setState).toHaveBeenCalled();
    });
    test('handleSubmit', () => {
        const props = { onSubmit: jest.fn() };
        const mockEvent = {
            target: { value: 'value' },
            preventDefault: jest.fn()
        };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.state = {
            valid: true,
            content: 'content',
            location: 'place',
            locationSelected: true
        };
        component.handleSubmit(mockEvent);
        expect(component.setState).toHaveBeenCalled();
        expect(props.onSubmit).toHaveBeenCalledWith({
            content: 'content',
            location: 'place'
        });
    });
    test('onLocationUpdate', () => {
        const props = { onSubmit: jest.fn() };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.onLocationUpdate({});
        expect(component.setState).toHaveBeenCalled();
    });
    test('handleToggleLocation', () => {
        const props = { onSubmit: jest.fn() };
        const mockEvent = {
            preventDefault: jest.fn()
        };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.handleToggleLocation(mockEvent);
        expect(component.setState).toHaveBeenCalled();
        expect(mockEvent.preventDefault).toHaveBeenCalled();
    });
    test('onLocationSelect', () => {
        const props = { onSubmit: jest.fn() };
        Createjob.prototype.setState = jest.fn();
        const component = new Createjob(props);
        component.onLocationSelect('location');
        expect(component.setState).toHaveBeenCalled();
    });
    test('renderLocationControls', () => {
        const props = { onSubmit: jest.fn() };
        const component = renderer.create(<Createjob {...props} />);
        let tree = component.toJSON();
        expect(tree).toMatchSnapshot();
    });
});
