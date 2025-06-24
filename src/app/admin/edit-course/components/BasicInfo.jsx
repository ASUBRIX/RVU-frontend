import React, { useState, useEffect, memo, useCallback } from 'react';
import { Form, Button, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTrash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BasicInfo = memo(({ 
  setActiveStep, 
  setProgress, 
  courseName, 
  setCourseName, 
  courseId, 
  isNewCourse,
  courseCreated,
  onCourseCreated,
  onCourseUpdated 
}) => {
  // Form state
  const [formData, setFormData] = useState({
    courseName: '',
    description: '',
    shortDescription: '',
    language: 'english',
    level: 'beginner'
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
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  // Initialize form data
  useEffect(() => {
    if (courseName && !formData.courseName) {
      setFormData(prev => ({ ...prev, courseName }));
    }
  }, [courseName]);

  // Load existing course data if editing
  useEffect(() => {
    if (courseId && !isNewCourse) {
      loadCourseData();
    }
  }, [courseId, isNewCourse]);

  const loadCourseData = async () => {
    try {
      setLoading(true);
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock course data
      const mockCourse = {
        name: 'Sample Course',
        description: 'This is a sample course description',
        shortDescription: 'Short description',
        categories: ['programming'],
        subcategories: ['web-development'],
        language: 'english',
        level: 'beginner'
      };
      
      setFormData({
        courseName: mockCourse.name,
        description: mockCourse.description,
        shortDescription: mockCourse.shortDescription,
        language: mockCourse.language,
        level: mockCourse.level
      });
      
      setSelectedCategories(mockCourse.categories);
      setSelectedSubcategories(mockCourse.subcategories);
      
    } catch (error) {
      console.error('Failed to load course data:', error);
      setErrors({ fetch: 'Failed to load course data' });
    } finally {
      setLoading(false);
    }
  };

  // Validation
  const validateForm = useCallback(() => {
    const newErrors = {};
    
    if (!formData.courseName.trim() || formData.courseName.trim().length < 3) {
      newErrors.courseName = 'Course name must be at least 3 characters long';
    }
    
    if (!formData.description.trim() || formData.description.trim().length < 10) {
      newErrors.description = 'Description must be at least 10 characters long';
    }

    if (!formData.shortDescription.trim() || formData.shortDescription.trim().length < 5) {
      newErrors.shortDescription = 'Short description must be at least 5 characters long';
    }
    
    if (selectedCategories.length === 0) {
      newErrors.categories = 'Please select at least one category';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [formData, selectedCategories]);

  // Input handlers
  const handleInputChange = useCallback((field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setTouched(prev => ({ ...prev, [field]: true }));
    
    // Update parent course name
    if (field === 'courseName' && setCourseName) {
      // Debounce to prevent excessive re-renders
      clearTimeout(window.courseNameTimeout);
      window.courseNameTimeout = setTimeout(() => {
        setCourseName(value);
      }, 300);
    }
    
    // Clear field error
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  }, [setCourseName, errors]);

  // Category handlers
  const handleCategoryChange = useCallback((categories) => {
    setSelectedCategories(categories);
    setTouched(prev => ({ ...prev, categories: true }));
    
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  }, [errors.categories]);

  const handleSubcategoryChange = useCallback((subcategories) => {
    setSelectedSubcategories(subcategories);
  }, []);

  // Thumbnail handling
  const handleThumbnailChange = useCallback((e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file
      if (file.size > 2 * 1024 * 1024) {
        setErrors(prev => ({ ...prev, thumbnail: 'Image size must be less than 2MB' }));
        return;
      }
      
      if (!['image/jpeg', 'image/jpg', 'image/png'].includes(file.type)) {
        setErrors(prev => ({ ...prev, thumbnail: 'Only JPG, JPEG, and PNG files are allowed' }));
        return;
      }
      
      setThumbnail(file);
      setThumbnailPreview(URL.createObjectURL(file));
      setErrors(prev => ({ ...prev, thumbnail: '' }));
      setTouched(prev => ({ ...prev, thumbnail: true }));
    }
  }, []);

  const removeThumbnail = useCallback(() => {
    setThumbnail(null);
    setThumbnailPreview(null);
    const input = document.getElementById('thumbnail-input');
    if (input) input.value = '';
  }, []);

  // Save course
  const saveCourse = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const mockCourseId = Math.floor(Math.random() * 1000) + 1;
      const courseData = {
        id: mockCourseId,
        name: formData.courseName,
        description: formData.description,
        shortDescription: formData.shortDescription,
        categories: selectedCategories,
        subcategories: selectedSubcategories,
        language: formData.language,
        level: formData.level
      };
      
      // Update parent with final course name
      if (setCourseName) {
        setCourseName(formData.courseName);
      }
      
      if (isNewCourse) {
        if (onCourseCreated) {
          onCourseCreated(mockCourseId, { courseName: formData.courseName, ...courseData });
        }
      } else {
        if (onCourseUpdated) {
          onCourseUpdated({ courseName: formData.courseName, ...courseData });
        }
      }
      
      return courseData;
    } catch (error) {
      throw new Error('Failed to save course');
    }
  };

  // Form submission
  const handleNext = async () => {
    // Mark all fields as touched
    setTouched({
      courseName: true,
      description: true,
      shortDescription: true,
      categories: true,
      thumbnail: true
    });
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSaving(true);
      setErrors({});
      
      await saveCourse();
      
      if (setProgress) setProgress(45);
      if (setActiveStep) setActiveStep(2);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
      navigate('/admin/all-courses');
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h6 className="text-muted">Loading course information...</h6>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-4">
        <h4 className="mb-2">Basic Information</h4>
        <p className="text-muted mb-0">
          {isNewCourse 
            ? 'Enter the essential details for your new course'
            : 'Update the essential details for your course'
          }
        </p>
      </div>

      {/* Error Alerts */}
      {errors.fetch && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.fetch}
        </Alert>
      )}

      {errors.submit && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.submit}
        </Alert>
      )}

      {/* Success Alert */}
      {isNewCourse && courseCreated && (
        <Alert variant="success" className="mb-4">
          <FaCheckCircle className="me-2" />
          Course created successfully! You can now proceed to add pricing plans.
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
            className="form-control-lg"
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

        {/* Short Description */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">
            Short Description <span className="text-danger">*</span>
          </Form.Label>
          <Form.Control 
            type="text"
            placeholder="Brief course summary (for listings)" 
            value={formData.shortDescription}
            onChange={(e) => handleInputChange('shortDescription', e.target.value)}
            isInvalid={touched.shortDescription && !!errors.shortDescription}
            maxLength={160}
          />
          {touched.shortDescription && errors.shortDescription && (
            <div className="invalid-feedback d-block">
              {errors.shortDescription}
            </div>
          )}
          <Form.Text className="text-muted">
            {formData.shortDescription.length}/160 characters
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
            placeholder="Enter detailed course description" 
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

        {/* Language and Level */}
        <Row className="mb-4">
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Language</Form.Label>
              <Form.Select
                value={formData.language}
                onChange={(e) => handleInputChange('language', e.target.value)}
              >
                <option value="english">English</option>
                <option value="tamil">Tamil</option>
                <option value="hindi">Hindi</option>
                <option value="spanish">Spanish</option>
                <option value="french">French</option>
              </Form.Select>
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group>
              <Form.Label className="fw-medium">Difficulty Level</Form.Label>
              <Form.Select
                value={formData.level}
                onChange={(e) => handleInputChange('level', e.target.value)}
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
                <option value="expert">Expert</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Categories */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">
            Categories <span className="text-danger">*</span>
          </Form.Label>
          <Row>
            <Col md={6}>
              <Form.Select
                value={selectedCategories[0] || ''}
                onChange={(e) => {
                  const value = e.target.value;
                  if (value) {
                    handleCategoryChange([value]);
                  } else {
                    handleCategoryChange([]);
                  }
                }}
                className={touched.categories && errors.categories ? 'is-invalid' : ''}
              >
                <option value="">Select Category</option>
                <option value="programming">Programming & Development</option>
                <option value="design">Design</option>
                <option value="business">Business</option>
                <option value="marketing">Marketing</option>
                <option value="data-science">Data Science</option>
                <option value="photography">Photography</option>
                <option value="music">Music</option>
                <option value="health">Health & Fitness</option>
                <option value="language">Language</option>
                <option value="other">Other</option>
              </Form.Select>
            </Col>
            <Col md={6}>
              <Form.Select
                value={selectedSubcategories[0] || ''}
                onChange={(e) => handleSubcategoryChange(e.target.value ? [e.target.value] : [])}
                disabled={!selectedCategories[0]}
              >
                <option value="">Select Subcategory</option>
                {selectedCategories[0] === 'programming' && (
                  <>
                    <option value="web-development">Web Development</option>
                    <option value="mobile-development">Mobile Development</option>
                    <option value="game-development">Game Development</option>
                    <option value="software-engineering">Software Engineering</option>
                  </>
                )}
                {selectedCategories[0] === 'design' && (
                  <>
                    <option value="ui-ux">UI/UX Design</option>
                    <option value="graphic-design">Graphic Design</option>
                    <option value="web-design">Web Design</option>
                    <option value="3d-animation">3D & Animation</option>
                  </>
                )}
                {selectedCategories[0] === 'business' && (
                  <>
                    <option value="entrepreneurship">Entrepreneurship</option>
                    <option value="management">Management</option>
                    <option value="finance">Finance</option>
                    <option value="sales">Sales</option>
                  </>
                )}
              </Form.Select>
            </Col>
          </Row>
          {touched.categories && errors.categories && (
            <div className="invalid-feedback d-block">
              {errors.categories}
            </div>
          )}
        </Form.Group>

        {/* Course Thumbnail */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Thumbnail</Form.Label>
          <div
            className={`upload-box border rounded-3 p-4 text-center position-relative ${
              thumbnailPreview ? 'has-image' : 'border-dashed'
            } ${touched.thumbnail && errors.thumbnail ? 'border-danger' : 'border-secondary'}`}
            style={{ 
              cursor: 'pointer',
              borderStyle: thumbnailPreview ? 'solid' : 'dashed'
            }}
            onClick={() => !thumbnailPreview && document.getElementById('thumbnail-input')?.click()}
          >
            {thumbnailPreview ? (
              <div className="position-relative">
                <img 
                  src={thumbnailPreview} 
                  alt="Thumbnail Preview" 
                  className="img-fluid rounded" 
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
                      document.getElementById('thumbnail-input')?.click();
                    }}
                  >
                    Change Image
                  </Button>
                </div>
              </div>
            ) : (
              <div className="py-4">
                <FaCloudUploadAlt size={48} className="text-muted mb-3" />
                <p className="mb-0 text-muted">Click to upload course thumbnail</p>
                <small className="text-muted d-block mt-2">
                  Recommended: 1280x720px, JPG/PNG, Max 2MB
                </small>
              </div>
            )}
            <input 
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

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button 
            variant="outline-secondary" 
            onClick={() => setActiveStep(1)}
            disabled={saving}
          >
            Previous
          </Button>
          
          <div className="d-flex gap-3">
            <Button
              variant="outline-secondary"
              onClick={handleCancel}
              disabled={saving}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              onClick={handleNext}
              disabled={saving}
            >
              {saving ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  {isNewCourse ? 'Creating Course...' : 'Saving...'}
                </>
              ) : (
                <>
                  {isNewCourse ? 'Create Course & Continue' : 'Save & Next'}
                </>
              )}
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
}, (prevProps, nextProps) => {
  // Only re-render if these specific props change
  return (
    prevProps.courseId === nextProps.courseId &&
    prevProps.isNewCourse === nextProps.isNewCourse &&
    prevProps.courseCreated === nextProps.courseCreated &&
    prevProps.courseName === nextProps.courseName
  );
});

BasicInfo.displayName = 'BasicInfo';

export default BasicInfo;