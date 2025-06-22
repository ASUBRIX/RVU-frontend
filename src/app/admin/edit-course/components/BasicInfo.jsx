import { useState, useEffect, useCallback } from 'react';
import { Form, Button, Modal, Dropdown, Alert, Spinner } from 'react-bootstrap';
import { getCourseCategories, createCategoryWithSubcategories } from '@/helpers/courseApi';
import { FaCloudUploadAlt, FaChevronDown, FaChevronRight, FaPlus, FaTrash, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BasicInfo = ({ setActiveStep, setProgress, courseName, setCourseName }) => {
  // Form state
  const [formData, setFormData] = useState({
    courseName: courseName || '',
    description: '',
    thumbnail: null,
    selectedCategories: [],
    selectedSubcategories: []
  });

  // UI state
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  
  // Categories state
  const [categoriesData, setCategoriesData] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  
  // Modal state
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategories, setNewSubcategories] = useState(['']);
  const [parentCategory, setParentCategory] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const [creatingCategory, setCreatingCategory] = useState(false);
  
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

  // Fetch categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const res = await getCourseCategories();
        setCategoriesData(res.data || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setErrors(prev => ({ ...prev, categories: 'Failed to load categories' }));
      } finally {
        setLoadingCategories(false);
      }
    };
    
    fetchCategories();
  }, []);

  // Category selection handlers
  const handleCategoryChange = (e) => {
    const value = e.target.value.toString();
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
    setTouched(prev => ({ ...prev, categories: true }));
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value.toString();
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((sub) => sub !== value) : [...prev, value]
    );
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

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

  // Category creation handlers
  const handleNewCategory = async () => {
    if (!newCategory.trim() || newSubcategories.some(sub => !sub.trim())) {
      return;
    }
    
    try {
      setCreatingCategory(true);
      await createCategoryWithSubcategories({
        title: isAddingSubcategory ? parentCategory : newCategory,
        subcategories: newSubcategories.filter(sub => sub.trim()),
      });
      
      // Refresh categories
      const res = await getCourseCategories();
      setCategoriesData(res.data || []);
      
      // Reset modal state
      setShowNewCategoryModal(false);
      setNewCategory('');
      setNewSubcategories(['']);
      setParentCategory('');
      setIsAddingSubcategory(false);
      
    } catch (err) {
      console.error('Error creating category:', err);
      setErrors(prev => ({ ...prev, categoryModal: err.message || 'Failed to create category' }));
    } finally {
      setCreatingCategory(false);
    }
  };

  const toggleAddSubcategory = () => setIsAddingSubcategory(!isAddingSubcategory);

  const handleAddSubcategoryField = () => {
    setNewSubcategories([...newSubcategories, '']);
  };

  const handleRemoveSubcategoryField = (index) => {
    const updated = [...newSubcategories];
    updated.splice(index, 1);
    setNewSubcategories(updated);
  };

  const handleSubcategoryInputChange = (index, value) => {
    const updated = [...newSubcategories];
    updated[index] = value;
    setNewSubcategories(updated);
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

        {/* Categories */}
        <Form.Group className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-medium mb-0">
              Categories <span className="text-danger">*</span>
            </Form.Label>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setNewCategory('');
                setNewSubcategories(['']);
                setShowNewCategoryModal(true);
              }}
              disabled={loadingCategories}
            >
              Create New Category
            </Button>
          </div>
          
          <div className={`border rounded-3 p-3 bg-light ${
            touched.categories && errors.categories ? 'border-danger' : ''
          }`}>
            {loadingCategories ? (
              <div className="text-center py-3">
                <Spinner size="sm" className="me-2" />
                Loading categories...
              </div>
            ) : categoriesData.length === 0 ? (
              <div className="text-center py-3 text-muted">
                No categories available. Create a new category to get started.
              </div>
            ) : (
              categoriesData.map((category) => (
                <div key={category.id} className="mb-2">
                  <div className="d-flex align-items-center mb-2">
                    <Button
                      variant="link"
                      className="p-0 text-dark me-2"
                      onClick={() => toggleCategoryExpand(category.id)}
                      style={{ textDecoration: 'none' }}
                    >
                      {expandedCategories.includes(category.id) ? 
                        <FaChevronDown size={14} /> : 
                        <FaChevronRight size={14} />
                      }
                    </Button>
                    <div className="form-check mb-0">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        id={`category-${category.id}`}
                        value={category.id}
                        checked={selectedCategories.includes(category.id.toString())}
                        onChange={handleCategoryChange}
                      />
                      <label className="form-check-label fw-medium" htmlFor={`category-${category.id}`}>
                        {category.title}
                      </label>
                    </div>
                  </div>
                  {expandedCategories.includes(category.id) && category.subcategories && (
                    <div className="ms-4 ps-2 border-start">
                      {category.subcategories.map((sub) => (
                        <div className="form-check mb-2" key={sub.id}>
                          <input
                            type="checkbox"
                            className="form-check-input"
                            id={`subcategory-${sub.id}`}
                            value={sub.id}
                            checked={selectedSubcategories.includes(sub.id.toString())}
                            onChange={handleSubcategoryChange}
                          />
                          <label className="form-check-label" htmlFor={`subcategory-${sub.id}`}>
                            {sub.title}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {touched.categories && errors.categories && (
            <div className="text-danger small mt-1">
              {errors.categories}
            </div>
          )}
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

      {/* Category Creation Modal - Keeping your existing modal code but with loading states */}
      <Modal show={showNewCategoryModal} onHide={() => setShowNewCategoryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {isAddingSubcategory ? 'Add Subcategories to Existing Category' : 'Create New Category'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors.categoryModal && (
            <Alert variant="danger" className="mb-3">
              {errors.categoryModal}
            </Alert>
          )}
          
          {/* Your existing modal content with minor enhancements */}
          {!isAddingSubcategory ? (
            <>
              <Form.Group className="mb-4">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter category name"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  className="bg-light border-0"
                  disabled={creatingCategory}
                />
              </Form.Group>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label className="mb-0">Subcategories</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={handleAddSubcategoryField}
                    disabled={creatingCategory}
                  >
                    <FaPlus className="me-1" size={12} /> Add Subcategory
                  </Button>
                </div>
                {newSubcategories.map((subcategory, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      placeholder={`Enter subcategory ${index + 1} name`}
                      value={subcategory}
                      onChange={(e) => handleSubcategoryInputChange(index, e.target.value)}
                      className="bg-light border-0 me-2"
                      disabled={creatingCategory}
                    />
                    {newSubcategories.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveSubcategoryField(index)}
                        className="p-1"
                        disabled={creatingCategory}
                      >
                        <FaTrash size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end">
                <Button 
                  variant="link" 
                  className="text-primary p-0" 
                  onClick={toggleAddSubcategory}
                  disabled={creatingCategory}
                >
                  Add subcategories to existing category
                </Button>
              </div>
            </>
          ) : (
            <>
              <Form.Group className="mb-4">
                <Form.Label>Select Parent Category</Form.Label>
                <Dropdown className="w-100">
                  <Dropdown.Toggle 
                    variant="light" 
                    className="bg-light border-0 w-100 text-start"
                    disabled={creatingCategory}
                  >
                    {parentCategory || 'Select parent category'}
                  </Dropdown.Toggle>
                  <Dropdown.Menu className="w-100">
                    {categoriesData.map((category) => (
                      <Dropdown.Item 
                        key={category.id} 
                        onClick={() => setParentCategory(category.title)}
                      >
                        {category.title}
                      </Dropdown.Item>
                    ))}
                  </Dropdown.Menu>
                </Dropdown>
              </Form.Group>
              <div className="mb-4">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <Form.Label className="mb-0">Subcategories</Form.Label>
                  <Button 
                    variant="outline-primary" 
                    size="sm" 
                    onClick={handleAddSubcategoryField}
                    disabled={creatingCategory}
                  >
                    <FaPlus className="me-1" size={12} /> Add Subcategory
                  </Button>
                </div>
                {newSubcategories.map((subcategory, index) => (
                  <div key={index} className="d-flex align-items-center mb-2">
                    <Form.Control
                      type="text"
                      placeholder={`Enter subcategory ${index + 1} name`}
                      value={subcategory}
                      onChange={(e) => handleSubcategoryInputChange(index, e.target.value)}
                      className="bg-light border-0 me-2"
                      disabled={creatingCategory}
                    />
                    {newSubcategories.length > 1 && (
                      <Button
                        variant="outline-danger"
                        size="sm"
                        onClick={() => handleRemoveSubcategoryField(index)}
                        className="p-1"
                        disabled={creatingCategory}
                      >
                        <FaTrash size={14} />
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="d-flex justify-content-end">
                <Button 
                  variant="link" 
                  className="text-primary p-0" 
                  onClick={toggleAddSubcategory}
                  disabled={creatingCategory}
                >
                  Create new category with subcategories
                </Button>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="light" 
            onClick={() => setShowNewCategoryModal(false)}
            disabled={creatingCategory}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleNewCategory}
            disabled={
              creatingCategory ||
              (isAddingSubcategory
                ? !parentCategory || newSubcategories.some((sub) => !sub.trim())
                : !newCategory || newSubcategories.some((sub) => !sub.trim()))
            }
          >
            {creatingCategory ? (
              <>
                <Spinner size="sm" className="me-2" />
                Creating...
              </>
            ) : (
              isAddingSubcategory ? 'Add Subcategories' : 'Create Category'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BasicInfo;