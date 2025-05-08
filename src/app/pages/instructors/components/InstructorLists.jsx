import { getAllInstructors } from '@/helpers/data';
import { useFetchData } from '@/hooks/useFetchData';
import { Card, CardBody, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import Pagination from './Pagination';
import './instructorStyles.css';

const InstructorCard = ({ instructor }) => {
  const { image, name, college, department, rating } = instructor;
  
  return (
    <Card className="shadow h-100">
      <div className="instructor-image-wrapper">
        <img src={image} className="card-img-top instructor-image" alt={name} />
      </div>
      <CardBody className="text-center">
        <h5 className="card-title mb-1">
          <Link to="#" className="text-decoration-none">{name}</Link>
        </h5>
        {/* <p className="text-muted small mb-2">{department}</p> */}
      </CardBody>
    </Card>
  );
};

const InstructorLists = () => {
  const allInstructors = useFetchData(getAllInstructors);
  
  return (
    <section className="py-5">
      <Container>
        <Row className="g-4">
          {allInstructors?.map((instructor, idx) => (
            <Col xs={12} sm={6} lg={4} xl={3} key={idx}>
              <InstructorCard instructor={instructor} />
            </Col>
          ))}
        </Row>
        <div className="mt-5">
          {/* <Pagination /> */}
        </div>
      </Container>
    </section>
  );
};

export default InstructorLists;