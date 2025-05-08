import React, { useState, useMemo } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaPlus, FaEdit, FaTrash, FaDownload, FaUpload, FaFilter } from 'react-icons/fa';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';

const StudentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Sample student data
  const [students, setStudents] = useState([
    {
      id: 1,
      enrollmentId: 'ST-2023-001',
      name: 'John Smith',
      email: 'john.smith@example.com',
      phone: '+1 (555) 123-4567',
      enrollmentDate: '2023-01-15',
      courses: ['Advanced JavaScript', 'React Development'],
      status: 'active',
      paymentStatus: 'paid',
      avatar: 'default-male'
    },
    {
      id: 2,
      enrollmentId: 'ST-2023-002',
      name: 'Emily Johnson',
      email: 'emily.johnson@example.com',
      phone: '+1 (555) 234-5678',
      enrollmentDate: '2023-02-20',
      courses: ['Python for Data Science'],
      status: 'active',
      paymentStatus: 'pending',
      avatar: 'default-female'
    },
    {
      id: 3,
      enrollmentId: 'ST-2023-003',
      name: 'Michael Brown',
      email: 'michael.brown@example.com',
      phone: '+1 (555) 345-6789',
      enrollmentDate: '2023-01-10',
      courses: ['Web Development Bootcamp', 'SQL Database Design'],
      status: 'inactive',
      paymentStatus: 'paid',
      avatar: 'default-male'
    },
    {
      id: 4,
      enrollmentId: 'ST-2023-004',
      name: 'Sarah Davis',
      email: 'sarah.davis@example.com',
      phone: '+1 (555) 456-7890',
      enrollmentDate: '2023-03-05',
      courses: ['Machine Learning Fundamentals'],
      status: 'active',
      paymentStatus: 'paid',
      avatar: 'default-female'
    },
    {
      id: 5,
      enrollmentId: 'ST-2023-005',
      name: 'David Wilson',
      email: 'david.wilson@example.com',
      phone: '+1 (555) 567-8901',
      enrollmentDate: '2023-02-15',
      courses: ['Mobile App Development with Flutter'],
      status: 'active',
      paymentStatus: 'paid',
      avatar: 'default-male'
    },
    {
      id: 6,
      enrollmentId: 'ST-2023-006',
      name: 'Jessica Taylor',
      email: 'jessica.taylor@example.com',
      phone: '+1 (555) 678-9012',
      enrollmentDate: '2023-03-20',
      courses: ['AWS Certification Course'],
      status: 'inactive',
      paymentStatus: 'pending',
      avatar: 'default-female'
    }
  ]);

  // Handle adding a new student
  const handleAddStudent = (student) => {
    const newId = students.length > 0 ? Math.max(...students.map(s => s.id)) + 1 : 1;
    const newEnrollmentId = `ST-${new Date().getFullYear()}-${String(newId).padStart(3, '0')}`;
    
    const newStudent = {
      id: newId,
      enrollmentId: newEnrollmentId,
      ...student,
      enrollmentDate: new Date().toISOString().split('T')[0]
    };
    
    setStudents([...students, newStudent]);
    setShowAddModal(false);
  };

  // Handle editing a student
  const handleEditStudent = (updatedStudent) => {
    setStudents(students.map(student => 
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setShowEditModal(false);
  };

  // Handle deleting a student
  const handleDeleteStudent = () => {
    setStudents(students.filter(student => student.id !== currentStudent.id));
    setShowDeleteModal(false);
  };

  // Filter students based on search term and status filter
  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentId.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = 
        filter === 'all' || 
        (filter === 'active' && student.status === 'active') ||
        (filter === 'inactive' && student.status === 'inactive') ||
        (filter === 'pending' && student.paymentStatus === 'pending');
      
      return matchesSearch && matchesFilter;
    });
  }, [students, searchTerm, filter]);

  return (
    <div className="student-management">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h1 className="h3 mb-0">Student Management</h1>
        <Button variant="primary" onClick={() => setShowAddModal(true)}>
          <FaPlus className="me-2" /> Add New Student
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
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Payment Pending</option>
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

      <Tabs defaultActiveKey="allStudents" className="mb-4">
        <Tab eventKey="allStudents" title="All Students">
          <StudentTable 
            students={filteredStudents} 
            onEdit={(student) => {
              setCurrentStudent(student);
              setShowEditModal(true);
            }}
            onDelete={(student) => {
              setCurrentStudent(student);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
        <Tab eventKey="active" title="Active Students">
          <StudentTable 
            students={filteredStudents.filter(s => s.status === 'active')} 
            onEdit={(student) => {
              setCurrentStudent(student);
              setShowEditModal(true);
            }}
            onDelete={(student) => {
              setCurrentStudent(student);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
        <Tab eventKey="inactive" title="Inactive Students">
          <StudentTable 
            students={filteredStudents.filter(s => s.status === 'inactive')} 
            onEdit={(student) => {
              setCurrentStudent(student);
              setShowEditModal(true);
            }}
            onDelete={(student) => {
              setCurrentStudent(student);
              setShowDeleteModal(true);
            }}
          />
        </Tab>
      </Tabs>

      {/* Add Student Modal */}
      <Modal
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm onSubmit={handleAddStudent} />
        </Modal.Body>
      </Modal>

      {/* Edit Student Modal */}
      <Modal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Edit Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {currentStudent && (
            <StudentForm student={currentStudent} onSubmit={handleEditStudent} />
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
          {currentStudent && (
            <p>Are you sure you want to delete <strong>{currentStudent.name}</strong>? This action cannot be undone.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteStudent}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StudentManagement; 