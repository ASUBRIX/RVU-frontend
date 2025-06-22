

import React, { useState, useEffect, useCallback } from 'react';
import { Form, Button, Modal, Spinner, Alert, Badge } from 'react-bootstrap';
import { FaPlus, FaTrash, FaChevronDown, FaChevronRight, FaEdit } from 'react-icons/fa';
import { 
  getCourseCategories, 
  createCategoryWithSubcategories, 
  addSubcategoriesToCategory, 
  deleteCategory 
} from '@/helpers/courseApi';

const Category = ({ 
  selectedCategories = [], 
  selectedSubcategories = [], 
  onCategoryChange, 
  onSubcategoryChange,
  required = false,
  error = ''
}) => {
  // State management
  const [categoriesData, setCategoriesData] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'addSub'
  const [selectedParentCategory, setSelectedParentCategory] = useState(null);
  
  // Form state
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategories, setNewSubcategories] = useState(['']);
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  // Load categories on mount and when needed
  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      const response = await getCourseCategories();
      setCategoriesData(response.data || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setFormErrors({ load: 'Failed to load categories' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // Category selection handlers
  const handleCategorySelect = (categoryId) => {
    const updatedSelection = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    onCategoryChange(updatedSelection);
  };

  const handleSubcategorySelect = (subcategoryId) => {
    const updatedSelection = selectedSubcategories.includes(subcategoryId)
      ? selectedSubcategories.filter(id => id !== subcategoryId)
      : [...selectedSubcategories, subcategoryId];
    
    onSubcategoryChange(updatedSelection);
  };

  // Category expansion
  const toggleCategoryExpansion = (categoryId) => {
    setExpandedCategories(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  // Modal handlers
  const openCreateModal = () => {
    setModalMode('create');
    setNewCategory('');
    setNewSubcategories(['']);
    setSelectedParentCategory(null);
    setFormErrors({});
    setShowModal(true);
  };

  const openAddSubModal = (category) => {
    setModalMode('addSub');
    setSelectedParentCategory(category);
    setNewSubcategories(['']);
    setFormErrors({});
    setShowModal(true);
  };

  // Form validation
  const validateForm = () => {
    const errors = {};
    
    if (modalMode === 'create') {
      if (!newCategory.trim() || newCategory.trim().length < 2) {
        errors.category = 'Category name must be at least 2 characters';
      }
      if (newCategory.trim().length > 100) {
        errors.category = 'Category name must be less than 100 characters';
      }
    }

    const validSubs = newSubcategories.filter(sub => sub.trim().length >= 2);
    if (validSubs.length === 0) {
      errors.subcategories = 'At least one valid subcategory is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Subcategory management
  const addSubcategoryField = () => {
    setNewSubcategories(prev => [...prev, '']);
  };

  const removeSubcategoryField = (index) => {
    if (newSubcategories.length > 1) {
      setNewSubcategories(prev => prev.filter((_, i) => i !== index));
    }
  };

  const updateSubcategoryField = (index, value) => {
    setNewSubcategories(prev => 
      prev.map((sub, i) => i === index ? value : sub)
    );
  };

  // Form submission
  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      
      if (modalMode === 'create') {
        await createCategoryWithSubcategories({
          title: newCategory.trim(),
          subcategories: newSubcategories.filter(sub => sub.trim().length >= 2)
        });
      } else {
        await addSubcategoriesToCategory(selectedParentCategory.id, {
          subcategories: newSubcategories.filter(sub => sub.trim().length >= 2)
        });
      }

      // Reload categories
      await loadCategories();
      
      // Close modal
      setShowModal(false);
      
    } catch (error) {
      setFormErrors({ 
        submit: error.response?.data?.error || 'Failed to save category' 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      {/* Category Selection Interface */}
      <div className="d-flex justify-content-between align-items-center mb-3">
        <Form.Label className="fw-medium mb-0">
          Categories {required && <span className="text-danger">*</span>}
        </Form.Label>
        <Button
          variant="outline-primary"
          size="sm"
          onClick={openCreateModal}
          disabled={loading}
        >
          <FaPlus className="me-1" size={12} />
          Create Category
        </Button>
      </div>

      <div className={`border rounded-3 p-3 bg-light ${error ? 'border-danger' : ''}`}>
        {loading ? (
          <div className="text-center py-3">
            <Spinner size="sm" className="me-2" />
            Loading categories...
          </div>
        ) : categoriesData.length === 0 ? (
          <div className="text-center py-4">
            <p className="text-muted mb-2">No categories available</p>
            <Button variant="primary" size="sm" onClick={openCreateModal}>
              Create Your First Category
            </Button>
          </div>
        ) : (
          categoriesData.map((category) => (
            <div key={category.id} className="mb-3">
              {/* Main Category */}
              <div className="d-flex align-items-center justify-content-between mb-2">
                <div className="d-flex align-items-center">
                  <Button
                    variant="link"
                    className="p-0 text-dark me-2"
                    onClick={() => toggleCategoryExpansion(category.id)}
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
                      checked={selectedCategories.includes(category.id)}
                      onChange={() => handleCategorySelect(category.id)}
                    />
                    <label 
                      className="form-check-label fw-medium" 
                      htmlFor={`category-${category.id}`}
                    >
                      {category.title}
                      <Badge bg="secondary" className="ms-2">
                        {category.subcategory_count || 0}
                      </Badge>
                    </label>
                  </div>
                </div>

                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={() => openAddSubModal(category)}
                  title="Add subcategories"
                >
                  <FaEdit size={12} />
                </Button>
              </div>

              {/* Subcategories */}
              {expandedCategories.includes(category.id) && category.subcategories && (
                <div className="ms-4 ps-3 border-start border-2">
                  {category.subcategories.length === 0 ? (
                    <div className="text-muted small py-2">
                      No subcategories. 
                      <Button 
                        variant="link" 
                        size="sm" 
                        className="p-0 ms-1"
                        onClick={() => openAddSubModal(category)}
                      >
                        Add some?
                      </Button>
                    </div>
                  ) : (
                    category.subcategories.map((subcategory) => (
                      <div className="form-check mb-2" key={subcategory.id}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`subcategory-${subcategory.id}`}
                          checked={selectedSubcategories.includes(subcategory.id)}
                          onChange={() => handleSubcategorySelect(subcategory.id)}
                        />
                        <label 
                          className="form-check-label" 
                          htmlFor={`subcategory-${subcategory.id}`}
                        >
                          {subcategory.title}
                        </label>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {error && (
        <div className="text-danger small mt-1">{error}</div>
      )}

      {/* Category Creation/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalMode === 'create' 
              ? 'Create New Category' 
              : `Add Subcategories to "${selectedParentCategory?.title}"`
            }
          </Modal.Title>
        </Modal.Header>
        
        <Modal.Body>
          {formErrors.submit && (
            <Alert variant="danger">{formErrors.submit}</Alert>
          )}

          {modalMode === 'create' && (
            <Form.Group className="mb-4">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                isInvalid={!!formErrors.category}
                disabled={submitting}
                maxLength={100}
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.category}
              </Form.Control.Feedback>
            </Form.Group>
          )}

          <div className="mb-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <Form.Label className="mb-0">Subcategories</Form.Label>
              <Button
                variant="outline-primary"
                size="sm"
                onClick={addSubcategoryField}
                disabled={submitting}
              >
                <FaPlus className="me-1" size={12} />
                Add Field
              </Button>
            </div>

            {newSubcategories.map((subcategory, index) => (
              <div key={index} className="d-flex align-items-center mb-2">
                <Form.Control
                  type="text"
                  placeholder={`Subcategory ${index + 1}`}
                  value={subcategory}
                  onChange={(e) => updateSubcategoryField(index, e.target.value)}
                  className="me-2"
                  disabled={submitting}
                  maxLength={100}
                />
                {newSubcategories.length > 1 && (
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => removeSubcategoryField(index)}
                    disabled={submitting}
                  >
                    <FaTrash size={12} />
                  </Button>
                )}
              </div>
            ))}

            {formErrors.subcategories && (
              <div className="text-danger small mt-1">
                {formErrors.subcategories}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          <Button 
            variant="light" 
            onClick={() => setShowModal(false)}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Spinner size="sm" className="me-2" />
                {modalMode === 'create' ? 'Creating...' : 'Adding...'}
              </>
            ) : (
              modalMode === 'create' ? 'Create Category' : 'Add Subcategories'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Category;