import { coursesData } from '@/assets/data/products';
import { Card, Col, Row } from 'react-bootstrap';
import CountUp from 'react-countup';
import { FaGraduationCap, FaUsers, FaUserGraduate } from 'react-icons/fa';
import { BsCurrencyDollar } from 'react-icons/bs';

// Calculate metrics from coursesData
const calculateMetrics = () => {
  const totalRevenue = coursesData.reduce((acc, course) => acc + (course.price * course.enrolled), 0);
  const totalCourses = coursesData.length;
  const totalStudents = coursesData.reduce((acc, course) => acc + course.enrolled, 0);
  const activeStudents = Math.round(totalStudents * 0.75); // Assuming 75% are active

  return [
    {
      count: totalRevenue,
      title: 'Total Revenue',
      icon: BsCurrencyDollar,
      prefix: '₹',
      variant: 'success'
    },
    {
      count: totalCourses,
      title: 'Total Courses',
      icon: FaGraduationCap,
      variant: 'primary'
    },
    {
      count: totalStudents,
      title: 'Total Students',
      icon: FaUsers,
      variant: 'warning'
    },
    {
      count: activeStudents,
      title: 'Active Students',
      icon: FaUserGraduate,
      variant: 'info'
    }
  ];
};

const CounterCard = ({
  count,
  title,
  icon: Icon,
  prefix,
  suffix,
  variant
}) => {
  return (
    <Card className={`card-body bg-${variant} bg-opacity-10 p-4 h-100`}>
      <div className="d-flex justify-content-between align-items-center">
        <div className="pe-4" style={{ minWidth: 0 }}>
          <h2 className="purecounter mb-0 fw-bold" style={{ fontSize: prefix === '$' ? '1.75rem' : '2rem' }}>
            <CountUp 
              end={count} 
              prefix={prefix}
              suffix={suffix} 
              delay={1}
              separator=","
              decimals={prefix === '$' ? 2 : 0}
              formattingFn={prefix === '$' ? 
                (value) => `$${(value / 1000000).toFixed(2)}M` : 
                undefined}
            />
          </h2>
          <span className="mb-0 h6 fw-light">{title}</span>
        </div>
        <div className={`icon-lg rounded-circle bg-${variant} text-white mb-0 flex-shrink-0`}>
          {Icon && <Icon />}
        </div>
      </div>
    </Card>
  );
};

const Counter = () => {
  const counterData = calculateMetrics();
  
  return (
    <Row className="g-4 mb-4 px-4">
      {counterData.map((item, idx) => (
        <Col md={6} xxl={3} key={idx}>
          <CounterCard {...item} />
        </Col>
      ))}
    </Row>
  );
};

export default Counter;
