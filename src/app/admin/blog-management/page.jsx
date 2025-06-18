import React, { useState, useEffect } from 'react'
import './components/BlogManagement.scss'
import { Container, Button, Form, Modal, Alert, Spinner } from 'react-bootstrap'
import { FaPlus, FaEye, FaEdit, FaTrash, FaEyeSlash } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { BsFileEarmarkRichtext, BsFileEarmarkBreak } from "react-icons/bs";
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/helpers/blogApi';

const BlogManagement = () => {
  // State for blog posts
  const [blogPosts, setBlogPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [submitLoading, setSubmitLoading] = useState(false)

  // State for the form
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    date: '',
    author: '',
    excerpt: '',
    content: '',
    imageUrl: '',
    tags: '',
    isPublished: true,
  })

  // Form validation errors
  const [formErrors, setFormErrors] = useState({})

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null)
  
  // State for selected file
  const [selectedFile, setSelectedFile] = useState(null)

  // State for editing mode
  const [editMode, setEditMode] = useState(false)

  // State for showing confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  // State for modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showOnlyPublished, setShowOnlyPublished] = useState(false)
  const [filterByTag, setFilterByTag] = useState('')

  // Success message
  const [successMessage, setSuccessMessage] = useState('')

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true)
      setError(null)
      const res = await getBlogs();
      
      // Handle different response structures
      let blogs = [];
      if (res.data) {
        if (Array.isArray(res.data)) {
          blogs = res.data;
        } else if (res.data.data && Array.isArray(res.data.data)) {
          blogs = res.data.data;
        } else if (res.success && Array.isArray(res.data)) {
          blogs = res.data;
        }
      } else if (Array.isArray(res)) {
        blogs = res;
      }
      
      setBlogPosts(blogs);
    } catch (err) {
      console.error('Failed to load blogs:', err);
      setError('Failed to load blogs. Please try again.')
    } finally {
      setLoading(false)
    }
  };

  // Validate form
  const validateForm = () => {
    const errors = {}
    
    if (!formData.title.trim()) errors.title = 'Title is required'
    if (!formData.author.trim()) errors.author = 'Author is required'
    if (!formData.excerpt.trim()) errors.excerpt = 'Excerpt is required'
    if (!formData.content.trim()) errors.content = 'Content is required'
    if (!formData.tags.trim()) errors.tags = 'At least one tag is required'
    
    // Validate tags format
    if (formData.tags.trim()) {
      const tags = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
      if (tags.length === 0) errors.tags = 'At least one valid tag is required'
    }

    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value,
    })

    // Clear specific field error when user starts typing
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: null
      })
    }
  }

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file')
        return
      }

      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file must be less than 5MB')
        return
      }

      setSelectedFile(file)
      
      // Create a preview URL for the selected image
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result)
      }
      reader.readAsDataURL(file)
    } else {
      setSelectedFile(null)
      setImagePreview(null)
    }
  }

  // Handle form submission for creating or updating a post
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return
    }

    setSubmitLoading(true)
    setError(null)

    try {
      // Format the tags from comma-separated string to array
      const formattedTags = formData.tags.split(',').map((tag) => tag.trim()).filter(tag => tag);

      // Use today's date if none provided
      const submitDate = formData.date || new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

      // Use uploaded preview or existing image URL
      const imageUrl = imagePreview || formData.imageUrl;

      const postData = {
        ...formData,
        date: submitDate,
        tags: formattedTags,
        imageUrl
      };

      if (editMode) {
        // Update blog via API
        const res = await updateBlog(formData.id, postData);
        
        // Handle different response structures
        let updatedBlog = null;
        if (res.data) {
          updatedBlog = res.data.data || res.data;
        } else if (res.success && res.data) {
          updatedBlog = res.data;
        }
        
        if (updatedBlog) {
          // Update frontend list
          setBlogPosts((prev) =>
            prev.map((post) => (post.id === updatedBlog.id ? updatedBlog : post))
          );
        }
        setSuccessMessage('Blog post updated successfully!')
      } else {
        // Create new blog via API
        const res = await createBlog(postData);
        
        // Handle different response structures
        let newBlog = null;
        if (res.data) {
          newBlog = res.data.data || res.data;
        } else if (res.success && res.data) {
          newBlog = res.data;
        }
        
        if (newBlog) {
          // Add new blog to frontend list
          setBlogPosts((prev) => [newBlog, ...prev]);
        }
        setSuccessMessage('Blog post created successfully!')
      }

      // Reset form and close modal
      resetForm();
      setShowAddModal(false);
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccessMessage(''), 3000)
      
    } catch (err) {
      console.error("Error saving blog post:", err);
      setError(err.response?.data?.error || 'Failed to save blog post. Please try again.')
    } finally {
      setSubmitLoading(false)
    }
  };

  // Handle edit button click
  const handleEdit = (post) => {
    setEditMode(true)
    setFormData({
      ...post,
      tags: Array.isArray(post.tags) ? post.tags.join(', ') : post.tags,
      isPublished: post.isPublished !== undefined ? post.isPublished : post.is_published,
    })
    setImagePreview(post.imageUrl || post.image_url)
    setShowAddModal(true)
    setFormErrors({})
  }

  // Handle delete confirmation
  const confirmDelete = (post) => {
    setPostToDelete(post)
    setShowDeleteConfirm(true)
  }

  // Handle actual deletion
  const handleDelete = async () => {
    if (!postToDelete) return

    setDeleteLoading(true)
    try {
      await deleteBlog(postToDelete.id)
      setBlogPosts(prev => prev.filter((post) => post.id !== postToDelete.id))
      setSuccessMessage('Blog post deleted successfully!')
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to delete blog:', err)
      setError('Failed to delete blog post. Please try again.')
    } finally {
      setDeleteLoading(false)
      setShowDeleteConfirm(false)
      setPostToDelete(null)
    }
  }

  // Reset form fields and state
  const resetForm = () => {
    setFormData({
      id: '',
      title: '',
      date: '',
      author: '',
      excerpt: '',
      content: '',
      imageUrl: '',
      tags: '',
      isPublished: true,
    })
    setEditMode(false)
    setSelectedFile(null)
    setImagePreview(null)
    setFormErrors({})
    setError(null)
  }

  // Handle closing modal
  const handleCloseModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  // Handle changing post publish status
  const togglePublishStatus = async (post) => {
    try {
      const currentStatus = post.isPublished !== undefined ? post.isPublished : post.is_published;
      const updatedPost = { 
        ...post, 
        isPublished: !currentStatus,
        is_published: !currentStatus 
      }
      await updateBlog(post.id, updatedPost)
      
      setBlogPosts(prev => 
        prev.map((p) => (p.id === post.id ? { 
          ...p, 
          isPublished: !currentStatus,
          is_published: !currentStatus 
        } : p))
      )
      setSuccessMessage(`Post ${!currentStatus ? 'published' : 'unpublished'} successfully!`)
      setTimeout(() => setSuccessMessage(''), 3000)
    } catch (err) {
      console.error('Failed to update publish status:', err)
      setError('Failed to update publish status. Please try again.')
    }
  }

  // Get all unique tags for filter dropdown
  const getAllTags = () => {
    if (!Array.isArray(blogPosts)) return [];
    
    const allTags = new Set()
    blogPosts.forEach(post => {
      if (Array.isArray(post.tags)) {
        post.tags.forEach(tag => allTags.add(tag))
      }
    })
    return Array.from(allTags).sort()
  }

  // Filter posts based on search query, published status, and tag
  const filteredPosts = Array.isArray(blogPosts) ? blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (Array.isArray(post.tags) && post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase())))

    const matchesPublishFilter = !showOnlyPublished || post.isPublished || post.is_published
    const matchesTagFilter = !filterByTag || (Array.isArray(post.tags) && post.tags.includes(filterByTag))

    return matchesSearch && matchesPublishFilter && matchesTagFilter
  }) : []

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
      case 'oldest':
        return new Date(a.created_at || a.date) - new Date(b.created_at || b.date)
      case 'name':
        return a.title.localeCompare(b.title)
      case 'status':
        return (b.isPublished ? 1 : 0) - (a.isPublished ? 1 : 0)
      default:
        return 0
    }
  })

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '400px' }}>
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  return (
    <>
      <div>
        {/* Success Message */}
        {successMessage && (
          <Alert variant="success" dismissible onClose={() => setSuccessMessage('')}>
            {successMessage}
          </Alert>
        )}

        {/* Error Message */}
        {error && (
          <Alert variant="danger" dismissible onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Header Section */}
        <div className="bg-light p-4 mb-4 rounded">
          <Container fluid>
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
              <div>
                <h3 className="page-title mb-0">Blog Management</h3>
                <nav aria-label="breadcrumb">
                  <ol className="breadcrumb mb-0 mt-2">
                    <li className="breadcrumb-item">
                      <a href="#" className="text-muted">
                        Dashboard
                      </a>
                    </li>
                    <li className="breadcrumb-item active text-dark" aria-current="page">
                      Blog
                    </li>
                  </ol>
                </nav>
              </div>
              <Button 
                variant="primary" 
                className="d-flex align-items-center" 
                onClick={() => setShowAddModal(true)}
                disabled={submitLoading}
              >
                <FaPlus className="me-2" />
                Add New Blog
              </Button>
            </div>

            {/* Search and Filter Section */}
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="search-input">
                  <div className="input-group">
                    <span className="input-group-text border-end-0 bg-white">
                      <FiSearch className="text-muted" />
                    </span>
                    <Form.Control
                      type="text"
                      placeholder="Search blogs..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="border-start-0 ps-0"
                    />
                  </div>
                </div>
              </div>
              <div className="col-md-3">
                <Form.Select 
                  value={filterByTag} 
                  onChange={(e) => setFilterByTag(e.target.value)}
                >
                  <option value="">All Tags</option>
                  {getAllTags().map((tag, index) => (
                    <option key={`tag-filter-${index}-${tag}`} value={tag}>{tag}</option>
                  ))}
                </Form.Select>
              </div>
              <div className="col-md-3">
                <div className="d-flex align-items-center justify-content-end">
                  <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                  <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select">
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
                    <option value="name">Name</option>
                    <option value="status">Status</option>
                  </Form.Select>
                </div>
              </div>
            </div>
          </Container>
        </div>

        <div className='blog-management container py-5'>
          {/* Blog Statistics */}
          <div className="row mb-4">
            <div className="col-md-4 mb-3">
              <div className="card bg-white shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3">
                    <FaEye size={24} className="text-primary"/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Posts</h6>
                    <h3 className="mb-0">{Array.isArray(blogPosts) ? blogPosts.length : 0}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-white shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3">
                    <BsFileEarmarkRichtext size={24} className="text-success"/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Published Posts</h6>
                    <h3 className="mb-0">{Array.isArray(blogPosts) ? blogPosts.filter((post) => post.isPublished || post.is_published).length : 0}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-white shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3">
                    <BsFileEarmarkBreak size={24} className="text-warning"/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Draft Posts</h6>
                    <h3 className="mb-0">{Array.isArray(blogPosts) ? blogPosts.filter((post) => !(post.isPublished || post.is_published)).length : 0}</h3>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="row">
            <div className="col-12">
              <div className="card shadow-sm">
                <div className="card-header bg-white d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">Manage Existing Posts ({filteredPosts.length})</h5>
                  <div className="form-check form-switch">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="showOnlyPublished"
                      checked={showOnlyPublished}
                      onChange={() => setShowOnlyPublished(!showOnlyPublished)}
                    />
                    <label className="form-check-label" htmlFor="showOnlyPublished">
                      Show only published
                    </label>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="table table-hover">
                      <thead className="table-light">
                        <tr>
                          <th>ID</th>
                          <th>Title</th>
                          <th>Author</th>
                          <th>Date</th>
                          <th>Tags</th>
                          <th>Status</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sortedPosts.length > 0 ? (
                          sortedPosts.map((post) => (
                            <tr key={post.id} className={!(post.isPublished || post.is_published) ? 'table-light' : ''}>
                              <td>{post.id}</td>
                              <td>
                                <div className="d-flex align-items-center">
                                  {post.imageUrl && (
                                    <img 
                                      src={post.imageUrl} 
                                      alt={post.title}
                                      className="thumbnail me-2"
                                      style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                                    />
                                  )}
                                  <div>
                                    <div className="fw-medium">{post.title}</div>
                                    <small className="text-muted">{post.excerpt?.substring(0, 60)}...</small>
                                  </div>
                                </div>
                              </td>
                              <td>{post.author}</td>
                              <td>{post.date}</td>
                              <td>
                                {Array.isArray(post.tags) ? post.tags.map((tag, index) => (
                                  <span key={`${post.id}-tag-${index}-${tag}`} className="badge bg-light text-dark border me-1 mb-1">
                                    {tag}
                                  </span>
                                )) : (
                                  <span className="text-muted">No tags</span>
                                )}
                              </td>
                              <td>
                                <span className={`badge ${(post.isPublished || post.is_published) ? 'bg-success' : 'bg-warning'}`}>
                                  {(post.isPublished || post.is_published) ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button 
                                    className="btn btn-outline-primary" 
                                    onClick={() => handleEdit(post)}
                                    title="Edit post"
                                  >
                                    <FaEdit />
                                  </button>
                                  <button 
                                    className="btn btn-outline-danger" 
                                    onClick={() => confirmDelete(post)}
                                    title="Delete post"
                                  >
                                    <FaTrash />
                                  </button>
                                  <button
                                    className={`btn ${(post.isPublished || post.is_published) ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                    onClick={() => togglePublishStatus(post)}
                                    title={(post.isPublished || post.is_published) ? 'Unpublish' : 'Publish'}
                                  >
                                    {(post.isPublished || post.is_published) ? <FaEyeSlash /> : <FaEye />}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              {searchQuery || filterByTag ? 'No posts found matching your criteria' : 'No blog posts found'}
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Blog Form Modal */}
      <Modal show={showAddModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? 'Edit Blog Post' : 'Create New Blog Post'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <input type="hidden" name="id" value={formData.id} />

            <Form.Group className="mb-3">
              <Form.Label>Title <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="title" 
                value={formData.title} 
                onChange={handleInputChange} 
                isInvalid={!!formErrors.title}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.title}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                type="text" 
                name="author" 
                value={formData.author} 
                onChange={handleInputChange}
                isInvalid={!!formErrors.author}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.author}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date (Leave blank for today's date)</Form.Label>
              <Form.Control 
                type="text" 
                name="date" 
                value={formData.date} 
                onChange={handleInputChange} 
                placeholder="March 29, 2025" 
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Blog Image</Form.Label>
              <div className="d-flex flex-column">
                <Form.Control 
                  type="file" 
                  accept="image/*" 
                  onChange={handleFileChange} 
                  className="mb-2"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img 
                      src={imagePreview} 
                      alt="Post preview" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '150px' }} 
                    />
                    <Button 
                      variant="outline-danger" 
                      size="sm" 
                      className="mt-2 d-block"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
                        setFormData({ ...formData, imageUrl: '' });
                      }}
                    >
                      Remove Image
                    </Button>
                  </div>
                )}
                {editMode && !imagePreview && formData.imageUrl && (
                  <div className="mt-2">
                    <p className="mb-1">Current image:</p>
                    <img 
                      src={formData.imageUrl} 
                      alt="Current post image" 
                      className="img-thumbnail" 
                      style={{ maxHeight: '150px' }} 
                    />
                  </div>
                )}
              </div>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Excerpt <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                name="excerpt" 
                value={formData.excerpt} 
                onChange={handleInputChange} 
                rows="2"
                isInvalid={!!formErrors.excerpt}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.excerpt}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content <span className="text-danger">*</span></Form.Label>
              <Form.Control 
                as="textarea" 
                name="content" 
                value={formData.content} 
                onChange={handleInputChange} 
                rows="6"
                isInvalid={!!formErrors.content}
                required 
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.content}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated) <span className="text-danger">*</span></Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="React, JavaScript, Web Development"
                isInvalid={!!formErrors.tags}
                required
              />
              <Form.Control.Feedback type="invalid">
                {formErrors.tags}
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                id="isPublished"
                name="isPublished"
                label="Publish immediately"
                checked={formData.isPublished}
                onChange={handleInputChange}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={submitLoading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit} 
            disabled={submitLoading}
          >
            {submitLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                {editMode ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editMode ? 'Update Post' : 'Add Post'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure you want to delete the post "{postToDelete?.title}"?</p>
          <p className="text-danger">This action cannot be undone.</p>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="secondary" 
            onClick={() => setShowDeleteConfirm(false)}
            disabled={deleteLoading}
          >
            Cancel
          </Button>
          <Button 
            variant="danger" 
            onClick={handleDelete}
            disabled={deleteLoading}
          >
            {deleteLoading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default BlogManagement