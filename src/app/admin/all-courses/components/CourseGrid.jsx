// === Updated CourseGrid.jsx ===
import { useEffect, useState } from 'react';
import { Card, Col, Row, Badge, Spinner } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { getAllCourses } from '../../../../helpers/courseApi';

const CourseGrid = ({ searchQuery, sortBy, filters }) => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setLoading(true);
        const response = await getAllCourses();
        setCourses(response.data);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses
    .filter((course) => {
      if (searchQuery && !course.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      if (filters.category && course.category !== filters.category) return false;
      if (filters.status && course.status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.title.localeCompare(b.title);
        case 'price_low_high':
          return a.price - b.price;
        case 'price_high_low':
          return b.price - a.price;
        case 'top_selling':
          return b.enrolled - a.enrolled;
        case 'most_popular':
          return b.review_count - a.review_count;
        case 'newest':
        default:
          return new Date(b.created_at) - new Date(a.created_at);
      }
    });

  if (loading) {
    return <div className="text-center py-5"><Spinner animation="border" variant="primary" /></div>;
  }

  return (
    <Row className="g-4">
      {filteredCourses.map((course) => (
        <Col sm={6} lg={6} xl={4} key={course.id}>
          <Link to={`/admin/edit-course/${course.id}`} className="text-decoration-none">
            <Card className="h-100 shadow-sm hover-shadow transition-all border-0">
              <div className="position-relative">
                <div
                  className="card-img-top"
                  style={{
                    height: '160px',
                    backgroundImage: `url(${course.thumbnail})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                />
                <Badge
                  bg={course.visibility_status === 'published' ? 'success' : 'warning'}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {course.visibility_status}
                </Badge>
              </div>
              <Card.Body className="p-3">
                <Badge
                  bg="light"
                  className="text-dark px-2 py-1 rounded-pill fw-normal mb-2"
                >
                  {course.category || 'General'}
                </Badge>
                <h5 className="card-title mb-2 text-dark">{course.title}</h5>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-success fw-bold">₹{course.price}</h4>
                  <div className="d-flex align-items-center small">
                    <FaStar className="text-warning me-1" />
                    <span className="text-warning fw-bold">{course.rating || '4.0'}</span>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Link>
        </Col>
      ))}
      {filteredCourses.length === 0 && (
        <Col xs={12}>
          <div className="text-center py-5">
            <div className="mb-4">
              <i className="fas fa-search fa-3x text-muted"></i>
            </div>
            <h4 className="text-muted">No courses found</h4>
            <p className="text-muted mb-0">Try adjusting your search or filter criteria</p>
          </div>
        </Col>
      )}
    </Row>
  );
};

export default CourseGrid;
