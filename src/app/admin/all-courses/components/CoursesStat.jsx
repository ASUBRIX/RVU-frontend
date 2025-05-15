// === Updated CoursesStat.jsx ===
import { useEffect, useState } from 'react';
import { Col, Row, Spinner } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getCourseStats } from '../../../../helpers/courseApi';

const CourseStatCard = ({ count, title, variant }) => {
  return (
    <Col sm={6} lg={4}>
      <div className={`text-center p-4 bg-${variant} bg-opacity-10 border border-primary rounded-3`}>
        <h6>{title}</h6>
        <h2 className={`mb-0 fs-1 text-${variant}`}>{count}</h2>
      </div>
    </Col>
  );
};

const CoursesStat = () => {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getCourseStats();
        setStats(res.data);
      } catch (err) {
        console.error('Failed to fetch course stats', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <>
      <Row className="mb-3">
        <Col xs={12} className="d-sm-flex justify-content-between align-items-center">
          <h1 className="h3 mb-2 mb-sm-0">Courses</h1>
          <Link to="/instructor/create-course" className="btn btn-sm btn-primary mb-0">
            Create a Course
          </Link>
        </Col>
      </Row>
      <Row className="g-4 mb-4">
        {loading ? (
          <div className="text-center py-4 w-100">
            <Spinner animation="border" variant="primary" />
          </div>
        ) : (
          stats.map((item, idx) => <CourseStatCard key={idx} {...item} />)
        )}
      </Row>
    </>
  );
};

export default CoursesStat;
