/**
 * Component SCSS:
 * - Details styles: src/assets/scss/components/_details-page.scss
 * - Student specific styles: src/assets/scss/components/_student-management.scss
 */

import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { 
  FaGraduationCap, FaEnvelope, FaPhone, FaCalendarAlt,
  FaArrowLeft, FaEdit, FaTrash, FaBook, FaUserTie, FaClock
} from 'react-icons/fa';

// Dummy course data
const dummyCourses = [
  {
    id: 1,
    code: 'CS101',
    name: 'Introduction to Computer Science',
    instructor: 'Dr. John Smith',
    credits: 3,
    status: 'ongoing',
    progress: 65
  },
  {
    id: 2,
    code: 'MATH201',
    name: 'Advanced Mathematics',
    instructor: 'Prof. Sarah Johnson',
    credits: 4,
    status: 'completed',
    progress: 100
  },
  {
    id: 3,
    code: 'PHY102',
    name: 'Physics Fundamentals',
    instructor: 'Dr. Michael Brown',
    credits: 3,
    status: 'upcoming',
    progress: 0
  }
];

const StudentDetails = ({ student, onBack, onEdit, onDelete }) => {
  if (!student) {
    return (
      <Container fluid className="py-4">
        <Button variant="link" className="mb-4 ps-0" onClick={onBack}>
          <FaArrowLeft className="me-2" />
          Back to Student List
        </Button>
        <div className="text-center py-5">
          <h3>Student not found</h3>
        </div>
      </Container>
    );
  }

  return (
    <Container fluid className="py-4 details-page">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4 action-buttons">
        <Button variant="link" className="ps-0" onClick={onBack}>
          <FaArrowLeft className="me-2" />
          Back to Student List
        </Button>
        <div>
          <Button variant="outline-primary" className="me-2" onClick={() => onEdit(student)}>
            <FaEdit className="me-2" />
            Edit
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(student)}>
            <FaTrash className="me-2" />
            Delete
          </Button>
        </div>
      </div>

      {/* Profile Header Card */}
      <Card className="header-card mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={2} className="text-center">
              <div className="avatar-circle">
                <FaGraduationCap />
              </div>
            </Col>
            <Col md={8}>
              <h2>{student.name}</h2>
              <p>Student • {student.enrollmentId}</p>
              <span className={`status-badge ${student.status}`}>
                {student.status.charAt(0).toUpperCase() + student.status.slice(1)}
              </span>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Row>
        {/* Basic Information */}
        <Col md={6} className="mb-4">
          <Card className="info-card">
            <Card.Body>
              <h4 className="card-title">Basic Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <div className="icon">
                    <FaGraduationCap />
                  </div>
                  <div className="info-content">
                    <span className="label">Student ID</span>
                    <span className="value">{student.enrollmentId}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <span className="label">Email</span>
                    <span className="value">{student.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <span className="label">Phone</span>
                    <span className="value">{student.phone}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="info-content">
                    <span className="label">Enrollment Date</span>
                    <span className="value">{student.enrollmentDate}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Academic Information */}
        <Col md={6} className="mb-4">
          <Card className="info-card">
            <Card.Body>
              <h4 className="card-title">Academic Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <div className="icon">
                    <FaBook />
                  </div>
                  <div className="info-content">
                    <span className="label">Current Semester</span>
                    <span className="value">{student.semester || '3rd Semester'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaClock />
                  </div>
                  <div className="info-content">
                    <span className="label">Study Year</span>
                    <span className="value">{student.year || '2nd Year'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaGraduationCap />
                  </div>
                  <div className="info-content">
                    <span className="label">Program</span>
                    <span className="value">{student.program || 'Bachelor of Computer Science'}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Enrolled Courses */}
        <Col md={12}>
          <Card className="courses-card">
            <Card.Body>
              <h4 className="card-title">Enrolled Courses</h4>
              <Table responsive className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Instructor</th>
                    <th>Credits</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyCourses.map((course) => (
                    <tr key={course.id}>
                      <td><strong>{course.code}</strong></td>
                      <td>{course.name}</td>
                      <td>
                        <div className="instructor-info">
                          <div className="instructor-avatar">
                            <FaUserTie />
                          </div>
                          {course.instructor}
                        </div>
                      </td>
                      <td>{course.credits} credits</td>
                      <td>
                        <span className={`course-status ${course.status}`}>
                          {course.status.charAt(0).toUpperCase() + course.status.slice(1)}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StudentDetails; 