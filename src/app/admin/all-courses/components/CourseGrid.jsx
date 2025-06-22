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
        
        // Fix: Access response directly, not response.data
        // Also add safety check for array
        setCourses(Array.isArray(response) ? response : []);
      } catch (error) {
        console.error('Error fetching courses:', error);
        // Set empty array on error to prevent crashes
        setCourses([]);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses
    .filter((course) => {
      if (searchQuery && !course.title?.toLowerCase().includes(searchQuery.toLowerCase())) return false;
      
      // Fix: Handle tags array for category filtering
      if (filters?.category) {
        const courseCategory = course.tags && Array.isArray(course.tags) 
          ? course.tags.find(tag => tag === filters.category)
          : course.category;
        if (!courseCategory || courseCategory !== filters.category) return false;
      }
      
      if (filters?.status && course.visibility_status !== filters.status) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'price_low_high':
          return (a.price || 0) - (b.price || 0);
        case 'price_high_low':
          return (b.price || 0) - (a.price || 0);
        case 'top_selling':
          return (b.enrolled || 0) - (a.enrolled || 0);
        case 'most_popular':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
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
                    backgroundImage: `url(${course.thumbnail || '/placeholder-course.jpg'})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundColor: '#f8f9fa' // Fallback color
                  }}
                />
                <Badge
                  bg={course.visibility_status === 'published' ? 'success' : 'warning'}
                  className="position-absolute top-0 end-0 m-2"
                >
                  {course.visibility_status || 'draft'}
                </Badge>
              </div>
              <Card.Body className="p-3">
                <Badge
                  bg="light"
                  className="text-dark px-2 py-1 rounded-pill fw-normal mb-2"
                >
                  {/* Handle tags array or fallback to general */}
                  {course.tags && Array.isArray(course.tags) && course.tags.length > 0 
                    ? course.tags[0] 
                    : course.category || 'General'
                  }
                </Badge>
                <h5 className="card-title mb-2 text-dark">{course.title || 'Untitled Course'}</h5>
                <p className="card-text text-muted small mb-3" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {course.short_description || course.full_description || 'No description available'}
                </p>
                <div className="d-flex justify-content-between align-items-center">
                  <h4 className="mb-0 text-success fw-bold">
                    ₹{course.price || 0}
                    {course.discount > 0 && (
                      <small className="text-muted text-decoration-line-through ms-2">
                        ₹{(course.price / (1 - course.discount / 100)).toFixed(0)}
                      </small>
                    )}
                  </h4>
                  <div className="d-flex align-items-center small">
                    <FaStar className="text-warning me-1" />
                    <span className="text-warning fw-bold">{course.rating || '4.0'}</span>
                    <span className="text-muted ms-1">({course.review_count || 0})</span>
                  </div>
                </div>
                <div className="mt-2 d-flex justify-content-between align-items-center small text-muted">
                  <span>{course.total_lectures || 0} lectures</span>
                  <span>{course.level || 'Beginner'}</span>
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
            <p className="text-muted mb-0">
              {courses.length === 0 
                ? "No courses have been created yet. Create your first course!" 
                : "Try adjusting your search or filter criteria"
              }
            </p>
            {courses.length === 0 && (
              <Link to="/admin/edit-course/new" className="btn btn-primary mt-3">
                Create Your First Course
              </Link>
            )}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default CourseGrid;