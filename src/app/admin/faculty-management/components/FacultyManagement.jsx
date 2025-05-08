import React, { useState, useMemo } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaPlus, FaFilter, FaDownload, FaUpload } from 'react-icons/fa';
import FacultyTable from './FacultyTable';
import FacultyForm from './FacultyForm';

const FacultyManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentFaculty, setCurrentFaculty] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Sample faculty data
  const [faculties, setFaculties] = useState([
    {
      id: 1,
      facultyId: 'FAC-2023-001',
      name: 'Dr. Robert Anderson',
      email: 'robert.anderson@example.com',
      phone: '+1 (555) 987-6543',
      department: 'Computer Science',
      designation: 'Professor',
      joiningDate: '2021-06-15',
      subjects: ['Advanced Algorithms', 'Data Structures'],
      status: 'active',
      qualification: 'Ph.D in Computer Science',
      experience: '12 years',
      avatar: 'default-male'
    },
    {
      id: 2,
      facultyId: 'FAC-2023-002',
      name: 'Dr. Jennifer Lee',
      email: 'jennifer.lee@example.com',
      phone: '+1 (555) 876-5432',
      department: 'Data Science',
      designation: 'Associate Professor',
      joiningDate: '2022-01-10',
      subjects: ['Machine Learning', 'Statistical Analysis'],
      status: 'active',
      qualification: 'Ph.D in Statistics',
      experience: '8 years',
      avatar: 'default-female'
    },
    {
      id: 3,
      facultyId: 'FAC-2023-003',
      name: 'Prof. David Miller',
      email: 'david.miller@example.com',
      phone: '+1 (555) 765-4321',
      department: 'Web Development',
      designation: 'Assistant Professor',
      joiningDate: '2022-03-20',
      subjects: ['Front-end Development', 'UI/UX Design'],
      status: 'inactive',
      qualification: "Master's in Computer Applications",
      experience: '6 years',
      avatar: 'default-male'
    },
    {
      id: 4,
      facultyId: 'FAC-2023-004',
      name: 'Dr. Maria Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 654-3210',
      department: 'Database Management',
      designation: 'Professor',
      joiningDate: '2021-08-15',
      subjects: ['SQL Advanced', 'NoSQL Databases'],
      status: 'active',
      qualification: 'Ph.D in Database Systems',
      experience: '15 years',
      avatar: 'default-female'
    },
    {
      id: 5,
      facultyId: 'FAC-2023-005',
      name: 'Prof. James Wilson',
      email: 'james.wilson@example.com',
      phone: '+1 (555) 543-2109',
      department: 'Cybersecurity',
      designation: 'Associate Professor',
      joiningDate: '2022-05-01',
      subjects: ['Network Security', 'Ethical Hacking'],
      status: 'active',
      qualification: 'Ph.D in Cybersecurity',
      experience: '10 years',
      avatar: 'default-male'
    }
  ]);

  // Handle adding a new faculty
  const handleAddFaculty = (faculty) => {
    const newId = faculties.length > 0 ? Math.max(...faculties.map(f => f.id)) + 1 : 1;
    const newFacultyId = `FAC-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;
    
    const newFaculty = {
      id: newId,
      facultyId: newFacultyId,
      ...faculty,
      joiningDate: faculty.joiningDate || new Date().toISOString().split('T')[0]
    };
    
    setFaculties([...faculties, newFaculty]);
    setShowAddModal(false);
  };

  // Handle editing a faculty
  const handleEditFaculty = (updatedFaculty) => {
    setFaculties(faculties.map(faculty => 
      faculty.id === updatedFaculty.id ? updatedFaculty : faculty
    ));
    setShowEditModal(false);
  };

  // Handle deleting a faculty
  const handleDeleteFaculty = () => {
    setFaculties(faculties.filter(faculty => faculty.id !== currentFaculty.id));
    setShowDeleteModal(false);
  };

  // Filter faculties based on search term and department filter
  const filteredFaculties = useMemo(() => {
    return faculties.filter(faculty => {
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

  // Get unique departments for filter dropdown
  const departments = useMemo(() => {
    return [...new Set(faculties.map(faculty => faculty.department))];
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
                  <option disabled>─────────────</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3} lg={2} className="d-flex gap-2">
              <Button variant="outline-success" className="w-100">
                <FaDownload className="me-2" /> Export
              </Button>
              <Button variant="outline-secondary" className="w-100">
                <FaUpload className="me-2" /> Import
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Tabs defaultActiveKey="allFaculties" className="mb-4">
        <Tab eventKey="allFaculties" title="All Faculty">
          <FacultyTable 
            faculties={filteredFaculties} 
            onEdit={(faculty) => {
              setCurrentFaculty(faculty);
              setShowEditModal(true);
            }}
            onDelete={(faculty) => {
              setCurrentFaculty(faculty);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
        <Tab eventKey="active" title="Active Faculty">
          <FacultyTable 
            faculties={filteredFaculties.filter(f => f.status === 'active')} 
            onEdit={(faculty) => {
              setCurrentFaculty(faculty);
              setShowEditModal(true);
            }}
            onDelete={(faculty) => {
              setCurrentFaculty(faculty);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
        <Tab eventKey="inactive" title="Inactive Faculty">
          <FacultyTable 
            faculties={filteredFaculties.filter(f => f.status === 'inactive')} 
            onEdit={(faculty) => {
              setCurrentFaculty(faculty);
              setShowEditModal(true);
            }}
            onDelete={(faculty) => {
              setCurrentFaculty(faculty);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
      </Tabs>

      {/* Add Faculty Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <FacultyForm onSubmit={handleAddFaculty} />
        </Modal.Body>
      </Modal>

      {/* Edit Faculty Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFaculty && (
            <FacultyForm faculty={currentFaculty} onSubmit={handleEditFaculty} />
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentFaculty && (
            <p>Are you sure you want to delete <strong>{currentFaculty.name}</strong>? This action cannot be undone.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteFaculty}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default FacultyManagement; 