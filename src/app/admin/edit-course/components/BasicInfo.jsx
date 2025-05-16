import { Form, Button, Modal, Dropdown } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { getCourseCategories, createCategoryWithSubcategories } from '../../../../helpers/courseApi';
import { FaCloudUploadAlt, FaChevronDown, FaChevronRight, FaPlus, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const BasicInfo = ({ setActiveStep, setProgress, courseName, setCourseName }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedSubcategories, setSelectedSubcategories] = useState([]);
  const [expandedCategories, setExpandedCategories] = useState([]);
  const [thumbnail, setThumbnail] = useState(null);
  const [categoriesData, setCategoriesData] = useState([]);
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false);
  const [newCategory, setNewCategory] = useState('');
  const [newSubcategories, setNewSubcategories] = useState(['']);
  const [parentCategory, setParentCategory] = useState('');
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getCourseCategories();
        setCategoriesData(res.data);
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    fetchCategories();
  }, []);

  const handleCategoryChange = (e) => {
    const value = e.target.value.toString(); // cast to string
    setSelectedCategories((prev) =>
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    );
  };

  const handleSubcategoryChange = (e) => {
    const value = e.target.value.toString(); // cast to string
    setSelectedSubcategories((prev) =>
      prev.includes(value) ? prev.filter((sub) => sub !== value) : [...prev, value]
    );
  };

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) =>
      prev.includes(categoryId) ? prev.filter((id) => id !== categoryId) : [...prev, categoryId]
    );
  };

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setThumbnail(URL.createObjectURL(file));
    }
  };

  const handleNewCategory = async () => {
    try {
      await createCategoryWithSubcategories({
        title: isAddingSubcategory ? parentCategory : newCategory,
        subcategories: newSubcategories,
      });
      setShowNewCategoryModal(false);
      setNewCategory('');
      setNewSubcategories(['']);
      setParentCategory('');
      setIsAddingSubcategory(false);
      const res = await getCourseCategories();
      setCategoriesData(res.data);
    } catch (err) {
      console.error('Error creating category:', err);
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

  return (
    <div>
      <h4 className="mb-4">Basic Information</h4>
      <Form>
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter course name"
            className="form-control-lg bg-light border-0"
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
          />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Description</Form.Label>
          <Form.Control as="textarea" rows={5} placeholder="Enter course description" className="bg-light border-0" />
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Thumbnail</Form.Label>
          <div
            className={`upload-box bg-light rounded-3 p-4 text-center ${thumbnail ? 'has-image' : ''}`}
            style={{ border: '2px dashed #dee2e6', cursor: 'pointer' }}
            onClick={() => document.getElementById('thumbnail-input').click()}
          >
            {thumbnail ? (
              <img src={thumbnail} alt="Thumbnail Preview" className="img-fluid rounded-3" style={{ maxHeight: '200px' }} />
            ) : (
              <div className="py-4">
                <FaCloudUploadAlt className="display-4 text-muted mb-2" />
                <p className="mb-0 text-muted">Drag & drop or click to upload course thumbnail</p>
                <small className="text-muted d-block mt-2">Supported formats: jpg, jpeg, png (Max size: 2MB)</small>
              </div>
            )}
            <Form.Control type="file" id="thumbnail-input" className="d-none" accept="image/*" onChange={handleThumbnailChange} />
          </div>
        </Form.Group>

        <Form.Group className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-medium mb-0">Categories</Form.Label>
            <Button
              variant="outline-primary"
              size="sm"
              onClick={() => {
                setNewCategory('');
                setNewSubcategories(['']);
                setShowNewCategoryModal(true);
              }}
            >
              Create New Category
            </Button>
          </div>
          <div className="border rounded-3 p-3 bg-light">
            {categoriesData.map((category) => (
              <div key={category.id} className="mb-2">
                <div className="d-flex align-items-center mb-2">
                  <Button
                    variant="link"
                    className="p-0 text-dark me-2"
                    onClick={() => toggleCategoryExpand(category.id)}
                    style={{ textDecoration: 'none' }}
                  >
                    {expandedCategories.includes(category.id) ? <FaChevronDown size={14} /> : <FaChevronRight size={14} />}
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
            ))}
          </div>
        </Form.Group>

        <Modal show={showNewCategoryModal} onHide={() => setShowNewCategoryModal(false)} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>{isAddingSubcategory ? 'Add Subcategories to Existing Category' : 'Create New Category'}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
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
                  />
                </Form.Group>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Label className="mb-0">Subcategories</Form.Label>
                    <Button variant="outline-primary" size="sm" onClick={handleAddSubcategoryField}>
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
                      />
                      {newSubcategories.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveSubcategoryField(index)}
                          className="p-1"
                        >
                          <FaTrash size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="link" className="text-primary p-0" onClick={toggleAddSubcategory}>
                    Add subcategories to existing category
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Form.Group className="mb-4">
                  <Form.Label>Select Parent Category</Form.Label>
                  <Dropdown className="w-100">
                    <Dropdown.Toggle variant="light" className="bg-light border-0 w-100 text-start">
                      {parentCategory || 'Select parent category'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {categoriesData.map((category) => (
                        <Dropdown.Item key={category.id} onClick={() => setParentCategory(category.title)}>
                          {category.title}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                </Form.Group>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-center mb-3">
                    <Form.Label className="mb-0">Subcategories</Form.Label>
                    <Button variant="outline-primary" size="sm" onClick={handleAddSubcategoryField}>
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
                      />
                      {newSubcategories.length > 1 && (
                        <Button
                          variant="outline-danger"
                          size="sm"
                          onClick={() => handleRemoveSubcategoryField(index)}
                          className="p-1"
                        >
                          <FaTrash size={14} />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
                <div className="d-flex justify-content-end">
                  <Button variant="link" className="text-primary p-0" onClick={toggleAddSubcategory}>
                    Create new category with subcategories
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowNewCategoryModal(false)}>Cancel</Button>
            <Button
              variant="primary"
              onClick={handleNewCategory}
              disabled={
                isAddingSubcategory
                  ? !parentCategory || newSubcategories.some((sub) => !sub.trim())
                  : !newCategory || newSubcategories.some((sub) => !sub.trim())
              }
            >
              {isAddingSubcategory ? 'Add Subcategories' : 'Create Category'}
            </Button>
          </Modal.Footer>
        </Modal>

        <div className="d-flex justify-content-between mt-4">
          <Button variant="light" className="px-4 border-theme-secondary text-theme-secondary" disabled>Previous</Button>
          <div className="d-flex gap-3">
            <Button
              variant="light"
              className="px-4 border-theme-secondary text-theme-secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                  navigate('/admin/all-courses');
                }
              }}
            >
              Cancel
            </Button>
            <Button
              variant="light"
              className="px-4 bg-theme-secondary text-white"
              onClick={() => {
                setProgress(45);
                setActiveStep(2);
              }}
            >
              Next
            </Button>
          </div>
        </div>
      </Form>
    </div>
  );
};

export default BasicInfo;


