import React, { useState, useEffect } from 'react'
import './components/BlogManagement.scss'
import { Container, Button, Form, Modal } from 'react-bootstrap'
import { FaPlus, FaEye  } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import { BsFileEarmarkRichtext, BsFileEarmarkBreak } from "react-icons/bs";
import { getBlogs, createBlog, updateBlog, deleteBlog } from '@/helpers/blogApi';

const BlogManagement = () => {
  // State for blog posts
  const [blogPosts, setBlogPosts] = useState([])

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

  // State for image preview
  const [imagePreview, setImagePreview] = useState(null)
  
  // State for selected file
  const [selectedFile, setSelectedFile] = useState(null)

  // State for editing mode
  const [editMode, setEditMode] = useState(false)

  // State for showing confirmation dialog
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [postToDelete, setPostToDelete] = useState(null)

  // State for modal
  const [showAddModal, setShowAddModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showOnlyPublished, setShowOnlyPublished] = useState(false)

  // Mock function to load posts
  // useEffect(() => {
  //   // Sample blog data
  //   const initialBlogPosts = [
  //     {
  //       id: 1,
  //       title: 'Getting Started with React',
  //       date: 'March 25, 2025',
  //       author: 'Jane Doe',
  //       excerpt:
  //         'React is a popular JavaScript library for building user interfaces. In this post, we will explore the basics of React and how to get started with your first app.',
  //       content:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  //       imageUrl: 'https://www.adverity.com/hubfs/6%20Key%20Digital%20Marketing%20Metrics%20for%202025%20blog%20hero.png',
  //       tags: ['React', 'JavaScript', 'Web Development'],
  //       isPublished: true,
  //     },
  //     {
  //       id: 2,
  //       title: 'Styling in React with SCSS',
  //       date: 'March 20, 2025',
  //       author: 'John Smith',
  //       excerpt:
  //         'SCSS is a powerful CSS preprocessor that can help you write more maintainable styles for your React applications. Learn how to integrate SCSS with React.',
  //       content:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  //       imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
  //       tags: ['SCSS', 'CSS', 'Styling', 'React'],
  //       isPublished: true,
  //     },
  //     {
  //       id: 3,
  //       title: 'State Management in React Applications',
  //       date: 'March 15, 2025',
  //       author: 'Sarah Johnson',
  //       excerpt:
  //         'Managing state in React applications can be challenging. In this post, we will look at different approaches to state management and when to use each one.',
  //       content:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  //       imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
  //       tags: ['React', 'State Management', 'Redux', 'Context API'],
  //       isPublished: true,
  //     },
  //     {
  //       id: 4,
  //       title: 'Building Accessible React Components',
  //       date: 'March 10, 2025',
  //       author: 'Alex Williams',
  //       excerpt:
  //         'Accessibility is crucial for modern web applications. Discover how to create React components that are accessible to all users, including those with disabilities.',
  //       content:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  //       imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
  //       tags: ['React', 'Accessibility', 'a11y', 'Web Development'],
  //       isPublished: true,
  //     },
  //     {
  //       id: 5,
  //       title: 'React Performance Optimization Techniques',
  //       date: 'March 5, 2025',
  //       author: 'Jamie Lee',
  //       excerpt:
  //         'Optimizing React application performance is essential for providing a smooth user experience. Learn about memoization, code splitting, and other optimization techniques.',
  //       content:
  //         'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.',
  //       imageUrl: 'https://images.pexels.com/photos/261662/pexels-photo-261662.jpeg?cs=srgb&dl=pexels-pixabay-261662.jpg&fm=jpg',
  //       tags: ['React', 'Performance', 'Optimization', 'JavaScript'],
  //       isPublished: true,
  //     },
  //   ]

  //   setBlogPosts(initialBlogPosts)
  // }, [])

  useEffect(() => {
  fetchBlogs();
}, []);

const fetchBlogs = async () => {
  try {
    const res = await getBlogs();
    setBlogPosts(res.data);
  } catch (err) {
    console.error('Failed to load blogs:', err);
  }
};

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target

    if (name === 'tags') {
      // Handle tags as a comma-separated string
      setFormData({
        ...formData,
        [name]: value,
      })
    } else {
      setFormData({
        ...formData,
        [name]: type === 'checkbox' ? checked : value,
      })
    }
  }

  // Handle image file selection
  const handleFileChange = (e) => {
    const file = e.target.files[0]
    
    if (file) {
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
  console.log("handle submit is calling");

  // Format the tags from comma-separated string to array
  const formattedTags = formData.tags.split(',').map((tag) => tag.trim());
  console.log('Formatted Tags:', formattedTags);

  // Use today's date if none provided
  const submitDate =
    formData.date ||
    new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

  // Use uploaded preview or existing image URL
  const imageUrl = imagePreview || formData.imageUrl;

  try {
    if (editMode) {
      // Update blog via API
      const updatedPost = {
        ...formData,
        date: submitDate,
        tags: formattedTags,
        imageUrl
      };
      const res = await updateBlog(formData.id, updatedPost);
      console.log("Blog updated:", res.data);

      // Update frontend list
      setBlogPosts((prev) =>
        prev.map((post) => (post.id === res.data.id ? res.data : post))
      );
    } else {
      // Create new blog via API
      const newPost = {
        ...formData,
        date: submitDate,
        tags: formattedTags,
        imageUrl
      };
      const res = await createBlog(newPost);
      console.log("New Blog Post:", res.data);

      // Add new blog to frontend list
      setBlogPosts((prev) => [...prev, res.data]);
    }

    // Reset form and close modal
    resetForm();
    setShowAddModal(false);
  } catch (err) {
    console.error("Error saving blog post:", err);
  }
};


  // Handle edit button click
  const handleEdit = (post) => {
    setEditMode(true)
    setFormData({
      ...post,
      tags: post.tags.join(', '),
    })
    setImagePreview(post.imageUrl)
    setShowAddModal(true)
  }

  // Handle delete confirmation
  const confirmDelete = (post) => {
    setPostToDelete(post)
    setShowDeleteConfirm(true)
  }

  // Handle actual deletion
  const handleDelete = () => {
    if (postToDelete) {
      const filteredPosts = blogPosts.filter((post) => post.id !== postToDelete.id)
      setBlogPosts(filteredPosts)
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
  }

  // Handle closing modal
  const handleCloseModal = () => {
    setShowAddModal(false)
    resetForm()
  }

  // Handle changing post publish status
  const togglePublishStatus = (id) => {
    const updatedPosts = blogPosts.map((post) => (post.id === id ? { ...post, isPublished: !post.isPublished } : post))
    setBlogPosts(updatedPosts)
  }

  // Filter posts based on search query and published status
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))

    return (!showOnlyPublished || post.isPublished) && matchesSearch
  })

  // Sort posts
  const sortedPosts = [...filteredPosts].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.date) - new Date(a.date)
      case 'oldest':
        return new Date(a.date) - new Date(b.date)
      case 'name':
        return a.title.localeCompare(b.title)
      case 'status':
        return (b.isPublished ? 1 : 0) - (a.isPublished ? 1 : 0)
      default:
        return 0
    }
  })

  return (
    <>
      <div>
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
              <Button variant="primary" className="d-flex align-items-center" onClick={() => setShowAddModal(true)}>
                <FaPlus className="me-2" />
                Add New Blog
              </Button>
            </div>

            {/* Search and Sort Section */}
            <div className="row g-3 align-items-center">
              <div className="col-md-8">
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
              <div className="col-md-4">
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
                    <FaEye/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Total Posts</h6>
                    <h3 className="mb-0">{blogPosts.length}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-white shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3">
                    <BsFileEarmarkRichtext/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Published Posts</h6>
                    <h3 className="mb-0">{blogPosts.filter((post) => post.isPublished).length}</h3>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-md-4 mb-3">
              <div className="card bg-white shadow-sm h-100">
                <div className="card-body d-flex align-items-center">
                  <div className="p-3">
                    <BsFileEarmarkBreak size={14}/>
                  </div>
                  <div>
                    <h6 className="text-muted mb-1">Draft Posts</h6>
                    <h3 className="mb-0">{blogPosts.filter((post) => !post.isPublished).length}</h3>
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
                  <h5 className="mb-0">Manage Existing Posts</h5>
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
                            <tr key={post.id} className={!post.isPublished ? 'table-light' : ''}>
                              <td>{post.id}</td>
                              <td>{post.title}</td>
                              <td>{post.author}</td>
                              <td>{post.date}</td>
                              <td>
                                {post.tags.map((tag) => (
                                  <span key={tag} className="badge bg-light text-dark border me-1">
                                    {tag}
                                  </span>
                                ))}
                              </td>
                              <td>
                                <span className={`badge ${post.isPublished ? 'bg-success' : 'bg-warning'}`}>
                                  {post.isPublished ? 'Published' : 'Draft'}
                                </span>
                              </td>
                              <td>
                                <div className="btn-group btn-group-sm">
                                  <button className="btn btn-outline-primary" onClick={() => handleEdit(post)}>
                                    <i className="bi bi-pencil"></i> Edit
                                  </button>
                                  <button className="btn btn-outline-danger" onClick={() => confirmDelete(post)}>
                                    <i className="bi bi-trash"></i> Delete
                                  </button>
                                  <button
                                    className={`btn ${post.isPublished ? 'btn-outline-warning' : 'btn-outline-success'}`}
                                    onClick={() => togglePublishStatus(post.id)}>
                                    <i className={`bi ${post.isPublished ? 'bi-eye-slash' : 'bi-eye'}`}></i>
                                    {post.isPublished ? ' Unpublish' : ' Publish'}
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                        ) : (
                          <tr>
                            <td colSpan="7" className="text-center py-4">
                              No posts found matching your criteria
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
              <Form.Label>Title</Form.Label>
              <Form.Control type="text" name="title" value={formData.title} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Author</Form.Label>
              <Form.Control type="text" name="author" value={formData.author} onChange={handleInputChange} required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date (Leave blank for today's date)</Form.Label>
              <Form.Control type="text" name="date" value={formData.date} onChange={handleInputChange} placeholder="March 29, 2025" />
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
                      className="mt-2"
                      onClick={() => {
                        setImagePreview(null);
                        setSelectedFile(null);
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
              <Form.Label>Excerpt</Form.Label>
              <Form.Control as="textarea" name="excerpt" value={formData.excerpt} onChange={handleInputChange} rows="2" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control as="textarea" name="content" value={formData.content} onChange={handleInputChange} rows="6" required />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Tags (comma separated)</Form.Label>
              <Form.Control
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleInputChange}
                placeholder="React, JavaScript, Web Development"
                required
              />
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
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            {editMode ? 'Update Post' : 'Add Post'}
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
          <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDelete}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  )
}

export default BlogManagement