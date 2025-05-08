/**
 * SCSS files:
 * Main styles: src/assets/scss/components/_content-management.scss
 * Test styles: src/assets/scss/components/_question-styles.scss
 * Shared styles:
 * - General: src/assets/scss/components/_general.scss
 * - Tables: src/assets/scss/components/_tables.scss
 */

import PageMetaData from '@/components/PageMetaData'
import { useAuthContext } from '@/context/useAuthContext'
import authService from '@/helpers/authService'
import React, { useCallback, useEffect, useState } from 'react'
import { Button, Container, Form, InputGroup } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { FiFolder, FiSearch, FiX } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import CreateTest from './components/CreateTest'
import TestSettings from './components/TestSettings'
import TestsPortal from './components/TestsPortal'

const ContentManagement = () => {
  const { user } = useAuthContext()
  const [view, setView] = useState('grid')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCreateTest, setShowCreateTest] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [progress, setProgress] = useState(0)
  const [activeStep, setActiveStep] = useState(1)
  const [sortBy, setSortBy] = useState('date')
  const [showAddFolder, setShowAddFolder] = useState(false)
  const [currentFolderId, setCurrentFolderId] = useState(null)
  const [searchResults, setSearchResults] = useState(null)
  const [isSearching, setIsSearching] = useState(false)

  const navigate = useNavigate()

  // Handle folder selection from TestsPortal
  const handleFolderSelect = (folderId) => {
    setCurrentFolderId(folderId)
    // Clear search results when navigating to a folder
    setSearchResults(null)
    setSearchQuery('')
  }

  // Debounced search function
  const debouncedSearch = useCallback(
    (() => {
      let timeout = null
      return (query, sort) => {
        clearTimeout(timeout)
        timeout = setTimeout(async () => {
          if (query.trim().length > 0) {
            setIsSearching(true)
            try {
              console.log(`Searching with sort: ${sort}`)
              // Pass sortBy directly - backend expects 'date' or 'name'
              const results = await authService.searchTests(query, sort, user?.token)
              setSearchResults(results)
            } catch (error) {
              console.error('Error searching tests:', error)
              setSearchResults({ error: 'Failed to search tests' })
            } finally {
              setIsSearching(false)
            }
          } else {
            // Clear search results when search query is empty
            setSearchResults(null)
          }
        }, 500) // 500ms delay
      }
    })(),
    [user?.token],
  )

  // Handle search input change
  const handleSearchChange = (e) => {
    const query = e.target.value
    setSearchQuery(query)

    // Immediately clear results if query is empty
    if (query.trim() === '') {
      setSearchResults(null)
      setIsSearching(false)
    }
  }

  // Clear search
  const clearSearch = () => {
    setSearchQuery('')
    setSearchResults(null)
    setIsSearching(false)
  }

  // Trigger search when searchQuery or sortBy changes
  useEffect(() => {
    if (user?.token && searchQuery.trim().length > 0) {
      debouncedSearch(searchQuery, sortBy)
    }
  }, [searchQuery, sortBy, debouncedSearch, user?.token])

  // Handle sort change - when sorting changes, rerun the search
  const handleSortChange = (e) => {
    const newSortValue = e.target.value
    setSortBy(newSortValue)

    // If we have an active search, immediately trigger a new search with the new sort
    if (searchQuery.trim().length > 0 && user?.token) {
      debouncedSearch(searchQuery, newSortValue)
    }
  }

  return (
    <>
      <PageMetaData title="Test Management" />

      {/* Header Section */}
      <div className="bg-light p-4 mb-4">
        <Container fluid>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0 fw-bold">Test Management</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 mt-2">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-muted">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-dark" aria-current="page">
                    Tests
                  </li>
                </ol>
              </nav>
            </div>
            <div className="d-flex gap-2">
              <Button variant="outline-primary" className="d-flex align-items-center" onClick={() => setShowAddFolder(true)}>
                <FiFolder className="me-2" />
                New Folder
              </Button>
              <Button className="btn-add-content d-flex align-items-center" onClick={() => setShowCreateTest(true)}>
                <FaPlus className="me-2" />
                New Test
              </Button>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="search-input">
                <InputGroup>
                  <InputGroup.Text className="border-end-0">
                    <FiSearch className="text-muted" />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search tests..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="border-start-0 ps-0"
                  />
                  {searchQuery && (
                    <InputGroup.Text className="bg-transparent cursor-pointer" onClick={clearSearch} style={{ cursor: 'pointer' }}>
                      <FiX className="text-muted" />
                    </InputGroup.Text>
                  )}
                </InputGroup>
                {isSearching && <div className="text-muted small mt-1">Searching...</div>}
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                <Form.Select value={sortBy} onChange={handleSortChange} className="form-select">
                  <option value="date">Last Modified</option>
                  <option value="name">Test Name</option>
                </Form.Select>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Content */}
      <Container fluid>
        <div className="content-management-content px-4">
          {!showCreateTest && !showSettings && (
            <TestsPortal
              view={view}
              searchQuery={searchQuery}
              sortBy={sortBy}
              showAddFolder={showAddFolder}
              setShowAddFolder={setShowAddFolder}
              onCreateTest={() => setShowCreateTest(true)}
              onOpenSettings={() => setShowSettings(true)}
              onFolderSelect={handleFolderSelect}
              searchResults={searchResults}
              isSearching={isSearching}
              onClearSearch={clearSearch}
            />
          )}

          {showCreateTest && (
            <div className="content-management-form">
              <CreateTest
                onClose={() => setShowCreateTest(false)}
                onSave={(testData) => {
                  setProgress(75)
                  setActiveStep(2)
                  setShowCreateTest(false)
                }}
                currentFolderId={currentFolderId}
              />
            </div>
          )}

          {showSettings && (
            <div className="content-management-settings">
              <TestSettings
                onClose={() => setShowSettings(false)}
                onSave={(settings) => {
                  setShowSettings(false)
                }}
              />
            </div>
          )}
        </div>
      </Container>
    </>
  )
}

export default ContentManagement
