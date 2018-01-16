import PropTypes from 'prop-types';
import React from 'react';

/**
 * Displays job content
 * @method Content
 * @param  {object} props
 */
const Content = props => {
    const { job } = props;
    return <p className="content">{job.content}</p>;
};

Content.propTypes = {
    job: PropTypes.object
};

export default Content;
