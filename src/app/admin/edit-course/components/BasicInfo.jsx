// components/BasicInfo.jsx

import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTrash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Category from '../components/Category';

const BasicInfo = ({ setActiveStep, setProgress, courseName, setCourseName }) => {
  // Form state
  const [formData, setFormData] = useState({
    courseName: courseName || '',
    description: '',
    thumbnail: null,
  });

  // UI state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Validation and feedback state
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('');
  
  const navigate = useNavigate();

  // Validation rules
  const validateField = useCallback((name, value) => {
    switch (name) {
      case 'courseName':
        if (!value || value.trim().length < 3) {
          return 'Course name must be at least 3 characters long';
        }
        if (value.trim().length > 255) {
          return 'Course name must be less than 255 characters';
        }
        return '';
      
      case 'description':
        if (!value || value.trim().length < 10) {
          return 'Description must be at least 10 characters long';
        }
        if (value.trim().length > 2000) {
          return 'Description must be less than 2000 characters';
        }
        return '';
      
      case 'thumbnail':
        if (value && value.size > 2 * 1024 * 1024) { // 2MB
          return 'Image size must be less than 2MB';
        }
        if (value && !['image/jpeg', 'image/jpg', 'image/png'].includes(value.type)) {
          return 'Only JPG, JPEG, and PNG files are allowed';
        }
        return '';
      
      case 'categories':
        if (!selectedCategories.length) {
          return 'Please select at least one category';
        }
        return '';
      
      default:
        return '';
    }
  }, [selectedCategories]);

  // Real-time validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    newErrors.courseName = validateField('courseName', formData.courseName);
    newErrors.description = validateField('description', formData.description);
    newErrors.thumbnail = validateField('thumbnail', thumbnail);
    newErrors.categories = validateField('categories', selectedCategories);
    
    // Remove empty errors
    Object.keys(newErrors).forEach(key => {
      if (!newErrors[key]) delete newErrors[key];
    });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, thumbnail, selectedCategories, validateField]);

  // Handle input changes with validation
  const handleInputChange = useCallback((name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    setTouched(prev => ({ ...prev, [name]: true }));
    
    // Update course name in parent component
    if (name === 'courseName') {
      setCourseName(value);
    }
    
    // Clear error for this field
    const error = validateField(name, value);
    setErrors(prev => ({ ...prev, [name]: error }));
    
    // Auto-save after 2 seconds of no typing
    clearTimeout(window.autoSaveTimeout);
    window.autoSaveTimeout = setTimeout(() => {
      autoSaveDraft();
    }, 2000);
  }, [validateField, setCourseName]);

  // Auto-save draft functionality
  const autoSaveDraft = useCallback(async () => {
    if (!formData.courseName.trim()) return;
    
    try {
      setAutoSaveStatus('saving');
      // TODO: Replace with actual auto-save API call
      await new Promise(resolve => setTimeout(resolve, 500));
      setAutoSaveStatus('saved');
      setTimeout(() => setAutoSaveStatus(''), 2000);
    } catch (error) {
      setAutoSaveStatus('error');
      setTimeout(() => setAutoSaveStatus(''), 3000);
    }
  }, [formData]);

  // Category change handlers
  const handleCategoryChange = useCallback((categories) => {
    setSelectedCategories(categories);
    setTouched(prev => ({ ...prev, categories: true }));
    
    // Clear category error if categories are selected
    if (categories.length > 0) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  }, []);

  const handleSubcategoryChange = useCallback((subcategories) => {
    setSelectedSubcategories(subcategories);
  }, []);

  // Thumbnail handling with validation
  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const error = validateField('thumbnail', file);
      if (error) {
        setErrors(prev => ({ ...prev, thumbnail: error }));
        return;
      }
      
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, thumbnail: '' }));
      setTouched(prev => ({ ...prev, thumbnail: true }));
    }
  };

  const removeThumbnail = () => {
    setThumbnail(null);
    setThumbnailPreview(null);
    document.getElementById('thumbnail-input').value = '';
  };

  // Form submission
  const handleNext = async () => {
    setTouched({
      courseName: true,
      description: true,
      categories: true,
      thumbnail: true
    });
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      // TODO: Save basic info to backend
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setProgress(45);
      setActiveStep(2);
    } catch (error) {
      setErrors(prev => ({ ...prev, submit: error.message || 'Failed to save course information' }));
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/admin/all-courses');
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h4 className="mb-2">Basic Information</h4>
          <p className="text-muted mb-0">Enter the essential details for your course</p>
        </div>
        
        {/* Auto-save status */}
        {autoSaveStatus && (
          <div className="d-flex align-items-center">
            {autoSaveStatus === 'saving' && (
              <>
                <Spinner size="sm" className="me-2" />
                <small className="text-muted">Saving draft...</small>
              </>
            )}
            {autoSaveStatus === 'saved' && (
              <>
                <FaCheckCircle className="text-success me-2" />
                <small className="text-success">Draft saved</small>
              </>
            )}
            {autoSaveStatus === 'error' && (
              <>
                <FaExclamationTriangle className="text-warning me-2" />
                <small className="text-warning">Auto-save failed</small>
              </>
            )}
          </div>
        )}
      </div>

      {/* Submit Error Alert */}
      {errors.submit && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.submit}
        </Alert>
      )}

      <Form>
        {/* Course Name */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">
            Course Name <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            className="form-control-lg bg-light border-0"
            value={formData.courseName}
            onChange={(e) => handleInputChange('courseName', e.target.value)}
            isInvalid={touched.courseName && !!errors.courseName}
            maxLength={255}
          />
          {touched.courseName && errors.courseName && (
            <div className="invalid-feedback d-block">
              {errors.courseName}
            </div>
          )}
          <Form.Text className="text-muted">
            {formData.courseName.length}/255 characters
          </Form.Text>
        </Form.Group>

        {/* Course Description */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">
            Course Description <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control 
            as="textarea" 
            rows={5} 
            placeholder="Enter course description" 
            className="bg-light border-0"
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            isInvalid={touched.description && !!errors.description}
            maxLength={2000}
          />
          {touched.description && errors.description && (
            <div className="invalid-feedback d-block">
              {errors.description}
            </div>
          )}
          <Form.Text className="text-muted">
            {formData.description.length}/2000 characters
          </Form.Text>
        </Form.Group>

        {/* Course Thumbnail */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Thumbnail</Form.Label>
          <div
            className={`upload-box bg-light rounded-3 p-4 text-center position-relative ${
              thumbnailPreview ? 'has-image' : ''
            } ${touched.thumbnail && errors.thumbnail ? 'border-danger' : ''}`}
            style={{ border: '2px dashed #dee2e6', cursor: 'pointer' }}
            onClick={() => !thumbnailPreview && document.getElementById('thumbnail-input').click()}
          >
            {thumbnailPreview ? (
              <div className="position-relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail Preview" 
                  className="img-fluid rounded-3" 
                  style={{ maxHeight: '200px' }} 
                />
                <Button
                  variant="danger"
                  size="sm"
                  className="position-absolute top-0 end-0 m-2"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeThumbnail();
                  }}
                >
                  <FaTrash />
                </Button>
                <div className="mt-2">
                  <Button
                    variant="outline-primary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      document.getElementById('thumbnail-input').click();
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <FaCloudUploadAlt className="display-4 text-muted mb-2" />
                <p className="mb-0 text-muted">Drag & drop or click to upload course thumbnail</p>
                <small className="text-muted d-block mt-2">
                  Supported formats: JPG, JPEG, PNG (Max size: 2MB)
                </small>
              </div>
            )}
            <Form.Control 
              type="file" 
              id="thumbnail-input" 
              className="d-none" 
              accept="image/jpeg,image/jpg,image/png"
              onChange={handleThumbnailChange} 
            />
          </div>
          {touched.thumbnail && errors.thumbnail && (
            <div className="text-danger small mt-1">
              {errors.thumbnail}
            </div>
          )}
        </Form.Group>

        {/* Dynamic Categories - Replace the existing category section */}
        <Form.Group className="mb-4">
          <Category
            selectedCategories={selectedCategories}
            selectedSubcategories={selectedSubcategories}
            onCategoryChange={handleCategoryChange}
            onSubcategoryChange={handleSubcategoryChange}
            required={true}
            error={touched.categories && errors.categories ? errors.categories : ''}
          />
        </Form.Group>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="light" 
            className="px-4 border-theme-secondary text-theme-secondary" 
            disabled={saving}
            onClick={() => setActiveStep(1)}
          >
            Previous
          </Button>
          
          <div className="d-flex gap-3">
            <Button
              variant="light"
              className="px-4 border-theme-secondary text-theme-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              className="px-4"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Saving...
                </>
              ) : (
                'Next'
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfo;