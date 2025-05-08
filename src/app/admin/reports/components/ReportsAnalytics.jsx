import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';
import { FaGraduationCap, FaUsers, FaUserPlus } from 'react-icons/fa';
import { BsCurrencyDollar } from 'react-icons/bs';
import CountUp from 'react-countup';
import PopularCoursesTable from './PopularCoursesTable';
import PaymentReportsTable from './PaymentReportsTable';

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
                (value) => `$${(value / 1000).toFixed(2)}k` : 
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

const ReportsAnalytics = () => {
  const counterData = [
    {
      count: 245,
      title: 'Total Courses',
      icon: FaGraduationCap,
      variant: 'primary'
    },
    {
      count: 1234,
      title: 'Total Students',
      icon: FaUsers,
      variant: 'success'
    },
    {
      count: 24568,
      title: 'Total Revenue',
      icon: BsCurrencyDollar,
      prefix: '$',
      variant: 'warning'
    },
    {
      count: 842,
      title: 'Total Enrollments',
      icon: FaUserPlus,
      variant: 'info'
    }
  ];

  return (
    <div className="reports-analytics">
      <h1 className="h3 mb-3">Reports & Analytics</h1>
      
      <Row className="g-4 mb-4">
        {counterData.map((item, idx) => (
          <Col md={6} xxl={3} key={idx}>
            <CounterCard {...item} />
          </Col>
        ))}
      </Row>
      
      <div className="mt-4">
        <PopularCoursesTable />
      </div>
      
      <div className="mt-4">
        <PaymentReportsTable />
      </div>
    </div>
  );
};

export default ReportsAnalytics; 