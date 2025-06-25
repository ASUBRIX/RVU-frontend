import React, { useState, useEffect, memo, useCallback } from 'react';
import { Form, Button, Alert, Spinner, Row, Col, Modal, Badge } from 'react-bootstrap';
import { FaCloudUploadAlt, FaTrash, FaExclamationTriangle, FaCheckCircle, FaPlus, FaEdit, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { 
  createCourse, 
  updateCourse, 
  getCourseById, 
  getCourseCategories, 
  uploadCourseThumbnail,
  createCategoryWithSubcategories,
  addSubcategoriesToCategory,
  deleteCategory 
} from '@/helpers/courseApi';
import { getThumbnailUrl } from '../../../../utils/thumbnailHelper';

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
    language: 'English',
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
  
  // Categories data
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  
  // Category Management Modal States
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [categoryModalType, setCategoryModalType] = useState('create'); // 'create' or 'edit'
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    title: '',
    subcategories: []
  });
  const [categoryLoading, setCategoryLoading] = useState(false);
  
  const navigate = useNavigate();

  // Load categories on component mount
  useEffect(() => {
    loadCategories();
  }, []);

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

  // Load categories from API
  const loadCategories = async () => {
    try {
      console.log('🔍 Loading categories...');
      const response = await getCourseCategories();
      console.log('🔍 Categories response:', response);
      
      if (response.success && response.data) {
        setCategories(response.data);
        console.log('🔍 Categories loaded:', response.data.length);
      }
    } catch (error) {
      console.error('❌ Error loading categories:', error);
      setErrors({ fetch: 'Failed to load categories' });
    }
  };

  // Load existing course data
  const loadCourseData = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading course data for ID:', courseId);
      
      const courseData = await getCourseById(courseId);
      console.log('🔍 Course data loaded:', courseData);
      
      setFormData({
        courseName: courseData.title || '',
        description: courseData.full_description || courseData.description || '',
        shortDescription: courseData.short_description || '',
        language: courseData.language || 'English',
        level: courseData.level || 'beginner'
      });
      
      // Set categories from tags
      if (courseData.tags && courseData.tags.length > 0) {
        setSelectedCategories([courseData.tags[0]]);
      }
      
    } catch (error) {
      console.error('❌ Failed to load course data:', error);
      setErrors({ fetch: 'Failed to load course data' });
    } finally {
      setLoading(false);
    }
  };

  // Update subcategories when category changes
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const selectedCategory = categories.find(cat => 
        cat.title === selectedCategories[0] || cat.id === selectedCategories[0]
      );
      if (selectedCategory && selectedCategory.subcategories) {
        setSubcategories(selectedCategory.subcategories);
      } else {
        setSubcategories([]);
      }
    } else {
      setSubcategories([]);
      setSelectedSubcategories([]);
    }
  }, [selectedCategories, categories]);

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
  const handleCategoryChange = useCallback((category) => {
    setSelectedCategories(category ? [category] : []);
    setSelectedSubcategories([]); // Reset subcategories when category changes
    setTouched(prev => ({ ...prev, categories: true }));
    
    if (errors.categories) {
      setErrors(prev => ({ ...prev, categories: '' }));
    }
  }, [errors.categories]);

  const handleSubcategoryChange = useCallback((subcategory) => {
    setSelectedSubcategories(subcategory ? [subcategory] : []);
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

  // Category Management Functions
  const openCategoryModal = (type = 'create', category = null) => {
    setCategoryModalType(type);
    setEditingCategory(category);
    
    if (type === 'edit' && category) {
      setCategoryFormData({
        title: category.title || '',
        subcategories: category.subcategories || []
      });
    } else {
      setCategoryFormData({
        title: '',
        subcategories: []
      });
    }
    
    setShowCategoryModal(true);
  };

  const handleCreateCategory = async () => {
    try {
      setCategoryLoading(true);
      
      if (!categoryFormData.title.trim()) {
        alert('Category title is required');
        return;
      }

      // Backend expects subcategories as array of strings, not objects
      const categoryData = {
        title: categoryFormData.title.trim(),
        subcategories: categoryFormData.subcategories
          .filter(sub => sub.title && sub.title.trim())
          .map(sub => sub.title.trim())
      };

      console.log('Creating category with data:', categoryData);
      
      const result = await createCategoryWithSubcategories(categoryData);
      console.log('Category created:', result);
      
      // Reload categories
      await loadCategories();
      
      // Close modal and reset form
      setShowCategoryModal(false);
      setCategoryFormData({ title: '', subcategories: [] });
      
      // Show success message
      setErrors({ success: 'Category created successfully!' });
      setTimeout(() => setErrors({}), 3000);
      
    } catch (error) {
      console.error('Error creating category:', error);
      setErrors({ categoryError: error.message || 'Failed to create category' });
    } finally {
      setCategoryLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    if (!window.confirm('Are you sure you want to delete this category? This action cannot be undone.')) {
      return;
    }

    try {
      setCategoryLoading(true);
      
      console.log('Deleting category:', categoryId);
      const result = await deleteCategory(categoryId);
      console.log('Category deleted:', result);
      
      // Reload categories
      await loadCategories();
      
      // Clear selection if deleted category was selected
      const deletedCategory = categories.find(cat => cat.id === categoryId);
      if (deletedCategory && selectedCategories.includes(deletedCategory.title)) {
        setSelectedCategories([]);
        setSelectedSubcategories([]);
      }
      
      // Show success message
      setErrors({ success: 'Category deleted successfully!' });
      setTimeout(() => setErrors({}), 3000);
      
    } catch (error) {
      console.error('Error deleting category:', error);
      setErrors({ deleteError: error.message || 'Failed to delete category' });
    } finally {
      setCategoryLoading(false);
    }
  };

  const addSubcategoryToForm = () => {
    setCategoryFormData(prev => ({
      ...prev,
      subcategories: [...prev.subcategories, { title: '' }]
    }));
  };

  const updateSubcategoryInForm = (index, value) => {
    setCategoryFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.map((sub, i) => 
        i === index ? { title: value } : sub
      )
    }));
  };

  const removeSubcategoryFromForm = (index) => {
    setCategoryFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter((_, i) => i !== index)
    }));
  };

  // REAL Save course function - NO MORE MOCK!
  const saveCourse = async () => {
    try {
      console.log('🔍 Starting REAL course save process...');
      console.log('🔍 Form data:', formData);
      console.log('🔍 Selected categories:', selectedCategories);
      console.log('🔍 Selected subcategories:', selectedSubcategories);
      console.log('🔍 isNewCourse:', isNewCourse);
      
      // Prepare course data matching your backend controller expectations
      const courseData = {
        title: formData.courseName,
        description: formData.description,
        short_description: formData.shortDescription,
        full_description: formData.description,
        category: selectedCategories[0] || '', // Your backend expects single category
        level: formData.level,
        language: formData.language,
        
        // Optional fields with defaults (matching your controller)
        thumbnail: '',
        promo_video_url: '',
        price: 0,
        discount: 0,
        is_discount_enabled: false,
        validity_type: 'lifetime',
        expiry_date: null,
        is_featured: false,
        total_lectures: 0,
        total_duration: '',
        message_to_reviewer: '',
        review_status: 'pending',
        visibility_status: 'draft'
      };

      console.log('🔍 Prepared course data for API:', courseData);

      let result;
      
      // Check if we're creating a new course or updating existing
      // For new courses: isNewCourse = true OR courseId is null/undefined/"new"
      const shouldCreateNewCourse = isNewCourse || !courseId || courseId === 'new' || courseId === null || courseId === undefined;
      
      if (shouldCreateNewCourse) {
        console.log('🔍 Making API call to CREATE course...');
        console.log('🔍 createCourse function type:', typeof createCourse);
        console.log('🔍 Reason for CREATE:', { isNewCourse, courseId });
        
        // Make the REAL API call to create course
        result = await createCourse(courseData);
        
        console.log('🔍 CREATE API Response:', result);
      } else {
        console.log('🔍 Making API call to UPDATE course...');
        console.log('🔍 updateCourse function type:', typeof updateCourse);
        console.log('🔍 Course ID for update:', courseId);
        
        // Ensure we have a valid courseId for update
        if (!courseId || courseId === 'new') {
          throw new Error('Invalid course ID for update operation');
        }
        
        // Make the REAL API call to update course
        result = await updateCourse(courseId, courseData);
        
        console.log('🔍 UPDATE API Response:', result);
      }

    // Extract course ID from response
    const newCourseId = result.id;
    console.log('🔍 Extracted course ID:', newCourseId);
    
    if (!newCourseId && shouldCreateNewCourse) {
      console.error('❌ No course ID in response:', result);
      throw new Error('No course ID returned from server');
    }

    // 🔥 NEW: Upload thumbnail if there's a file
    if (thumbnail && newCourseId) {
      try {
        console.log('🔍 Uploading thumbnail...');
        const thumbnailResponse = await uploadCourseThumbnail(newCourseId, thumbnail);
        console.log('🔍 Thumbnail uploaded successfully:', thumbnailResponse);
        
        // Update the result with thumbnail URL
        if (thumbnailResponse.thumbnailUrl) {
          result.thumbnail = thumbnailResponse.thumbnailUrl;
        }
      } catch (thumbnailError) {
        console.error('⚠️ Thumbnail upload failed (course still created):', thumbnailError);
        // Don't throw error - course creation succeeded, just thumbnail failed
      }
    }
      console.log('🔍 Extracted course ID:', newCourseId);
      
      if (!newCourseId && shouldCreateNewCourse) {
        console.error('❌ No course ID in response:', result);
        throw new Error('No course ID returned from server');
      }

      // Update parent with final course name
      if (setCourseName) {
        setCourseName(formData.courseName);
      }

      // Call appropriate callback with REAL course ID
      if (shouldCreateNewCourse && onCourseCreated) {
        console.log('🔍 Calling onCourseCreated with REAL ID:', newCourseId);
        onCourseCreated(newCourseId, { 
          courseName: formData.courseName, 
          ...result 
        });
      } else if (!shouldCreateNewCourse && onCourseUpdated) {
        console.log('🔍 Calling onCourseUpdated');
        onCourseUpdated({ 
          courseName: formData.courseName, 
          ...result 
        });
      }

      return result;

    } catch (error) {
      console.error('❌ REAL Save course error:', error);
      console.error('❌ Error details:', error.response?.data);
      console.error('❌ Error stack:', error.stack);
      
      // Handle API errors properly
      if (error.response?.data?.error) {
        throw new Error(error.response.data.error);
      } else if (error.message) {
        throw new Error(error.message);
      } else {
        throw new Error('Failed to save course');
      }
    }
  };

  // Form submission
  const handleNext = async () => {
    console.log('🔍 HandleNext called - starting validation...');
    
    // Mark all fields as touched
    setTouched({
      courseName: true,
      description: true,
      shortDescription: true,
      categories: true,
      thumbnail: true
    });
    
    if (!validateForm()) {
      console.log('❌ Form validation failed');
      return;
    }
    
    try {
      setSaving(true);
      setErrors({});
      
      console.log('🔍 Form valid, calling saveCourse...');
      await saveCourse();
      
      console.log('✅ Course saved successfully!');
      if (setProgress) setProgress(45);
      if (setActiveStep) setActiveStep(2);
      
    } catch (error) {
      console.error('❌ HandleNext error:', error);
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

      {errors.categoryError && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.categoryError}
        </Alert>
      )}

      {errors.subcategoryError && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.subcategoryError}
        </Alert>
      )}

      {errors.deleteError && (
        <Alert variant="danger" className="mb-4">
          <FaExclamationTriangle className="me-2" />
          {errors.deleteError}
        </Alert>
      )}

      {/* Success Alert */}
      {errors.success && (
        <Alert variant="success" className="mb-4">
          <FaCheckCircle className="me-2" />
          {errors.success}
        </Alert>
      )}

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
                <option value="English">English</option>
                <option value="Tamil">Tamil</option>
                <option value="Hindi">Hindi</option>
                <option value="Spanish">Spanish</option>
                <option value="French">French</option>
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

        {/* Categories with Management Buttons */}
        <Form.Group className="mb-4">
          <div className="d-flex align-items-center justify-content-between mb-2">
            <Form.Label className="fw-medium mb-0">
              Categories <span className="text-danger">*</span>
            </Form.Label>
            <div className="d-flex gap-2">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={() => openCategoryModal('create')}
                disabled={categoryLoading}
              >
                <FaPlus className="me-1" />
                Add Category
              </Button>
            </div>
          </div>
          
          <Row>
            <Col md={6}>
              <Form.Select
                value={selectedCategories[0] || ''}
                onChange={(e) => handleCategoryChange(e.target.value)}
                className={touched.categories && errors.categories ? 'is-invalid' : ''}
              >
                <option value="">Select Category</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.title}>
                    {category.title}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col md={6}>
              <div className="d-flex">
                <Form.Select
                  value={selectedSubcategories[0] || ''}
                  onChange={(e) => handleSubcategoryChange(e.target.value)}
                  disabled={!selectedCategories[0]}
                  className="me-2"
                >
                  <option value="">Select Subcategory</option>
                  {subcategories.map((subcategory) => (
                    <option key={subcategory.id} value={subcategory.title}>
                      {subcategory.title}
                    </option>
                  ))}
                </Form.Select>
                {selectedCategories[0] && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => {
                      const selectedCategory = categories.find(cat => 
                        cat.title === selectedCategories[0] || cat.id === selectedCategories[0]
                      );
                      if (selectedCategory) {
                        handleDeleteCategory(selectedCategory.id);
                      }
                    }}
                    disabled={categoryLoading}
                    title="Delete Category"
                  >
                    <FaTrash />
                  </Button>
                )}
              </div>
            </Col>
          </Row>
          {touched.categories && errors.categories && (
            <div className="invalid-feedback d-block">
              {errors.categories}
            </div>
          )}
          
          {/* Display current category info */}
          {selectedCategories[0] && (
            <div className="mt-2">
              <Badge bg="primary" className="me-2">
                {selectedCategories[0]}
              </Badge>
              {selectedSubcategories[0] && (
                <Badge bg="secondary">
                  {selectedSubcategories[0]}
                </Badge>
              )}
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

      {/* Category Creation Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {categoryModalType === 'create' ? 'Create New Category' : 'Edit Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Category Title *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category title"
                value={categoryFormData.title}
                onChange={(e) => setCategoryFormData(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
              />
              <Form.Text className="text-muted">
                {categoryFormData.title.length}/100 characters
              </Form.Text>
            </Form.Group>

            <div className="mb-3">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <Form.Label className="mb-0">Subcategories</Form.Label>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={addSubcategoryToForm}
                >
                  <FaPlus className="me-1" />
                  Add Subcategory
                </Button>
              </div>
              
              {categoryFormData.subcategories.map((subcategory, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Control
                    type="text"
                    placeholder="Subcategory title"
                    value={subcategory.title}
                    onChange={(e) => updateSubcategoryInForm(index, e.target.value)}
                    maxLength={100}
                    className="me-2"
                  />
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeSubcategoryFromForm(index)}
                  >
                    <FaTimes />
                  </Button>
                </div>
              ))}
              
              {categoryFormData.subcategories.length === 0 && (
                <div className="text-muted text-center py-3 border rounded">
                  No subcategories added yet. Click "Add Subcategory" to add one.
                </div>
              )}
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowCategoryModal(false)}
            disabled={categoryLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleCreateCategory}
            disabled={categoryLoading || !categoryFormData.title.trim()}
          >
            {categoryLoading ? (
              <>
                <Spinner size="sm" className="me-2" />
                {categoryModalType === 'create' ? 'Creating...' : 'Updating...'}
              </>
            ) : (
              <>
                {categoryModalType === 'create' ? 'Create Category' : 'Update Category'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
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