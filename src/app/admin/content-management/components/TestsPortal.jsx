/**
 * Component SCSS:
 * - Content management styles: src/assets/scss/components/_content-management.scss
 * - Grid/List view styles: src/assets/scss/components/_general.scss
 */

import { useAuthContext } from '@/context/useAuthContext'
import { useNotificationContext } from '@/context/useNotificationContext'
import authService from '@/helpers/authService'
import React, { useEffect, useState } from 'react'
import { Alert, Breadcrumb, Button, Card, Col, Dropdown, Form, Modal, Row, Spinner } from 'react-bootstrap'
import {
  FiArrowLeft,
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
  FiEdit2,
  FiFileText,
  FiFolder,
  FiMoreVertical,
  FiTrash2,
  FiUsers,
} from 'react-icons/fi'

const TestsPortal = ({
  view,
  searchQuery,
  sortBy,
  showAddFolder,
  setShowAddFolder,
  onCreateTest,
  onOpenSettings,
  onFolderSelect,
  searchResults,
  isSearching,
  onClearSearch,
}) => {
  const { user, isAuthenticated } = useAuthContext()
  const { showNotification } = useNotificationContext()

  // State for folders and tests
  const [folders, setFolders] = useState([])
  const [tests, setTests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // State for sorting and filtering
  const [currentPath, setCurrentPath] = useState([])
  const [newFolderName, setNewFolderName] = useState('')
  const [currentFolder, setCurrentFolder] = useState(null)
  const [breadcrumbs, setBreadcrumbs] = useState([])

  // Pagination state
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    total: 0,
    limit: 10,
    hasNext: false,
    hasPrev: false,
    nextPage: null,
    prevPage: null,
  })

  // Fetch folders from API
  useEffect(() => {
    // Skip folder loading if we're showing search results
    if (searchResults) {
      setLoading(false)
      return
    }

    if (!isAuthenticated || !user?.token) {
      setError('Authentication required')
      setLoading(false)
      return
    }

    const fetchFolders = async () => {
      try {
        // If no folder ID in path, fetch root folders with pagination
        if (currentPath.length === 0) {
          const response = await authService.getAllFolders(user.token, pagination.currentPage)
          console.log('API Response - All folders:', response)

          // Set folders data
          setFolders(response.folders || [])

          // Set pagination data if available
          if (response.pagination) {
            setPagination({
              currentPage: response.pagination.currentPage || 1,
              totalPages: response.pagination.totalPages || 1,
              total: response.pagination.total || 0,
              limit: response.pagination.limit || 10,
              hasNext: response.pagination.hasNext || false,
              hasPrev: response.pagination.hasPrev || false,
              nextPage: response.pagination.nextPage || null,
              prevPage: response.pagination.prevPage || null,
            })
          }

          setTests([]) // Clear tests when navigating folders
        } else {
          // If folder ID exists, fetch folder contents
          const folderId = currentPath[currentPath.length - 1]
          const response = await authService.getFolderContentsPublic(folderId, user.token)
          console.log('API Response - Folder contents:', response)

          // Set folder data
          setCurrentFolder(response.folder || null)

          // Set breadcrumbs from API response
          setBreadcrumbs(response.breadcrumbs || [])

          // Set folders and tests from API response
          setFolders(response.folders || [])
          setTests(response.tests || [])

          // Reset pagination when navigating inside a folder
          setPagination({
            currentPage: 1,
            totalPages: 1,
            total: 0,
            limit: 10,
            hasNext: false,
            hasPrev: false,
            nextPage: null,
            prevPage: null,
          })
        }
        setLoading(false)
      } catch (err) {
        console.error('Error fetching folders:', err)

        let errorMessage = 'Failed to load folders'
        if (err.response?.status === 401) {
          errorMessage = 'Your session has expired. Please sign in again.'
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        }

        setError(errorMessage)
        showNotification({
          message: errorMessage,
          variant: 'danger',
        })

        setLoading(false)
      }
    }

    fetchFolders()
  }, [isAuthenticated, user?.token, currentPath, pagination.currentPage, showNotification, searchResults])

  // Handle page change
  const handlePageChange = (pageNumber) => {
    if (pageNumber !== pagination.currentPage) {
      // Only update if the page number is different
      setPagination((prev) => ({
        ...prev,
        currentPage: pageNumber,
      }))

      // Scroll to the top of the page
      window.scrollTo(0, 0)
    }
  }

  // Add folder to current location
  const handleAddFolder = async () => {
    if (newFolderName.trim()) {
      try {
        setLoading(true)

        // Get current folder ID for parent_id
        const parentId = currentPath.length > 0 ? currentPath[currentPath.length - 1] : null

        console.log(`Creating folder "${newFolderName}" with parent_id:`, parentId)

        // API call to create new folder with the correct structure
        const folderData = {
          name: newFolderName,
          parent_id: parentId,
        }

        const response = await authService.createFolder(folderData, user.token)
        console.log('Folder creation response:', response)

        // Refresh folder list based on current location
        if (currentPath.length === 0) {
          // If we're at the root level, refresh root folders
          // Reset to page 1 after creating a new folder
          setPagination((prev) => ({
            ...prev,
            currentPage: 1,
          }))

          const foldersResponse = await authService.getAllFolders(user.token, 1)
          setFolders(foldersResponse.folders || [])

          // Update pagination data
          if (foldersResponse.pagination) {
            setPagination({
              currentPage: foldersResponse.pagination.currentPage || 1,
              totalPages: foldersResponse.pagination.totalPages || 1,
              total: foldersResponse.pagination.total || 0,
              limit: foldersResponse.pagination.limit || 10,
              hasNext: foldersResponse.pagination.hasNext || false,
              hasPrev: foldersResponse.pagination.hasPrev || false,
              nextPage: foldersResponse.pagination.nextPage || null,
              prevPage: foldersResponse.pagination.prevPage || null,
            })
          }
        } else {
          // If we're in a subfolder, refresh that folder's contents
          const folderId = currentPath[currentPath.length - 1]
          const folderResponse = await authService.getFolderContentsPublic(folderId, user.token)
          setFolders(folderResponse.folders || [])
          setTests(folderResponse.tests || [])
        }

        // Reset form and state
        setNewFolderName('')
        setShowAddFolder(false)
        setLoading(false)

        showNotification({
          message: 'Folder created successfully!',
          variant: 'success',
        })
      } catch (err) {
        console.error('Error creating folder:', err)

        let errorMessage = 'Failed to create folder'
        if (err.response?.status === 401) {
          errorMessage = 'Your session has expired. Please sign in again.'
        } else if (err.response?.data?.error) {
          errorMessage = err.response.data.error
        }

        showNotification({
          message: errorMessage,
          variant: 'danger',
        })

        setLoading(false)
      }
    }
  }

  // Navigation functions
  const navigateToFolder = (folderId) => {
    setCurrentPath([...currentPath, folderId])
    // Reset breadcrumbs since we'll fetch new ones
    setBreadcrumbs([])

    // Inform parent component about the folder selection
    if (onFolderSelect) {
      onFolderSelect(folderId)
    }
  }

  const navigateToPath = (index) => {
    // Update current path
    setCurrentPath(currentPath.slice(0, index))

    // Reset breadcrumbs when navigating to previous folder
    setBreadcrumbs([])

    // Reset pagination when navigating
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }))

    // Inform parent component about the folder selection
    if (onFolderSelect) {
      const newPath = currentPath.slice(0, index)
      const folderId = newPath.length > 0 ? newPath[newPath.length - 1] : null
      onFolderSelect(folderId)
    }
  }

  // Get breadcrumb items
  const getBreadcrumbItems = () => {
    // Start with root item
    let items = [{ id: null, name: 'Tests' }]

    // Add breadcrumb items from API if available and we're inside a folder
    if (currentPath.length > 0 && breadcrumbs && breadcrumbs.length > 0) {
      items = [...items, ...breadcrumbs]
    }
    // Fallback to path-based breadcrumbs if API doesn't provide them and we're inside a folder
    else if (currentPath.length > 0) {
      for (let i = 0; i < currentPath.length; i++) {
        const folderId = currentPath[i]
        const folder = folders.find((f) => f.id === folderId) || { id: folderId, name: `Folder ${folderId}` }
        items.push(folder)
      }
    }

    return items
  }

  // Reset content when path changes
  useEffect(() => {
    // Clear tests and reset loading state when navigating
    if (!searchResults) {
      setTests([])
      setCurrentFolder(null)
      setLoading(true)
    }
  }, [currentPath, searchResults])

  // Handle content deletion
  const handleDelete = async (id, type) => {
    try {
      setLoading(true)

      if (type === 'folder') {
        // API call to delete folder
        await authService.deleteFolder(id, user.token)
      } else {
        // API call to delete test
        await authService.deleteTest(id, user.token)
      }

      // Refresh the current view
      if (currentPath.length === 0) {
        // Reset to page 1 after deletion to ensure we're not on an invalid page
        setPagination((prev) => ({
          ...prev,
          currentPage: 1,
        }))

        const response = await authService.getAllFolders(user.token, 1)
        setFolders(response.folders || [])

        // Update pagination data
        if (response.pagination) {
          setPagination({
            currentPage: response.pagination.currentPage || 1,
            totalPages: response.pagination.totalPages || 1,
            total: response.pagination.total || 0,
            limit: response.pagination.limit || 10,
            hasNext: response.pagination.hasNext || false,
            hasPrev: response.pagination.hasPrev || false,
            nextPage: response.pagination.nextPage || null,
            prevPage: response.pagination.prevPage || null,
          })
        }
      } else {
        const folderId = currentPath[currentPath.length - 1]
        const response = await authService.getFolderContentsPublic(folderId, user.token)
        setFolders(response.folders || [])
        setTests(response.tests || [])
      }

      setLoading(false)

      showNotification({
        message: `${type === 'folder' ? 'Folder' : 'Test'} deleted successfully!`,
        variant: 'success',
      })
    } catch (err) {
      console.error(`Error deleting ${type}:`, err)

      let errorMessage = `Failed to delete ${type}`
      if (err.response?.data?.error) {
        errorMessage = err.response.data.error
      }

      showNotification({
        message: errorMessage,
        variant: 'danger',
      })

      setLoading(false)
    }
  }

  // Sort tests based on sortBy prop
  const sortItems = (items) => {
    return [...items].sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case 'name':
          comparison = a.title.localeCompare(b.title)
          break
        case 'date':
          comparison = new Date(b.lastModified || b.created_at || 0) - new Date(a.lastModified || a.created_at || 0)
          break
        case 'attempts':
          comparison = (b.attempts || 0) - (a.attempts || 0)
          break
        default:
          comparison = new Date(b.lastModified || b.created_at || 0) - new Date(a.lastModified || a.created_at || 0)
      }
      return comparison
    })
  }

  // Filter and sort tests based on search query
  const filteredAndSortedTests = tests?.length
    ? sortItems(tests.filter((test) => (test.title?.toLowerCase() || '').includes(searchQuery.toLowerCase())))
    : []

  // Render search results when available
  const renderSearchResults = () => {
    if (!searchResults) return null

    if (searchResults.error) {
      return (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Search Results for "{searchQuery}"</h5>
            <Button variant="outline-secondary" size="sm" onClick={onClearSearch} className="d-flex align-items-center">
              <FiArrowLeft className="me-2" /> Back to All Tests
            </Button>
          </div>
          <Alert variant="danger">{searchResults.error}</Alert>
        </>
      )
    }

    const searchTests = searchResults.tests || []
    const searchFolders = searchResults.folders || []

    if (searchTests.length === 0 && searchFolders.length === 0) {
      return (
        <>
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5 className="mb-0">Search Results for "{searchQuery}"</h5>
            <Button variant="outline-secondary" size="sm" onClick={onClearSearch} className="d-flex align-items-center">
              <FiArrowLeft className="me-2" /> Back to All Tests
            </Button>
          </div>
          <Alert variant="info">No results found for "{searchQuery}"</Alert>
        </>
      )
    }

    return (
      <>
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h5 className="mb-0">Search Results for "{searchQuery}"</h5>
          <Button variant="outline-secondary" size="sm" onClick={onClearSearch} className="d-flex align-items-center">
            <FiArrowLeft className="me-2" /> Back to All Tests
          </Button>
        </div>

        <Row>
          {/* Folders from search results */}
          {searchFolders.map((folder) => (
            <Col key={folder.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="content-card folder-card h-100 border border-secondary cursor-pointer" onClick={() => navigateToFolder(folder.id)}>
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="content-icon me-3">
                      <FiFolder size={24} className="text-primary" />
                    </div>
                    <div className="content-details flex-grow-1">
                      <h6 className="content-title mb-1">{folder.name}</h6>
                      <div className="content-meta text-muted small">
                        {folder.tests_count || 0} test(s)
                        {folder.subfolder_count > 0 && `, ${folder.subfolder_count} subfolder(s)`}
                      </div>
                    </div>
                    {/* <Dropdown onClick={(e) => e.stopPropagation()}>
                      <Dropdown.Toggle variant="link" className="btn-actions text-muted">
                        <FiMoreVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end shadow" style={{ zIndex: 1050 }}>
                        <Dropdown.Item>
                          <FiEdit2 className="me-2" /> Rename
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(folder.id, 'folder')}>
                          <FiTrash2 className="me-2" /> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}

          {/* Tests from search results */}
          {searchTests.map((test) => (
            <Col key={test.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
              <Card className="content-card test-card h-100 border border-secondary cursor-pointer">
                <Card.Body>
                  <div className="d-flex align-items-center">
                    <div className="content-icon me-3">
                      <FiFileText size={24} className="text-success" />
                    </div>
                    <div className="content-details flex-grow-1">
                      <h6 className="content-title mb-1">{test.title}</h6>
                      <div className="content-meta text-muted small">
                        <div>
                          <FiClock className="me-1" />
                          {test.duration_minutes} minutes
                        </div>
                        <div>
                          <FiUsers className="me-1" />
                          {test.attempts_count || 0} attempts
                        </div>
                        <div>
                          <FiCalendar className="me-1" />
                          {new Date(test.updated_at || test.created_at).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    {/* <Dropdown>
                      <Dropdown.Toggle variant="link" className="btn-actions text-muted">
                        <FiMoreVertical />
                      </Dropdown.Toggle>
                      <Dropdown.Menu className="dropdown-menu-end">
                        <Dropdown.Item>
                          <FiEdit2 className="me-2" /> Edit
                        </Dropdown.Item>
                        <Dropdown.Item className="text-danger" onClick={() => handleDelete(test.id, 'test')}>
                          <FiTrash2 className="me-2" /> Delete
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown> */}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    )
  }

  // Navigate home (to root)
  const handleNavigateHome = () => {
    setCurrentPath([])
    setBreadcrumbs([])
    setTests([])
    setCurrentFolder(null)

    // Reset pagination
    setPagination((prev) => ({
      ...prev,
      currentPage: 1,
    }))

    // Inform parent component about the folder selection
    if (onFolderSelect) {
      onFolderSelect(null)
    }
  }

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-5">
        <p className="text-danger">Error: {error}</p>
      </div>
    )
  }

  return (
    <div className="tests-portal">
      {/* Content Header */}
      <div className="content-header mb-4">
        {!searchResults && (
          <Breadcrumb className="mb-0">
            <Breadcrumb.Item active={currentPath.length === 0} onClick={handleNavigateHome} className="breadcrumb-item-custom">
              Tests
            </Breadcrumb.Item>

            {/* Only show breadcrumbs if we're inside a folder */}
            {currentPath.length > 0 &&
              getBreadcrumbItems()
                .slice(1)
                .map((item, index) => (
                  <Breadcrumb.Item
                    key={item.id}
                    active={index === getBreadcrumbItems().length - 2}
                    onClick={() => navigateToPath(index + 1)}
                    className="breadcrumb-item-custom">
                    {item.name}
                  </Breadcrumb.Item>
                ))}
          </Breadcrumb>
        )}
      </div>

      {/* Add Folder Modal */}
      <Modal show={showAddFolder} onHide={() => setShowAddFolder(false)} centered className="custom-modal">
        <Modal.Header closeButton>
          <Modal.Title>New Folder</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            onSubmit={(e) => {
              e.preventDefault()
              if (newFolderName.trim()) {
                handleAddFolder()
              }
            }}>
            <Form.Group>
              <Form.Label>Folder name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter folder name"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                autoFocus
                maxLength={50}
              />
              {newFolderName.trim().length === 0 && <Form.Text className="text-danger">Folder name cannot be empty</Form.Text>}
              <Form.Text className="text-muted">
                {newFolderName.trim().length > 0
                  ? currentPath.length > 0
                    ? `This folder will be created inside the current folder`
                    : `This will be a top-level folder`
                  : ''}
              </Form.Text>
            </Form.Group>
            <Button type="submit" className="d-none">
              Submit
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddFolder(false)} disabled={loading}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddFolder} disabled={!newFolderName.trim() || loading}>
            {loading ? (
              <>
                <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" className="me-2" />
                Creating...
              </>
            ) : (
              'Create Folder'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Content List */}
      <div className="content-list">
        {/* Show search results if available, otherwise show regular folder/test view */}
        {searchResults ? (
          renderSearchResults()
        ) : (
          <>
            {/* Folders */}
            <Row>
              {folders.map((folder) => (
                <Col key={folder.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="content-card folder-card h-100 border border-secondary cursor-pointer" onClick={() => navigateToFolder(folder.id)}>
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="content-icon me-3">
                          <FiFolder size={24} className="text-primary" />
                        </div>
                        <div className="content-details flex-grow-1">
                          <h6 className="content-title mb-1">{folder.name}</h6>
                          <div className="content-meta text-muted small">
                            {folder.tests_count || 0} test(s)
                            {folder.subfolder_count > 0 && `, ${folder.subfolder_count} subfolder(s)`}
                          </div>
                        </div>
                        {/* <Dropdown onClick={(e) => e.stopPropagation()}>
                          <Dropdown.Toggle variant="link" className="btn-actions text-muted">
                            <FiMoreVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu-end shadow" style={{ zIndex: 1050 }}>
                            <Dropdown.Item>
                              <FiEdit2 className="me-2" /> Rename
                            </Dropdown.Item>
                            <Dropdown.Item className="text-danger" onClick={() => handleDelete(folder.id, 'folder')}>
                              <FiTrash2 className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}

              {/* Tests */}
              {filteredAndSortedTests.map((test) => (
                <Col key={test.id} xs={12} md={6} lg={4} xl={3} className="mb-4">
                  <Card className="content-card test-card h-100 border border-secondary cursor-pointer">
                    <Card.Body>
                      <div className="d-flex align-items-center">
                        <div className="content-icon me-3">
                          <FiFileText size={24} className="text-success" />
                        </div>
                        <div className="content-details flex-grow-1">
                          <h6 className="content-title mb-1">{test.title}</h6>
                          <div className="content-meta text-muted small">
                            <div>
                              <FiClock className="me-1" />
                              {test.duration_minutes} minutes
                            </div>
                            <div>
                              <FiUsers className="me-1" />
                              {test.attempts_count || 0} attempts
                            </div>
                            <div>
                              <FiCalendar className="me-1" />
                              {new Date(test.updated_at || test.created_at).toLocaleDateString()}
                            </div>
                          </div>
                        </div>
                        {/* <Dropdown>
                          <Dropdown.Toggle variant="link" className="btn-actions text-muted">
                            <FiMoreVertical />
                          </Dropdown.Toggle>
                          <Dropdown.Menu className="dropdown-menu-end shadow" style={{ zIndex: 1050 }}>
                            <Dropdown.Item>
                              <FiEdit2 className="me-2" /> Edit
                            </Dropdown.Item>
                            <Dropdown.Item className="text-danger" onClick={() => handleDelete(test.id, 'test')}>
                              <FiTrash2 className="me-2" /> Delete
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown> */}
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {folders.length === 0 && filteredAndSortedTests.length === 0 && (
              <div className="empty-state text-center py-5">
                <p className="text-muted mb-0">No content in this folder</p>
              </div>
            )}

            {/* Pagination Controls - Only show if we have pagination data and we're at the root level */}
            {currentPath.length === 0 && pagination.totalPages > 1 && (
              <div className="pagination-container mt-4 d-flex justify-content-center">
                <ul className="pagination">
                  {/* Previous button */}
                  <li className={`page-item ${!pagination.hasPrev ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(pagination.currentPage - 1)} disabled={!pagination.hasPrev}>
                      <FiChevronLeft />
                    </button>
                  </li>

                  {/* Page numbers */}
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map((page) => (
                    <li key={page} className={`page-item ${page === pagination.currentPage ? 'active' : ''}`}>
                      <button className="page-link" onClick={() => handlePageChange(page)}>
                        {page}
                      </button>
                    </li>
                  ))}

                  {/* Next button */}
                  <li className={`page-item ${!pagination.hasNext ? 'disabled' : ''}`}>
                    <button className="page-link" onClick={() => handlePageChange(pagination.currentPage + 1)} disabled={!pagination.hasNext}>
                      <FiChevronRight />
                    </button>
                  </li>
                </ul>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default TestsPortal
