import { useState } from 'react';
import { Dropdown, ButtonGroup, Container, Row, Col, FormControl } from 'react-bootstrap';
import { RiArrowDropDownLine } from 'react-icons/ri';
import CourseCard from './CourseCard';
import Pagination from './Pagination';
import { useFetchData } from '@/hooks/useFetchData';
import { getAllCourses } from '@/helpers/data';

const Courses = () => {
  const allCourses = useFetchData(getAllCourses) || [];
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = {
    'TNPSC': ['GROUP 4', 'GROUP 2/2A', 'GENERAL STUDIES', 'GROUP 1', 'GROUP 2', 'ECONOMICS', 'MATHS', 'POLITY', 'UNIT 9', 'UNIT 8', 'HISTORY', 'CIVIL', 'AE', 'INM', 'NCERT'],
    'UPSC - CSE': ['NCERT'],
    'Bank Exam': [],
    'TEST SERIES': [],
    'Railway Exams': []
  };

  return (
    <section className="pt-0">
      <Container>
        {/* Search & Filters */}
        <form className="bg-light border p-4 rounded-3 my-4 z-index-9 position-relative">
          <Row className="g-3 align-items-center">
            <Col xl={3} lg={4} md={6}>
              <FormControl type="search" placeholder="Enter keyword" />
            </Col>
            <Col xl={9} lg={8} md={6}>
              <div className="d-flex flex-wrap gap-3">
                {Object.entries(categories).map(([filter, subcategories]) => (
                  <Dropdown as={ButtonGroup} key={filter}>
                    <Dropdown.Toggle variant="light" className="d-flex align-items-center">
                      {filter} <RiArrowDropDownLine size={22} />
                    </Dropdown.Toggle>
                    <Dropdown.Menu style={filter === 'TNPSC' ? { columnCount: 2, columnGap: '10px', minWidth: '300px' } : {}}>
                      {subcategories.length > 0 ? (
                        subcategories.map((item) => (
                          <Dropdown.Item key={item} onClick={() => setSelectedCategory(item)}>
                            {item}
                          </Dropdown.Item>
                        ))
                      ) : (
                        <Dropdown.Item disabled>No options available</Dropdown.Item>
                      )}
                    </Dropdown.Menu>
                  </Dropdown>
                ))}
              </div>
            </Col>
          </Row>
        </form>

        {/* Course Listings */}
        <Row className="mt-3">
          <Col xs={12}>
            <Row className="g-4">
              {allCourses.length > 0 ? (
                allCourses.slice(0, 12).map((course, idx) => (
                  <Col sm={6} lg={4} xl={3} key={idx}>
                    <CourseCard course={course} />
                  </Col>
                ))
              ) : (
                <p>No courses available.</p>
              )}
            </Row>
            {/* Pagination */}
            <Col xs={12}>
              <Pagination />
            </Col>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Courses;
