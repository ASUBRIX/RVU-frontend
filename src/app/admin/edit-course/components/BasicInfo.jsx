import { Form, Button, Modal, Dropdown } from 'react-bootstrap'
import { useState } from 'react'
import { courseCategories } from '@/assets/data/products'
import { FaCloudUploadAlt, FaChevronDown, FaChevronRight, FaPlus, FaTrash } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'

const BasicInfo = ({ setActiveStep, setProgress }) => {
  const [selectedCategories, setSelectedCategories] = useState([])
  const [selectedSubcategories, setSelectedSubcategories] = useState([])
  const [expandedCategories, setExpandedCategories] = useState([])
  const [thumbnail, setThumbnail] = useState(null)
  const [showNewCategoryModal, setShowNewCategoryModal] = useState(false)
  const [newCategory, setNewCategory] = useState('')
  const [newSubcategories, setNewSubcategories] = useState([''])
  const [parentCategory, setParentCategory] = useState('')
  const [isAddingSubcategory, setIsAddingSubcategory] = useState(false)
  const navigate = useNavigate()

  const handleCategoryChange = (e) => {
    const value = e.target.value
    setSelectedCategories((prev) => 
      prev.includes(value) ? prev.filter((cat) => cat !== value) : [...prev, value]
    )
  }

  const handleSubcategoryChange = (e) => {
    const value = e.target.value
    setSelectedSubcategories((prev) => 
      prev.includes(value) ? prev.filter((subcat) => subcat !== value) : [...prev, value]
    )
  }

  const toggleCategoryExpand = (categoryId) => {
    setExpandedCategories((prev) => 
      prev.includes(categoryId) ? prev.filter(id => id !== categoryId) : [...prev, categoryId]
    )
  }

  const handleThumbnailChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      setThumbnail(URL.createObjectURL(file))
    }
  }

  const handleNewCategory = () => {
    // Here you would typically make an API call to save the new category with subcategories
    // For now, we'll just close the modal and reset the form
    setShowNewCategoryModal(false)
    setNewCategory('')
    setNewSubcategories([''])
    setIsAddingSubcategory(false)
    setParentCategory('')
  }

  const toggleAddSubcategory = () => {
    setIsAddingSubcategory(!isAddingSubcategory)
  }

  const handleAddSubcategoryField = () => {
    setNewSubcategories([...newSubcategories, ''])
  }

  const handleRemoveSubcategoryField = (index) => {
    const updatedSubcategories = [...newSubcategories]
    updatedSubcategories.splice(index, 1)
    setNewSubcategories(updatedSubcategories)
  }

  const handleSubcategoryInputChange = (index, value) => {
    const updatedSubcategories = [...newSubcategories]
    updatedSubcategories[index] = value
    setNewSubcategories(updatedSubcategories)
  }

  const resetNewCategoryForm = () => {
    setNewCategory('')
    setNewSubcategories([''])
    setParentCategory('')
    setIsAddingSubcategory(false)
  }

  return (
    <div>
      <h4 className="mb-4">Basic Information</h4>

      <Form>
        {/* Course Name */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Name</Form.Label>
          <Form.Control type="text" placeholder="Enter course name" className="form-control-lg bg-light border-0" />
        </Form.Group>

        {/* Course Description */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Description</Form.Label>
          <Form.Control as="textarea" rows={5} placeholder="Enter course description" className="bg-light border-0" />
        </Form.Group>

        {/* Thumbnail */}
        <Form.Group className="mb-4">
          <Form.Label className="fw-medium">Course Thumbnail</Form.Label>
          <div className="position-relative">
            <div
              className={`upload-box bg-light rounded-3 p-4 text-center ${thumbnail ? 'has-image' : ''}`}
              style={{
                border: '2px dashed #dee2e6',
                cursor: 'pointer',
              }}
              onClick={() => document.getElementById('thumbnail-input').click()}>
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
          </div>
        </Form.Group>

        {/* Categories with Subcategories */}
        <Form.Group className="mb-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Form.Label className="fw-medium mb-0">Categories</Form.Label>
            <Button variant="outline-primary" size="sm" onClick={() => {
              resetNewCategoryForm()
              setShowNewCategoryModal(true)
            }}>
              Create New Category
            </Button>
          </div>
          <div className="border rounded-3 p-3 bg-light">
            {courseCategories.map((category) => (
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
                      checked={selectedCategories.includes(category.id)}
                      onChange={handleCategoryChange}
                    />
                    <label className="form-check-label fw-medium" htmlFor={`category-${category.id}`}>
                      {category.title}
                    </label>
                  </div>
                </div>
                
                {/* Subcategories */}
                {expandedCategories.includes(category.id) && category.subcategories && (
                  <div className="ms-4 ps-2 border-start">
                    {category.subcategories.map((subcategory) => (
                      <div className="form-check mb-2" key={subcategory.id}>
                        <input
                          type="checkbox"
                          className="form-check-input"
                          id={`subcategory-${subcategory.id}`}
                          value={subcategory.id}
                          checked={selectedSubcategories.includes(subcategory.id)}
                          onChange={handleSubcategoryChange}
                        />
                        <label className="form-check-label" htmlFor={`subcategory-${subcategory.id}`}>
                          {subcategory.title}
                        </label>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </Form.Group>

        {/* New Category Modal with Multiple Subcategory Support */}
        <Modal 
          show={showNewCategoryModal} 
          onHide={() => setShowNewCategoryModal(false)}
          size="lg"
        >
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
                    <Button 
                      variant="outline-primary" 
                      size="sm" 
                      onClick={handleAddSubcategoryField}
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
                  <Button 
                    variant="link" 
                    className="text-primary p-0" 
                    onClick={toggleAddSubcategory}
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
                    <Dropdown.Toggle variant="light" className="bg-light border-0 w-100 text-start d-flex justify-content-between align-items-center">
                      {parentCategory || 'Select parent category'}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="w-100">
                      {courseCategories.map(category => (
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
                  <Button 
                    variant="link" 
                    className="text-primary p-0" 
                    onClick={toggleAddSubcategory}
                  >
                    Create new category with subcategories
                  </Button>
                </div>
              </>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="light" onClick={() => setShowNewCategoryModal(false)}>
              Cancel
            </Button>
            <Button 
              variant="primary" 
              onClick={handleNewCategory}
              disabled={
                isAddingSubcategory 
                  ? !parentCategory || newSubcategories.some(sub => !sub.trim())
                  : !newCategory || (newSubcategories.length > 0 && newSubcategories.some(sub => !sub.trim()))
              }
            >
              {isAddingSubcategory ? 'Add Subcategories' : 'Create Category'}
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Action Buttons */}
        <div className="d-flex justify-content-between mt-4">
          <Button variant="light" className="px-4 border-theme-secondary text-theme-secondary" disabled>
            Previous
          </Button>

          <div className="d-flex gap-3">
            <Button
              variant="light"
              className="px-4 border-theme-secondary text-theme-secondary"
              onClick={() => {
                if (window.confirm('Are you sure you want to cancel? Unsaved changes will be lost.')) {
                  navigate('/admin/all-courses')
                }
              }}>
              Cancel
            </Button>

            <Button
              variant="light"
              className="px-4 bg-theme-secondary text-white"
              onClick={() => {
                setProgress(45)
                setActiveStep(2)
              }}>
              Next
            </Button>
          </div>
        </div>
      </Form>
    </div>
  )
}

export default BasicInfo