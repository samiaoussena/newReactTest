import PropTypes from 'prop-types';
import React from 'react';

import Content from './Content';
import Image from './Image';
import Link from './Link';
import JobActionSection from './JobActionSection';
import Comments from '../comment/Comments';
import DisplayMap from '../map/DisplayMap';
import UserHeader from '../job/UserHeader';

import RouterLink from '../router/Link';

/**
 * Displays a job
 * @method      job
 * @param       {props} props
 * @constructor
 */
function job(props) {
    const { job } = props;
    return job ? (
        <div className="job">
            <RouterLink to={`/jobs/${job.id}`}>
                <span>
                    <UserHeader date={job.date} user={job.user} />
                    <Content job={job} />
                    <Image job={job} />
                    <Link link={job.link} />
                </span>
            </RouterLink>
           
            {job.location && <DisplayMap location={job.location} />}
            <Comments jobId={job.id}  />
            <JobActionSection jobId={job.id} />
            
        </div>
    ) : null;
}

job.propTypes = {
    job: PropTypes.object.isRequired
};

export default job;
