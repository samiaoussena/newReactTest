import React from 'react';
import PropTypes from 'prop-types';

import TextArea from '../common/TextArea';


const JobForm = ({ job, onSave, onChange, handleRemoveLocation, onLocationSelect, onLocationUpdate, saving, errors }) => {


  return (
    <div className="jobForm">
      <form>
        <h1>Manage job</h1>
        <input
          type="submit"
          disabled={saving}
          value={saving ? 'Saving...' : 'Save'}
          className="btn btn-primary"
          onClick={onSave} />

        <TextArea
          name="content"
          label="Description"
          value={job.content}
          onChange={onChange}
          error={errors.content} />



      </form>
      <div className="controls">
        {this.state.location && this.state.locationSelected ? (
          <button onClick={handleRemoveLocation} className="open location-indicator">
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

            <div className="location-picker"
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
};

JobForm.propTypes = {
        job: PropTypes.object.isRequired,
  onSave: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  saving: PropTypes.bool,
  errors: PropTypes.object
};

export default JobForm;
