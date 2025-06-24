import { useState, useEffect, useCallback, useMemo } from 'react';
import { Container, Alert, Spinner } from 'react-bootstrap';
import { FaPlus, FaExclamationTriangle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import PageMetaData from '@/components/PageMetaData';
import CourseGrid from './components/CourseGrid';
import CourseFilters from './components/CourseFilters';
import CourseSearch from './components/CourseSearch';
import CourseSort from './components/CourseSort';
import { getAllCourses } from '@/helpers/courseApi';

const AllCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    status: '',
  });


  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  
  const fetchCourses = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await getAllCourses();
      setCourses(res.data || []);
    } catch (error) {
      console.error('Failed to fetch courses:', error);
      setError({
        message: error.message || 'Failed to load courses',
      });
    } finally {
      setLoading(false);
    }
  }, []);


  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  
  const handleCreateNewCourse = () => {
    navigate('/admin/edit-course/new');
  };

  // Memoized filtered and sorted courses for performance
  const processedCourses = useMemo(() => {
    let filtered = courses;

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(course => 
        course.title?.toLowerCase().includes(query) ||
        course.short_description?.toLowerCase().includes(query) ||
        course.category?.toLowerCase().includes(query)
      );
    }

    // Apply filters
    if (filters.category) {
      filtered = filtered.filter(course => course.category === filters.category);
    }
    if (filters.subCategory) {
      filtered = filtered.filter(course => course.subcategory === filters.subCategory);
    }
    if (filters.status) {
      filtered = filtered.filter(course => course.visibility_status === filters.status);
    }

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
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
        case 'oldest':
          return new Date(a.created_at || 0) - new Date(b.created_at || 0);
        case 'newest':
        default:
          return new Date(b.created_at || 0) - new Date(a.created_at || 0);
      }
    });

    return sorted;
  }, [courses, searchQuery, filters, sortBy]);

  // Stats for display
  const stats = useMemo(() => ({
    total: courses.length,
    filtered: processedCourses.length,
    published: courses.filter(c => c.visibility_status === 'published').length,
    draft: courses.filter(c => c.visibility_status === 'draft').length,
    pending: courses.filter(c => c.review_status === 'pending').length
  }), [courses, processedCourses]);

  // Error state
  if (error && !loading) {
    return (
      <>
        <PageMetaData title="Manage Courses" />
        <Container fluid>
          <div className="d-flex justify-content-center align-items-center min-vh-75">
            <div className="text-center">
              <div className="mb-4">
                <FaExclamationTriangle size={64} className="text-warning" />
              </div>
              <h4 className="text-muted mb-3">Unable to Load Courses</h4>
              <p className="text-muted mb-4">{error.message}</p>
              <Button 
                variant="outline-secondary" 
                onClick={handleCreateNewCourse}
              >
                <FaPlus className="me-2" />
                Create New Course
              </Button>
            </div>
          </div>
        </Container>
      </>
    );
  }

  return (
    <>
      <PageMetaData title="Manage Courses" />

      {/* Header Section */}
      <div className="bg-light p-4 mb-4">
        <Container fluid>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h3 className="mb-0 fw-bold">Manage Courses</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 mt-2">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-muted">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-dark" aria-current="page">
                    Courses
                  </li>
                </ol>
              </nav>
              
              {/* Stats Display */}
              {!loading && (
                <div className="mt-2">
                  <small className="text-muted">
                    {stats.filtered !== stats.total ? (
                      <>Showing {stats.filtered} of {stats.total} courses</>
                    ) : (
                      <>{stats.total} total courses</>
                    )}
                    {stats.total > 0 && (
                      <> • {stats.published} published • {stats.draft} draft • {stats.pending} pending</>
                    )}
                  </small>
                </div>
              )}
            </div>
            
            <div className="d-flex gap-2 align-items-center">
              <Button 
                className="btn-add-content d-flex align-items-center" 
                onClick={handleCreateNewCourse}
                disabled={loading}
              >
                <FaPlus className="me-2" />
                Create New Course
              </Button>
            </div>
          </div>

          {/* Search and Sort Section */}
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <CourseSearch 
                searchQuery={searchQuery} 
                setSearchQuery={setSearchQuery}
                disabled={loading}
              />
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                <CourseSort 
                  sortBy={sortBy} 
                  setSortBy={setSortBy}
                  disabled={loading}
                />
              </div>
            </div>
          </div>
        </Container>
      </div>

      <Container fluid>
        <div className="row g-4 p-4">
          {/* Filters Section */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-dark bg-opacity-10 border-0">
                <h5 className="mb-0 py-2">Filters</h5>
              </div>
              <div className="card-body">
                <CourseFilters 
                  filters={filters} 
                  setFilters={setFilters}
                  disabled={loading}
                />
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom py-3">
                <div className="d-flex justify-content-between align-items-center">
                  <h5 className="mb-0">All Courses</h5>
                  
                  {loading && (
                    <div className="d-flex align-items-center text-muted">
                      <Spinner size="sm" className="me-2" />
                      <small>Loading courses...</small>
                    </div>
                  )}
                </div>
              </div>

              <div className="card-body p-4">
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" className="mb-3" />
                    <h6 className="text-muted">Loading courses...</h6>
                    <p className="text-muted small">Please wait while we fetch your courses</p>
                  </div>
                ) : (
                  <CourseGrid
                    searchQuery={searchQuery}
                    sortBy={sortBy}
                    filters={filters}
                    courses={processedCourses}
                    onCourseUpdate={fetchCourses}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AllCourses;