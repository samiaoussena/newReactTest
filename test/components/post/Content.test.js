import React from 'react';
import { shallow } from 'enzyme';

import Content from '../../../src/components/job/Content';

describe('<Content/>', () => {
    describe('render methods', () => {
        test('should render correctly', () => {
            const mockjob = {
                content: 'I am learning to test React components'
            };
            const wrapper = shallow(<Content job={mockjob} />);
            expect(wrapper.find('p').length).toBe(1);
            expect(wrapper.find('p.content').length).toBe(1);
            expect(wrapper.find('.content').text()).toBe(mockjob.content);
            expect(wrapper.find('p').text()).toBe(mockjob.content);
        });
    });
});
