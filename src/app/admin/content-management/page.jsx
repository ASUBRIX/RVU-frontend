import React, { useEffect, useState, useCallback } from 'react';
import {Container,Row,Col,Button,Form,InputGroup,Spinner,} from 'react-bootstrap';
import { FiSearch, FiFilePlus, FiX } from 'react-icons/fi';
import CreateChoiceModal from './components/CreateChoiceModal';
import CreateTest from './components/CreateTest';
import { useNotificationContext } from '@/context/useNotificationContext';
import { searchTests } from '@/helpers/admin/testApi.js';
import TestsPortal from './components/TestsPortal';

const ContentManagement = () => {
  const { showNotification } = useNotificationContext();
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [showChoiceModal, setShowChoiceModal] = useState(false);
  const [showCreateTest, setShowCreateTest] = useState(false);
  const [currentFolderId, setCurrentFolderId] = useState(null);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSearchResults(null);
    setIsSearching(false);
  };

  const debouncedSearch = useCallback(() => {
    let timeout;
    return (query) => {
      clearTimeout(timeout);
      timeout = setTimeout(async () => {
        if (query.trim()) {
          setIsSearching(true);
          try {
            const result = await searchTests(query, 'modified');
            setSearchResults(result);
          } catch (error) {
            console.error('Search error:', error);
            showNotification({
              message: 'Search failed.',
              variant: 'danger',
            });
          } finally {
            setIsSearching(false);
          }
        } else {
          setSearchResults(null);
        }
      }, 500);
    };
  }, [showNotification]);

  useEffect(() => {
    if (searchQuery.trim()) {
      debouncedSearch()(searchQuery);
    } else {
      clearSearch();
    }
  }, [searchQuery, debouncedSearch]);

  return (
    <Container fluid className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h3 className="fw-bold mb-0">Test Management</h3>
          <span className="text-muted">Manage folders and tests</span>
        </div>
        <div>
          <Button variant="primary" onClick={() => setShowChoiceModal(true)}>
            <FiFilePlus className="me-2" /> New
          </Button>
        </div>
      </div>

      <Row className="mb-3">
        <Col md={8}>
          <InputGroup>
            <InputGroup.Text>
              <FiSearch />
            </InputGroup.Text>
            <Form.Control
              type="text"
              placeholder="Search tests or folders..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
            {searchQuery && (
              <Button variant="outline-secondary" onClick={clearSearch}>
                <FiX />
              </Button>
            )}
          </InputGroup>
        </Col>
      </Row>

      {/* Main Portal Display */}
      <TestsPortal
        searchResults={searchResults}
        isSearching={isSearching}
        onFolderSelect={setCurrentFolderId}
        onCreateTest={() => setShowCreateTest(true)}
      />

      {/* Create Option Modal */}
      <CreateChoiceModal
        show={showChoiceModal}
        onHide={() => setShowChoiceModal(false)}
        onSelectFolder={() => {
          setShowChoiceModal(false);
          // You can implement folder modal opening here
        }}
        onSelectTest={() => {
          setShowChoiceModal(false);
          setShowCreateTest(true);
        }}
      />

      {/* Create Test Modal/Panel */}
      {showCreateTest && (
        <CreateTest
          onClose={() => setShowCreateTest(false)}
          onSave={() => {
            setShowCreateTest(false);
          }}
          currentFolderId={currentFolderId}
        />
      )}
    </Container>
  );
};

export default ContentManagement;
