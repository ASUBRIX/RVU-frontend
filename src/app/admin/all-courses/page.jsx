// === Updated AllCourses.jsx ===
import PageMetaData from '@/components/PageMetaData';
import { Container } from 'react-bootstrap';
import CourseGrid from './components/CourseGrid';
import CourseFilters from './components/CourseFilters';
import CourseSearch from './components/CourseSearch';
import CourseSort from './components/CourseSort';
import { useState, useEffect } from 'react';
import { FaPlus } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { getAllCourses } from '../../../helpers/courseApi';

const AllCourses = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [filters, setFilters] = useState({
    category: '',
    subCategory: '',
    status: '',
  });
  const [courses, setCourses] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await getCourses();
        setCourses(res.data);
      } catch (error) {
        console.error('Failed to fetch courses:', error);
      }
    };
    fetchCourses();
  }, []);

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
            </div>
            <Button className="btn-add-content d-flex align-items-center" onClick={() => navigate('/admin/edit-course')}>
              <FaPlus className="me-2" />
              Create New Course
            </Button>
          </div>

          {/* Search and Sort Section - Moved from main content to header */}
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <CourseSearch searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
            </div>

            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                <CourseSort sortBy={sortBy} setSortBy={setSortBy} />
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
                <CourseFilters filters={filters} setFilters={setFilters} />
              </div>
            </div>
          </div>

          {/* Main Content Section */}
          <div className="col-lg-9">
            <div className="card border-0 shadow-sm">
              <div className="card-header bg-white border-bottom py-3">
                <h5 className="mb-0">All Courses</h5>
              </div>

              <div className="card-body p-4">
                <CourseGrid
                  searchQuery={searchQuery}
                  sortBy={sortBy}
                  filters={filters}
                  courses={courses}
                />
              </div>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default AllCourses;

