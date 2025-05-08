/**
 * Component SCSS:
 * - Details styles: src/assets/scss/components/_details-page.scss
 * - Faculty specific styles: src/assets/scss/components/_faculty-management.scss
 */

import React from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { 
  FaUserTie, FaEnvelope, FaPhone, FaCalendarAlt,
  FaBuilding, FaChalkboardTeacher, FaArrowLeft,
  FaEdit, FaTrash, FaBook, FaClock, FaUsers
} from 'react-icons/fa';

// Dummy teaching courses data
const dummyTeachingCourses = [
  {
    id: 1,
    code: 'CS301',
    name: 'Advanced Programming',
    schedule: 'Mon, Wed 10:00 AM',
    students: 45,
    status: 'ongoing',
    completion: 70
  },
  {
    id: 2,
    code: 'CS401',
    name: 'Software Engineering',
    schedule: 'Tue, Thu 2:00 PM',
    students: 38,
    status: 'completed',
    completion: 100
  },
  {
    id: 3,
    code: 'CS201',
    name: 'Data Structures',
    schedule: 'Wed, Fri 11:30 AM',
    students: 52,
    status: 'upcoming',
    completion: 0
  }
];

const FacultyDetails = ({ faculty, onBack, onEdit, onDelete }) => {
  if (!faculty) {
    return (
      <Container fluid className="py-4">
        <Button variant="link" className="mb-4 ps-0" onClick={onBack}>
          <FaArrowLeft className="me-2" />
          Back to Faculty List
        </Button>
        <div className="text-center py-5">
          <h3>Faculty not found</h3>
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
          Back to Faculty List
        </Button>
        <div>
          <Button variant="outline-primary" className="me-2" onClick={() => onEdit(faculty)}>
            <FaEdit className="me-2" />
            Edit
          </Button>
          <Button variant="outline-danger" onClick={() => onDelete(faculty)}>
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
                <FaUserTie />
              </div>
            </Col>
            <Col md={8}>
              <h2>{faculty.name}</h2>
              <p>{faculty.designation} • {faculty.department}</p>
              <span className={`status-badge ${faculty.status}`}>
                {faculty.status.charAt(0).toUpperCase() + faculty.status.slice(1)}
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
                    <FaUserTie />
                  </div>
                  <div className="info-content">
                    <span className="label">Faculty ID</span>
                    <span className="value">{faculty.facultyId}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaEnvelope />
                  </div>
                  <div className="info-content">
                    <span className="label">Email</span>
                    <span className="value">{faculty.email}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaPhone />
                  </div>
                  <div className="info-content">
                    <span className="label">Phone</span>
                    <span className="value">{faculty.phone}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaCalendarAlt />
                  </div>
                  <div className="info-content">
                    <span className="label">Join Date</span>
                    <span className="value">{faculty.joinDate}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Professional Information */}
        <Col md={6} className="mb-4">
          <Card className="info-card">
            <Card.Body>
              <h4 className="card-title">Professional Information</h4>
              <div className="info-list">
                <div className="info-item">
                  <div className="icon">
                    <FaChalkboardTeacher />
                  </div>
                  <div className="info-content">
                    <span className="label">Designation</span>
                    <span className="value">{faculty.designation}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaBuilding />
                  </div>
                  <div className="info-content">
                    <span className="label">Department</span>
                    <span className="value">{faculty.department}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaClock />
                  </div>
                  <div className="info-content">
                    <span className="label">Experience</span>
                    <span className="value">{faculty.experience || '8 Years'}</span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="icon">
                    <FaBook />
                  </div>
                  <div className="info-content">
                    <span className="label">Specialization</span>
                    <span className="value">{faculty.specialization || 'Computer Science'}</span>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Teaching Courses */}
        <Col md={12}>
          <Card className="courses-card">
            <Card.Body>
              <h4 className="card-title">Teaching Courses</h4>
              <Table responsive className="courses-table">
                <thead>
                  <tr>
                    <th>Course Code</th>
                    <th>Course Name</th>
                    <th>Schedule</th>
                    <th>Students</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {dummyTeachingCourses.map((course) => (
                    <tr key={course.id}>
                      <td><strong>{course.code}</strong></td>
                      <td>{course.name}</td>
                      <td>{course.schedule}</td>
                      <td>
                        <div className="instructor-info">
                          <div className="instructor-avatar">
                            <FaUsers />
                          </div>
                          {course.students} students
                        </div>
                      </td>
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

export default FacultyDetails; 