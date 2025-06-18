import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal } from 'react-bootstrap';
import { FaSearch, FaPlus, FaFilter, FaDownload } from 'react-icons/fa';
import FacultyTable from './FacultyTable';
import FacultyForm from './FacultyForm';
import { getAllFaculties, createFaculty, updateFaculty, deleteFaculty } from '@/helpers/facultyApi';
import { useNotificationContext } from '../../../../context/useNotificationContext';

const FacultyManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [faculties, setFaculties] = useState([]);
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    fetchFaculties();
  }, []);

  const fetchFaculties = async () => {
    try {
      const res = await getAllFaculties();
      const normalized = res.data.map((f) => ({
        ...f,
        facultyId: f.facultyId || f.faculty_id || `FAC${String(f.id).padStart(3, '0')}`
      }));
      setFaculties(normalized);
    } catch (err) {
      console.error('Error fetching faculties:', err);
    }
  };

  const handleAddFaculty = async (faculty) => {
    if (!faculty) return;
    try {
      const newFacultyId = `FAC-${new Date().getFullYear()}-${String(Date.now()).slice(-3)}`;
      const res = await createFaculty({ ...faculty, facultyId: newFacultyId });
      setFaculties((prev) => [...prev, res.data]);
      setShowAddModal(false);
      showNotification && showNotification({ title: 'Created', message: 'Faculty added successfully', variant: 'success' });
    } catch (err) {
      console.error('Error adding faculty:', err);
      showNotification && showNotification({ title: 'Error', message: 'Failed to add faculty', variant: 'danger' });
    }
  };

  const handleEditFaculty = async (updatedFaculty) => {
    try {
      const res = await updateFaculty(updatedFaculty.id, updatedFaculty);
      setFaculties((prev) => prev.map((f) => (f.id === updatedFaculty.id ? res.data : f)));
      setShowEditModal(false);
      showNotification && showNotification({ title: 'Updated', message: 'Faculty updated successfully', variant: 'success' });
    } catch (err) {
      console.error('Error updating faculty:', err);
      showNotification && showNotification({ title: 'Error', message: 'Failed to update faculty', variant: 'danger' });
    }
  };

  const handleDeleteFaculty = async () => {
    try {
      await deleteFaculty(currentFaculty.id);
      setFaculties((prev) => prev.filter((f) => f.id !== currentFaculty.id));
      setShowDeleteModal(false);
      showNotification && showNotification({ title: 'Deleted', message: 'Faculty deleted successfully', variant: 'success' });
    } catch (err) {
      console.error('Error deleting faculty:', err);
      showNotification && showNotification({ title: 'Error', message: 'Failed to delete faculty', variant: 'danger' });
    }
  };

  const handleStatusChange = async (facultyId, newStatus) => {
    try {
      const facultyToUpdate = faculties.find((f) => f.id === facultyId);
      if (!facultyToUpdate) return;
      const updated = { ...facultyToUpdate, status: newStatus };
      const res = await updateFaculty(facultyId, updated);
      setFaculties((prev) => prev.map((f) => (f.id === facultyId ? res.data : f)));
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const filteredFaculties = useMemo(() => {
    return faculties.filter((faculty) => {
      const matchesSearch =
        faculty.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faculty.facultyId.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesFilter =
        filter === 'all' ||
        (filter === 'active' && faculty.status === 'active') ||
        (filter === 'inactive' && faculty.status === 'inactive') ||
        filter === faculty.department;

      return matchesSearch && matchesFilter;
    });
  }, [faculties, searchTerm, filter]);

  const departments = useMemo(() => {
    return [...new Set(faculties.map((f) => f.department))];
  }, [faculties]);

  return (
    <div className="faculty-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Faculty Management</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" /> Add New Faculty
        </Button>
      </div>

      <Card className="shadow-sm border-0 mb-4">
        <Card.Body>
          <Row className="g-3">
            <Col md={6} lg={8}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0">
                  <FaSearch className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email or ID..."
                  className="border-0 bg-light"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-0">
                  <FaFilter className="text-muted" />
                </InputGroup.Text>
                <Form.Select
                  className="border-0 bg-light"
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                >
                  <option value="all">All Faculties</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3} lg={2}>
              <Button variant="outline-success" className="w-100">
                <FaDownload className="me-2" /> Export
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Removed Tabs - Direct Faculty Table */}
      <FacultyTable
        faculty={filteredFaculties}
        onEdit={(faculty) => {
          setCurrentFaculty(faculty);
          setShowEditModal(true);
        }}
        onDelete={(faculty) => {
          setCurrentFaculty(faculty);
          setShowDeleteModal(true);
        }}
        onStatusChange={handleStatusChange}  
      />

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FacultyForm onSubmit={handleAddFaculty} />
        </Modal.Body>
      </Modal>

      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFaculty && <FacultyForm faculty={currentFaculty} onSubmit={handleEditFaculty} />}
        </Modal.Body>
      </Modal>

      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFaculty && <p>Are you sure you want to delete <strong>{currentFaculty.name}</strong>?</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteFaculty}>Delete</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacultyManagement;