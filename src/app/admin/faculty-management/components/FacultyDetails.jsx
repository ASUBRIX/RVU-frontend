/**
 * Component SCSS:
 * - Details styles: src/assets/scss/components/_details-page.scss
 * - Faculty specific styles: src/assets/scss/components/_faculty-management.scss
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Table } from 'react-bootstrap';
import { 
  FaUserTie, FaEnvelope, FaPhone,
  FaBuilding, FaChalkboardTeacher, FaArrowLeft,
  FaEdit, FaTrash, FaBook, FaClock, FaUsers
} from 'react-icons/fa';

const FacultyDetails = ({ faculty, onBack, onEdit, onDelete }) => {
  const [teachingCourses, setTeachingCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Avatar display function
  const getAvatarDisplay = () => {
    if (faculty.avatar && faculty.avatar !== 'default' && faculty.avatar.startsWith('data:')) {
      return (
        <img 
          src={faculty.avatar} 
          alt="Faculty Avatar" 
          className="rounded-circle" 
          width="80" 
          height="80" 
          style={{ objectFit: 'cover' }}
        />
      );
    }
    return <FaUserTie size={80} className="text-primary" />;
  };

  // Fetch teaching courses for this faculty
  useEffect(() => {
    if (faculty?.id) {
      fetchTeachingCourses(faculty.id);
    }
  }, [faculty]);

  const fetchTeachingCourses = async (facultyId) => {
    try {
      setLoading(true);
      // Replace this with your actual API call
      // const response = await getTeachingCourses(facultyId);
      // setTeachingCourses(response.data);
      
      // For now, using empty array until API is implemented
      setTeachingCourses([]);
    } catch (error) {
      console.error('Error fetching teaching courses:', error);
      setTeachingCourses([]);
    } finally {
      setLoading(false);
    }
  };

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
                {getAvatarDisplay()}
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
                    <span className="value">{faculty.faculty_id || faculty.facultyId || `FAC${String(faculty.id).padStart(3, '0')}`}</span>
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
                {faculty.qualification && (
                  <div className="info-item">
                    <div className="icon">
                      <FaBook />
                    </div>
                    <div className="info-content">
                      <span className="label">Qualification</span>
                      <span className="value">{faculty.qualification}</span>
                    </div>
                  </div>
                )}
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
                {faculty.experience && (
                  <div className="info-item">
                    <div className="icon">
                      <FaClock />
                    </div>
                    <div className="info-content">
                      <span className="label">Experience</span>
                      <span className="value">{faculty.experience}</span>
                    </div>
                  </div>
                )}
                {faculty.board_member && (
                  <div className="info-item">
                    <div className="icon">
                      <FaUsers />
                    </div>
                    <div className="info-content">
                      <span className="label">Board Member</span>
                      <span className="value">Yes</span>
                    </div>
                  </div>
                )}
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Bio Section */}
        {faculty.bio && (
          <Col md={12} className="mb-4">
            <Card className="info-card">
              <Card.Body>
                <h4 className="card-title">Biography</h4>
                <p className="text-muted">{faculty.bio}</p>
              </Card.Body>
            </Card>
          </Col>
        )}

        {/* Teaching Courses - Dynamic */}
        <Col md={12}>
          <Card className="courses-card">
            <Card.Body>
              <h4 className="card-title">Teaching Courses</h4>
              
              {loading ? (
                <div className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="mt-2 text-muted">Loading courses...</p>
                </div>
              ) : teachingCourses.length > 0 ? (
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
                    {teachingCourses.map((course) => (
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
              ) : (
                <div className="text-center py-5">
                  <FaBook size={48} className="text-muted mb-3" />
                  <h5 className="text-muted">No Courses Assigned</h5>
                  <p className="text-muted">This faculty member is not currently assigned to any courses.</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FacultyDetails;