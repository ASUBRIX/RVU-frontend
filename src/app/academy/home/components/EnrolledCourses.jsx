import React from 'react';
import { Container, Row, Col, Card, CardBody, CardTitle, Button } from 'react-bootstrap';
import { FaClock, FaUserGraduate, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import thumbnailPlaceholder from '@/assets/images/bg/thumbnail-placeholder.webp';

// This would typically come from an API or user's data
const enrolledCoursesData = [
  {
    id: 1,
    title: 'Complete Web Development',
    image: thumbnailPlaceholder,
    progress: 75,
    instructor: 'John Doe',
    duration: '12 weeks',
    rating: 4.8,
    enrolled: 120,
    lastAccessed: '2 days ago'
  },
  {
    id: 2,
    title: 'Advanced Data Science with Python',
    image: thumbnailPlaceholder,
    progress: 45,
    instructor: 'Jane Smith',
    duration: '10 weeks',
    rating: 4.9,
    enrolled: 85,
    lastAccessed: '1 day ago'
  },
  {
    id: 3,
    title: 'UI/UX Design Fundamentals',
    image: thumbnailPlaceholder,
    progress: 30,
    instructor: 'Mike Johnson',
    duration: '8 weeks',
    rating: 4.7,
    enrolled: 95,
    lastAccessed: '3 days ago'
  }
];

const CourseCard = ({ course }) => {
  return (
    <Card className="shadow-hover overflow-hidden bg-transparent border-2 h-100 d-flex flex-column">
      <div className="position-relative">
        <img
          className="card-img-top"
          src={course.image}
          alt="Card image"
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="bg-overlay bg-dark opacity-4" />
        <div className="card-img-overlay d-flex align-items-start flex-column">
          <div className="w-100 mt-auto d-inline-flex"></div>
        </div>
      </div>
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-3">
          <div className="hstack gap-2">
            <span className="badge bg-light text-dark border border-secondary fw-semibold">ENROLLED</span>
            <span className="badge bg-light text-dark border border-secondary fw-semibold">IN PROGRESS</span>
          </div>
        </div>

        <CardTitle className="mb-3">
          <Link to={`/student/course-resume?id=${course.id}`}>{course.title}</Link>
        </CardTitle>

        <div className="d-flex align-items-center text-muted small mb-2">
          <FaClock className="me-2" />
          <span>Last accessed {course.lastAccessed}</span>
        </div>

        <hr />
        <div className="mt-auto">
          <div className="d-flex align-items-center mb-3">
            <div className="progress w-100" style={{ height: '8px' }}>
              <div 
                className="progress-bar bg-success" 
                role="progressbar" 
                style={{ width: `${course.progress}%` }} 
                aria-valuenow={course.progress} 
                aria-valuemin="0" 
                aria-valuemax="100"
              />
            </div>
            <span className="ms-2 small">{course.progress}%</span>
          </div>
          <Link 
            to={`/student/course-resume?id=${course.id}`}
            className="btn btn-primary w-100"
          >
            Continue Learning
          </Link>
        </div>
      </CardBody>
    </Card>
  )
}

const EnrolledCourses = () => {
  return (
    <section className="pt-0 pt-lg-5">
      <Container>
        <Row className="mb-4">
          <Col xs={6}>
            <h2 className="mb-0">Enrolled Courses</h2>
            <p className="text-muted">Continue your learning journey</p>
          </Col>
          <Col xs={6} className="text-end">
            <Link to="/student/my-courses" className="btn">
              View all
            </Link>
          </Col>
        </Row>
        <Row className="g-4">
          {enrolledCoursesData.map((course) => (
            <Col sm={12} md={4} key={course.id}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default EnrolledCourses;