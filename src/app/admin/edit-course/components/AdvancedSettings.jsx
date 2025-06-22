import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const AdvancedSettings = ({ 
  setActiveStep,
  setProgress,
  courseName,
  setCourseName 
}) => {
  const [settings, setSettings] = useState({
    // Basic Course Settings
    status: 'draft', // draft, published
    visibility: 'public', // public, private
    
    // Basic Enrollment
    maxStudents: '',
    requireApproval: false,
    
    // Basic Completion
    certificateEnabled: false,
    
    // Basic Features
    allowDiscussions: true,
    allowDownloads: false
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const params = useParams() || {};
  const navigate = useNavigate();
  const courseId = params.courseId || params.id;
  const isNewCourse = !courseId || courseId === 'new' || courseId === 'create';

  const handleSettingChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveSettings = async () => {
    try {
      setSaving(true);
      setError(null);

      console.log('Advanced settings to save:', settings);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      alert('Advanced settings saved successfully!');
      
      if (setProgress) {
        setProgress(100);
      }
      
    } catch (error) {
      console.error('Failed to save advanced settings:', error);
      setError(error.message || 'Failed to save advanced settings. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const handleFinishCourse = async () => {
    await handleSaveSettings();
    
    // Redirect to courses list
    navigate('/admin/all-courses');
  };

  return (
    <div className="advanced-settings-container">
      {error && (
        <div className="alert alert-danger">
          <strong>Error: </strong>{error}
        </div>
      )}

      {/* Course Status */}
      <div className="card border mb-4">
        <div className="card-header border-bottom">
          <h4 className="mb-0">Course Status</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Status</label>
              <select
                className="form-select"
                value={settings.status}
                onChange={(e) => handleSettingChange('status', e.target.value)}
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="col-md-6">
              <label className="form-label">Visibility</label>
              <select
                className="form-select"
                value={settings.visibility}
                onChange={(e) => handleSettingChange('visibility', e.target.value)}
              >
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Settings */}
      <div className="card border mb-4">
        <div className="card-header border-bottom">
          <h4 className="mb-0">Enrollment</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Maximum Students</label>
              <input
                type="number"
                className="form-control"
                value={settings.maxStudents}
                onChange={(e) => handleSettingChange('maxStudents', e.target.value)}
                placeholder="Unlimited"
                min="1"
              />
            </div>
            <div className="col-md-6 d-flex align-items-end">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.requireApproval}
                  onChange={(e) => handleSettingChange('requireApproval', e.target.checked)}
                  id="requireApproval"
                />
                <label className="form-check-label" htmlFor="requireApproval">
                  Require approval for enrollment
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Features */}
      <div className="card border mb-4">
        <div className="card-header border-bottom">
          <h4 className="mb-0">Course Features</h4>
        </div>
        <div className="card-body">
          <div className="row g-3">
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.certificateEnabled}
                  onChange={(e) => handleSettingChange('certificateEnabled', e.target.checked)}
                  id="certificateEnabled"
                />
                <label className="form-check-label" htmlFor="certificateEnabled">
                  Enable certificates
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.allowDiscussions}
                  onChange={(e) => handleSettingChange('allowDiscussions', e.target.checked)}
                  id="allowDiscussions"
                />
                <label className="form-check-label" htmlFor="allowDiscussions">
                  Allow discussions
                </label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-check">
                <input
                  className="form-check-input"
                  type="checkbox"
                  checked={settings.allowDownloads}
                  onChange={(e) => handleSettingChange('allowDownloads', e.target.checked)}
                  id="allowDownloads"
                />
                <label className="form-check-label" htmlFor="allowDownloads">
                  Allow downloads
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="d-flex justify-content-between">
        <button 
          className="btn btn-outline-secondary"
          onClick={() => setActiveStep && setActiveStep(3)}
        >
          <i className="fas fa-arrow-left me-2"></i>
          Previous
        </button>
        
        <div className="d-flex gap-2">
          <button
            onClick={handleSaveSettings}
            disabled={saving}
            className="btn btn-outline-primary"
          >
            {saving ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Saving...
              </>
            ) : (
              <>
                <i className="fas fa-save me-2"></i>
                Save Settings
              </>
            )}
          </button>
          
          <button
            onClick={handleFinishCourse}
            disabled={saving}
            className="btn btn-success"
          >
            {saving ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Finishing...
              </>
            ) : (
              <>
                <i className="fas fa-check me-2"></i>
                Finish Course
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdvancedSettings;