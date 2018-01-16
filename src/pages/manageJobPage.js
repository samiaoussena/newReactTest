import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import classnames from 'classnames';

import DisplayMap from '../components/map/DisplayMap';
import LocationTypeAhead from '../components/map/LocationTypeAhead';
import Welcome from '../components/welcome/Welcome';
import { saveJob } from '../actions/jobs';
import Ad from '../components/ad/Ad';
import Job from '../components/job/job';
import Link from '../components/router/Link';
import Loader from '../components/Loader';
import toastr from 'toastr';
/**
 * Component for a create new job page
 * @module 
 * @type {Object}
 */
export class ManageJobPage extends Component {
  /*
  static propTypes = {
      params: PropTypes.shape({
          job: PropTypes.string
      })
  };
  componentDidMount() {
      // If we don't have a job yet, dispatch an action to load it
      if (!this.props.job) {
          this.props.actions.loadJob(this.props.router.params.jobId);
      }
  }
  */


  constructor(props, context) {
    super(props, context);

    const jobId = props.params.id; // from the path `/job/:id`

    let job = {
      id: '', comments: '', content: '', date: '', image: '', likes: '', url: '',
      location: {
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      },
      userId: ''
    };

    if (jobId && state.jobs.length > 0) {
      job = getjobById(state.jobs, jobId);
    }

    this.state = {
      job: Object.assign({}, job),
      errors: {},
      locationSelected: false,
      saving: false

    };
    this.updatejobState = this.updatejobState.bind(this);
    this.saveJob = this.saveJob.bind(this);
    this.handleRemoveLocation = this.handleRemoveLocation.bind(this);
    this.handleToggleLocation = this.handleToggleLocation.bind(this);
    this.onLocationSelect = this.onLocationSelect.bind(this);
    this.onLocationUpdate = this.onLocationUpdate.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.job.id != nextProps.job.id) {
      // Necessary to populate form when existing job is loaded directly.
      this.setState({ job: Object.assign({}, nextProps.job) });
    }
  }

  updatejobState(event) {
    const field = event.target.name;
    let job = Object.assign({}, this.state.job);
    job[field] = event.target.value;
    return this.setState({ job: job });
  }

  jobFormIsValid() {
    let formIsValid = true;
    let errors = {};

    if (this.state.job.content.length < 5) {
      errors.title = 'Content must be at least 5 characters.';
      formIsValid = false;
    }

    this.setState({ errors: errors });
    return formIsValid;
  }
  handleRemoveLocation() {
    this.setState(() => ({
      locationSelected: false,
      location: {
        lat: 34.1535641,
        lng: -118.1428115,
        name: null
      }
    }));
  }
  onLocationUpdate(location) {
    this.setState(() => ({ location }));
  }
  onLocationSelect(location) {
    this.setState(() => ({
      location,
      showLocationPicker: false,
      locationSelected: true
    }));
  }
  handleToggleLocation(event) {
    event.preventDefault();
    this.setState(state => ({ showLocationPicker: !state.showLocationPicker }));
  }
  saveJob(event) {
    event.preventDefault();

    if (!this.jobFormIsValid()) {
      return;
    }

    this.setState({ saving: true });
    if (this.state.locationSelected) {
      this.state.job.location = this.state.location;
    }
    this.props.actions.saveJob(this.state.job)
      .then(() => this.redirect())
      .catch(error => {
        toastr.error(error);
        this.setState({ saving: false });
      });
  }

  redirect() {
    this.setState({ saving: false });
    toastr.success('job saved');
    this.context.router.push('/');
  }
  /*
    render() {
      return (
        <JobForm
          onChange={this.updatejobState}
          onSave={this.saveJob}
          handleRemoveLocation={this.handleRemoveLocation}
          onLocationSelect = {this.onLocationSelect}
          onLocationUpdate = {this.onLocationUpdate}
          job={this.state.job}
          errors={this.state.errors}
          saving={this.state.saving}
        />
      );
    }
    */
  renderLocationControls() {
    return (
      <div className="controls">
        <button onClick={this.handleSubmit}>Save This Location</button>
        {this.state.location && this.state.locationSelected ? (
          <button onClick={this.handleRemoveLocation} className="open location-indicator">
            <i className="fa-location-arrow fa" />
            <small>{this.state.location.name}</small>
          </button>
        ) : (
            <button onClick={this.handleToggleLocation} className="open">
              {this.state.showLocationPicker ? 'Cancel' : 'Add location'}{' '}
              <i
                className={classnames(`fa`, {
                  'fa-map-o': !this.state.showLocationPicker,
                  'fa-times': this.state.showLocationPicker
                })}
              />
            </button>
          )}
      </div>
    );
  }
  render() {
    return (
      <div className="jobForm">
        <div>
        <Welcome />
        </div>
          <div>
            <form>
              <div className="field">
                <input
                  type="textarea"
                  name="content"
                  label="Description"
                  value={this.state.job.content}
                  onChange={this.updatejobState}
                  error={this.state.errors.content}
                  maxLength="280"
                />
              </div>
              <div className="field">
                <input
                  type="textarea"
                  name="content2"
                  label="Description222"
                  value={this.state.job.content}
                  onChange={this.updatejobState}
                  error={this.state.errors.content}
                  maxLength="280"
                />
              </div>
              <div className="field">
                <input
                  type="textarea"
                  name="content3"
                  label="Description33"
                  value={this.state.job.content}
                  onChange={this.updatejobState}
                  error={this.state.errors.content}
                  maxLength="280"
                />
              </div>
              <input
                type="submit"
                disabled={this.state.saving}
                value={this.state.saving ? 'Saving...' : 'Save Job'}
                className="btn btn-primary"
                onClick={this.saveJob} />

            </form>
            {this.renderLocationControls()}
            <div
              className="location-picker"
              style={{ display: this.state.showLocationPicker ? 'block' : 'none' }}
            >
              {!this.state.locationSelected && (
                <LocationTypeAhead
                  onLocationSelect={this.onLocationSelect}
                  onLocationUpdate={this.onLocationUpdate}
                />
              )}
              <DisplayMap
                displayOnly={false}
                location={this.state.location}
                onLocationSelect={this.onLocationSelect}
                onLocationUpdate={this.onLocationUpdate}
              />
            </div>
          </div>
        </div>
        
        );
}
}

ManageJobPage.propTypes = {
          job: PropTypes.object.isRequired,
  actions: PropTypes.object.isRequired
};

//Pull in the React Router context so router is available on this.context.router.
ManageJobPage.contextTypes = {
          router: PropTypes.object
};

function getjobById(jobs, id) {
  const job = jobs.filter(job => job.id == id);
  if (job) return job[0]; //since filter returns an array, have to grab the first.
  return null;
}

function mapStateToProps(state, ownProps) {
  const jobId = ownProps.params.id; // from the path `/job/:id`

  let job = {
          id: '', comments: '', content: '', date: '', image: '', likes: '', url: '',
    location: {
          lat: 34.1535641,
      lng: -118.1428115,
      name: null
    },
    userId: ''
  };

  if (jobId && state.jobs.length > 0) {
          job = getjobById(state.jobs, jobId);
        }

  return {
          job: job
  };
}

function mapDispatchToProps(dispatch) {
  return {
          actions: bindActionCreators({saveJob}, dispatch)
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(ManageJobPage);
