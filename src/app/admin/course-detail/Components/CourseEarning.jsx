// === Updated CourseEarning.jsx ===
import ReactApexChart from 'react-apexcharts';
import { Card, CardBody, CardHeader, Col, Row } from 'react-bootstrap';
import { BsArrowUp } from 'react-icons/bs';
import { useEffect, useState } from 'react';
import { getCourseEarnings } from '@/api/course';

const CourseEarning = ({ courseId }) => {
  const [earnings, setEarnings] = useState([]);
  const [enrollments, setEnrollments] = useState([]);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const res = await getCourseEarnings(courseId);
        setEarnings(res.data.earnings);
        setEnrollments(res.data.enrollments);
      } catch (err) {
        console.error('Failed to fetch course earnings:', err);
      }
    };

    fetchEarnings();
  }, [courseId]);

  const chartOptions = (color) => ({
    chart: {
      height: 130,
      type: 'area',
      sparkline: { enabled: true },
    },
    dataLabels: { enabled: false },
    stroke: { curve: 'smooth' },
    colors: [color],
    xaxis: {
      type: 'category',
      categories: earnings.map((e) => e.label),
    },
    tooltip: {
      y: { title: { formatter: () => '' } },
      marker: { show: false },
    },
  });

  return (
    <Col xxl={6}>
      <Row className="g-4">
        <Col md={6} xxl={12}>
          <Card className="bg-transparent border overflow-hidden">
            <CardHeader className="bg-light border-bottom">
              <h5 className="card-header-title mb-0">Total course earning</h5>
            </CardHeader>
            <CardBody className="p-0">
              <div className="d-sm-flex justify-content-between p-4">
                <h4 className="text-blue mb-0">₹{earnings.reduce((sum, e) => sum + e.amount, 0).toFixed(2)}</h4>
                <p className="mb-0">
                  <span className="text-success me-1">
                    0.20%
                    <BsArrowUp />
                  </span>
                  vs last Week
                </p>
              </div>
              <ReactApexChart
                height={130}
                series={[{ name: 'Earning', data: earnings.map((e) => e.amount) }]}
                type="area"
                options={chartOptions('#0d6efd')}
              />
            </CardBody>
          </Card>
        </Col>
        <Col md={6} xxl={12}>
          <Card className="bg-transparent border overflow-hidden">
            <CardHeader className="bg-light border-bottom">
              <h5 className="card-header-title mb-0">New Enrollment This Month</h5>
            </CardHeader>
            <CardBody className="p-0">
              <div className="d-sm-flex justify-content-between p-4">
                <h4 className="text-blue mb-0">{enrollments.reduce((sum, e) => sum + e.count, 0)}</h4>
                <p className="mb-0">
                  <span className="text-success me-1">
                    0.35%
                    <BsArrowUp />
                  </span>
                  vs last Week
                </p>
              </div>
              <ReactApexChart
                height={130}
                series={[{ name: 'Enrollments', data: enrollments.map((e) => e.count) }]}
                type="area"
                options={chartOptions('#6f42c1')}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </Col>
  );
};

export default CourseEarning;
