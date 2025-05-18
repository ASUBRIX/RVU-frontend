import { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import CourseEarning from './Components/CourseEarning';
import MarketingCourse from './Components/MarketingCourse';
import StudentReview from './Components/StudentReview';
import { getCourseById } from '../../../helpers/courseApi';

const Page = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data);
      } catch (error) {
        console.error('Failed to fetch course details:', error);
      }
    };
    fetchCourse();
  }, [id]);

  return (
    <>
      <Row className="mb-3">
        <Col xs={12} className="d-sm-flex justify-content-between align-items-center">
          <h1 className="h3 mb-2 mb-sm-0">Course Details</h1>
          <Link to={`/admin/edit-course/${id}`} className="btn btn-sm btn-primary mb-0">
            Edit Course
          </Link>
        </Col>
      </Row>
      {course && (
        <Row className="g-4">
          <MarketingCourse course={course} />
          <CourseEarning courseId={id} />
          <StudentReview courseId={id} />
        </Row>
      )}
    </>
  );
};

export default Page;

