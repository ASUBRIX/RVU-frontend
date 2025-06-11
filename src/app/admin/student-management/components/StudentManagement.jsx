import React, { useState, useEffect, useMemo } from 'react';
import { Card, Button, Row, Col, Form, InputGroup, Modal, Tabs, Tab } from 'react-bootstrap';
import { FaSearch, FaPlus, FaDownload, FaUpload, FaFilter } from 'react-icons/fa';
import StudentTable from './StudentTable';
import StudentForm from './StudentForm';
import { getAllStudents, addStudent, updateStudent, deleteStudent } from '@/helpers/studentManagementApi.js';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import './StudentManagement.scss';

const StudentManagement = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [currentStudent, setCurrentStudent] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');
  const [students, setStudents] = useState([]);

  const fetchStudents = async () => {
    try {
      const res = await getAllStudents();
      setStudents(res.data);
    } catch (error) {
      console.error('Failed to load students:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const generateStudentId = (index) => `STU${String(index + 1).padStart(3, '0')}`;

  const handleAddStudent = async (studentData) => {
    try {
      if (currentStudent) {
        await updateStudent(currentStudent.id, studentData);
      } else {
        studentData.enrollment_id = generateStudentId(students.length);
        await addStudent(studentData);
      }
      fetchStudents();
      setShowAddModal(false);
      setCurrentStudent(null);
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    await deleteStudent(studentId);
    fetchStudents();
  };

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const match =
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.enrollment_id?.toLowerCase().includes(searchTerm.toLowerCase());

      const statusFilter =
        filter === 'all' || (filter === 'active' && student.status === 'active') || (filter === 'inactive' && student.status === 'inactive');

      return match && statusFilter;
    });
  }, [students, searchTerm, filter]);

  const handleExportExcel = () => {
    const exportData = filteredStudents.map((student) => ({
      ID: student.enrollment_id || '',
      Name: student.name || '',
      Email: student.email || '',
      Phone: student.phone || '',
      Program: student.program || '',
      Semester: student.semester || '',
      Year: student.year || '',
      Status: student.status || '',
      Courses: Array.isArray(student.courses) ? student.courses.join(', ') : '',
      EnrollmentDate: student.enrollment_date ? new Date(student.enrollment_date).toLocaleDateString() : '',
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Students');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });

    const blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(blob, 'students.xlsx');
  };

  const totalCount = students.length;
  const activeCount = students.filter(s => s.status === 'active').length;

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
                <Form.Select className="border-0 bg-light" value={filter} onChange={(e) => setFilter(e.target.value)}>
                  <option value="all">All Students</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </InputGroup>
            </Col>
            <Col md={3} lg={2} className="d-flex gap-2">
              <Button variant="outline-success" className="w-100" onClick={handleExportExcel}>
                <FaDownload className="me-2" /> Export
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
              setShowAddModal(true);
            }}
            onDelete={(student) => handleDeleteStudent(student.id)}
          />
        </Tab>
      </Tabs>

      <Modal
        show={showAddModal}
        onHide={() => {
          setShowAddModal(false);
          setCurrentStudent(null);
        }}
        size="lg"
        centered>
        <Modal.Header closeButton>
          <Modal.Title>{currentStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm
            onSubmit={handleAddStudent}
            student={currentStudent}
            onCancel={() => {
              setShowAddModal(false);
              setCurrentStudent(null);
            }}
          />
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default StudentManagement;
