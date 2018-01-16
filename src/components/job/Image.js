import PropTypes from 'prop-types';
import React from 'react';

/**
 * Displays images
 * @method Image
 * @param  {object} props 
 */
const Image = props => {
    if (props.job && props.job.image) {
        return <img className="img-responsive" src={props.job.image} alt="" />;
    }
    return null;
};

Image.propTypes = {
    job: PropTypes.shape({ image: PropTypes.string })
};

export default Image;
