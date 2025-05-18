// === Updated MarketingCourse.jsx ===
import { useEffect, useState } from 'react';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import { FaStar } from 'react-icons/fa';
import { getCourseById } from '@/helpers/courseApi';
import { useParams } from 'react-router-dom';

const MarketingCourse = () => {
  const { id } = useParams();
  const [course, setCourse] = useState(null);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const res = await getCourseById(id);
        setCourse(res.data);
      } catch (err) {
        console.error('Failed to load course data:', err);
      }
    };

    fetchCourse();
  }, [id]);

  if (!course) return null;

  return (
    <Col xxl={6}>
      <Card className="bg-transparent border rounded-3 h-100">
        <CardHeader className="bg-light border-bottom">
          <h5 className="card-header-title">{course.title}</h5>
        </CardHeader>
        <CardBody>
          <Row className="g-4">
            <Col md={6}>
              <img src={course.thumbnail} className="rounded" alt="course thumbnail" />
            </Col>
            <Col md={6}>
              <p className="mb-3">{course.short_description}</p>
              <h5 className="mb-3">₹{course.price}</h5>
              <div className="d-sm-flex align-items-center">
                <div className="avatar avatar-md">
                  <img className="avatar-img rounded-circle" src={course.instructor?.avatar || ''} alt="instructor" />
                </div>
                <div className="ms-sm-3 mt-2 mt-sm-0">
                  <h6 className="mb-0">
                    <a href="#">By {course.instructor?.name}</a>
                  </h6>
                  <p className="mb-0 small">Instructor</p>
                </div>
              </div>
            </Col>
          </Row>
          <Row className="mt-3">
            <Col md={6}>
              <ul className="list-group list-group-borderless">
                <li className="list-group-item">
                  <span>Release date:</span>
                  <span className="h6 mb-0">{new Date(course.created_at).toLocaleDateString()}</span>
                </li>
                <li className="list-group-item">
                  <span>Total Hour:</span>
                  <span className="h6 mb-0">{course.total_duration}</span>
                </li>
                <li className="list-group-item">
                  <span>Total Enrolled:</span>
                  <span className="h6 mb-0">{course.total_enrolled || 0}</span>
                </li>
                <li className="list-group-item">
                  <span>Certificate:</span>
                  <span className="h6 mb-0">Yes</span>
                </li>
              </ul>
            </Col>
            <Col md={6}>
              <ul className="list-group list-group-borderless">
                <li className="list-group-item">
                  <span>Skills:</span>
                  <span className="h6 mb-0">{course.level}</span>
                </li>
                <li className="list-group-item">
                  <span>Total Lecture:</span>
                  <span className="h6 mb-0">{course.total_lectures}</span>
                </li>
                <li className="list-group-item">
                  <span>Language:</span>
                  <span className="h6 mb-0">{course.language}</span>
                </li>
                <li className="list-group-item">
                  <span>Review:</span>
                  <span className="h6 mb-0">
                    {course.rating?.star || 0}
                    <FaStar className="text-warning ms-1" />
                  </span>
                </li>
              </ul>
            </Col>
          </Row>
        </CardBody>
      </Card>
    </Col>
  );
};

export default MarketingCourse;
