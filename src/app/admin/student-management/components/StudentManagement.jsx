
import React, { useState, useMemo } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaPlus, FaDownload, FaUpload, FaFilter } from 'react-icons/fa';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';
import { useAuthContext } from '@/context/useAuthContext';
import { addStudent } from '@/helpers/studentService';

const StudentManagement = () => {
  const { user } = useAuthContext();
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState([]);

  const handleAddStudent = async (studentData) => {

    try {
      const response = await addStudent(studentData, user.token);
      setStudents(prev => [...prev, response.student]);
      setShowAddModal(false);
    } catch (error) {
      console.error('Error adding student:', error);
      alert('Failed to add student.');
    }
  };

  const handleEditStudent = (updatedStudent) => {
    setStudents(students.map(student =>
      student.id === updatedStudent.id ? updatedStudent : student
    ));
    setShowEditModal(false);
  };

  const handleDeleteStudent = () => {
    setStudents(students.filter(student => student.id !== currentStudent.id));
    setShowDeleteModal(false);
  };

  const filteredStudents = useMemo(() => {
    return students.filter(student => {
      const matchesSearch =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollmentId?.toLowerCase().includes(searchTerm.toLowerCase());

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
      </Tabs>

      <Modal show={showAddModal} onHide={() => setShowAddModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add New Student</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm onSubmit={handleAddStudent} onCancel={() => setShowAddModal(false)} />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentManagement;