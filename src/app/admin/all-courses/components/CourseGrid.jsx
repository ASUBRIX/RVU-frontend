import { useEffect, useState } from 'react';
import { Card, Col, Row, Badge, Spinner, Dropdown, Button } from 'react-bootstrap';
import { FaStar, FaEllipsisV, FaEdit, FaEye, FaTrash, FaUsers, FaClock } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { getAllCourses } from '@/helpers/courseApi';
import { getThumbnailUrl } from '../../../../utils/thumbnailHelper';
import './CourseGrid.css';

const CourseGrid = ({ searchQuery, sortBy, filters, courses: propCourses, onCourseUpdate, getThumbnailUrl }) => {
  const [localCourses, setLocalCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Use prop courses if provided, otherwise fetch locally
  const courses = propCourses || localCourses;

  // Helper function to get full thumbnail URL
  const getFullThumbnailUrl = (thumbnailPath) => {
    // Use the prop function if available, otherwise use the utility
    if (getThumbnailUrl && typeof getThumbnailUrl === 'function') {
      return getThumbnailUrl(thumbnailPath);
    }
    
    // Fallback to utility function
    return getThumbnailUrl(thumbnailPath);
  };

  // Helper function to get status badge variant
  const getStatusBadgeVariant = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'secondary';
      case 'pending': return 'warning';
      case 'approved': return 'success';
      case 'rejected': return 'danger';
      default: return 'secondary';
    }
  };

  // Helper function to format price
  const formatPrice = (course) => {
    const price = parseFloat(course.price) || 0;
    const discount = parseFloat(course.discount) || 0;
    
    if (price === 0) {
      return { display: 'Free', isFree: true, className: 'text-success' };
    }
    
    if (course.is_discount_enabled && discount > 0) {
      const discountedPrice = price * (1 - discount / 100);
      return {
        display: `₹${discountedPrice.toFixed(2)}`,
        originalPrice: `₹${price.toFixed(2)}`,
        hasDiscount: true,
        className: 'text-success'
      };
    }
    
    return { display: `₹${price.toFixed(2)}`, className: 'text-dark' };
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  // Fetch courses only if not provided via props
  useEffect(() => {
    if (!propCourses) {
      const fetchCourses = async () => {
        try {
          setLoading(true);
          console.log('🔍 CourseGrid: Fetching courses locally...');
          const response = await getAllCourses();
          
          const coursesData = Array.isArray(response) ? response : (response.data || []);
          console.log('🔍 CourseGrid: Courses fetched:', coursesData);
          
          setLocalCourses(coursesData);
        } catch (error) {
          console.error('❌ CourseGrid: Error fetching courses:', error);
          setLocalCourses([]);
        } finally {
          setLoading(false);
        }
      };
      fetchCourses();
    } else {
      setLoading(false);
    }
  }, [propCourses]);

  // Filter and sort courses
  const filteredCourses = courses
    .filter((course) => {
      // Search filter
      if (searchQuery && !course.title?.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }
      
      // Category filter - handle both tags array and category field
      if (filters?.category) {
        const courseCategory = course.tags && Array.isArray(course.tags) 
          ? course.tags.find(tag => tag === filters.category)
          : course.category;
        if (!courseCategory || courseCategory !== filters.category) {
          return false;
        }
      }
      
      // Status filter
      if (filters?.status && course.visibility_status !== filters.status) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return (a.title || '').localeCompare(b.title || '');
        case 'price_low_high':
          return (parseFloat(a.price) || 0) - (parseFloat(b.price) || 0);
        case 'price_high_low':
          return (parseFloat(b.price) || 0) - (parseFloat(a.price) || 0);
        case 'top_selling':
          return (b.enrolled || 0) - (a.enrolled || 0);
        case 'most_popular':
          return (b.review_count || 0) - (a.review_count || 0);
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

  // Action handlers
  const handleEditCourse = (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/admin/edit-course/${courseId}`);
  };

  const handleViewCourse = (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    window.open(`/course/${courseId}`, '_blank');
  };

  const handleDeleteCourse = (courseId, e) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      console.log('Delete course:', courseId);
      if (onCourseUpdate) {
        onCourseUpdate();
      }
    }
  };

  if (loading) {
    return (
      <div className="text-center py-5 course-grid-loading">
        <Spinner animation="border" variant="primary" className="mb-3" />
        <h6 className="text-muted">Loading courses...</h6>
      </div>
    );
  }

  return (
    <Row className="g-4">
      {filteredCourses.map((course) => {
        const priceInfo = formatPrice(course);
        const thumbnailUrl = getFullThumbnailUrl(course.thumbnail);
        
        return (
          <Col sm={6} lg={6} xl={4} key={course.id}>
            <Card className={`h-100 course-card ${course.is_featured ? 'featured' : ''} status-${course.visibility_status || 'draft'}`}>
              {/* Thumbnail Section */}
              <div className="position-relative">
                <Link to={`/admin/edit-course/${course.id}`} className="text-decoration-none">
                  <div
                    className="card-img-top"
                    style={{
                      height: '200px',
                      backgroundImage: `url(${thumbnailUrl})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundColor: '#f8f9fa',
                      cursor: 'pointer'
                    }}
                    onError={(e) => {
                      // Fallback to default image
                      e.target.style.backgroundImage = `url(/assets/default-course-thumbnail.jpg)`;
                    }}
                  />
                </Link>
                
                {/* Status Badge */}
                <Badge
                  bg={getStatusBadgeVariant(course.visibility_status)}
                  className="position-absolute top-0 start-0 m-2"
                >
                  {course.visibility_status || 'draft'}
                </Badge>

                {/* Featured Badge */}
                {course.is_featured && (
                  <Badge 
                    bg="warning" 
                    className="position-absolute top-0 start-50 translate-middle-x m-2"
                  >
                    Featured
                  </Badge>
                )}
                
                {/* Actions Dropdown */}
                <div className="position-absolute top-0 end-0 m-2">
                  <Dropdown align="end">
                    <Dropdown.Toggle 
                      variant="light" 
                      size="sm" 
                      className="border-0 shadow-sm"
                      id={`dropdown-${course.id}`}
                    >
                      <FaEllipsisV />
                    </Dropdown.Toggle>
                    
                    <Dropdown.Menu>
                      <Dropdown.Item onClick={(e) => handleEditCourse(course.id, e)}>
                        <FaEdit className="me-2" />
                        Edit Course
                      </Dropdown.Item>
                      <Dropdown.Item onClick={(e) => handleViewCourse(course.id, e)}>
                        <FaEye className="me-2" />
                        Preview
                      </Dropdown.Item>
                      <Dropdown.Divider />
                      <Dropdown.Item 
                        className="text-danger"
                        onClick={(e) => handleDeleteCourse(course.id, e)}
                      >
                        <FaTrash className="me-2" />
                        Delete
                      </Dropdown.Item>
                    </Dropdown.Menu>
                  </Dropdown>
                </div>
              </div>

              {/* Card Body */}
              <Card.Body className="p-3 d-flex flex-column">
                {/* Category Badge */}
                <Badge
                  bg="light"
                  className="text-dark category-badge px-2 py-1 rounded-pill fw-normal mb-2 align-self-start"
                >
                  {course.tags && Array.isArray(course.tags) && course.tags.length > 0 
                    ? course.tags[0] 
                    : course.category || 'General'
                  }
                </Badge>

                {/* Title */}
                <Link to={`/admin/edit-course/${course.id}`} className="text-decoration-none">
                  <h5 className="card-title mb-2 text-dark hover-text-primary">
                    {course.title || 'Untitled Course'}
                  </h5>
                </Link>

                {/* Description */}
                <p className="card-text text-muted small mb-3 flex-grow-1" style={{
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical'
                }}>
                  {course.short_description || course.full_description || 'No description available'}
                </p>

                {/* Price and Rating */}
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <div className="price-section">
                    {priceInfo.isFree ? (
                      <h4 className="mb-0 fw-bold price-free">{priceInfo.display}</h4>
                    ) : priceInfo.hasDiscount ? (
                      <div>
                        <h4 className="mb-0 fw-bold price-discounted">{priceInfo.display}</h4>
                        <small className="text-muted text-decoration-line-through original-price">
                          {priceInfo.originalPrice}
                        </small>
                      </div>
                    ) : (
                      <h4 className="mb-0 fw-bold price-regular">{priceInfo.display}</h4>
                    )}
                  </div>
                  
                  <div className="rating-section">
                    <FaStar className="text-warning me-1" />
                    <span className="text-warning fw-bold">{course.rating || '4.0'}</span>
                    <span className="text-muted ms-1">({course.review_count || 0})</span>
                  </div>
                </div>

                {/* Course Meta */}
                <div className="d-flex justify-content-between align-items-center small course-meta mb-3">
                  <div className="d-flex align-items-center">
                    <FaClock className="me-1" size={12} />
                    <span>{course.total_duration || '0 hrs'}</span>
                  </div>
                  <div className="d-flex align-items-center">
                    <FaUsers className="me-1" size={12} />
                    <span>{course.enrolled || 0} students</span>
                  </div>
                  <span>{course.level || 'Beginner'}</span>
                </div>

                {/* Additional Status Info */}
                <div className="d-flex justify-content-between align-items-center mt-auto status-badges">
                  <div>
                    <Badge bg={getStatusBadgeVariant(course.review_status)} className="small">
                      {course.review_status || 'pending'}
                    </Badge>
                  </div>
                  <small className="text-muted">
                    {formatDate(course.created_at)}
                  </small>
                </div>
              </Card.Body>
            </Card>
          </Col>
        );
      })}

      {/* Empty State */}
      {filteredCourses.length === 0 && (
        <Col xs={12}>
          <div className="empty-state">
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
              <Button 
                variant="primary" 
                className="mt-3"
                onClick={() => navigate('/admin/edit-course/new')}
              >
                Create Your First Course
              </Button>
            )}
          </div>
        </Col>
      )}
    </Row>
  );
};

export default CourseGrid;