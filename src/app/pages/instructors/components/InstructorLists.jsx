import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { fetchInstructors } from '@/helpers/instructorApi';
import './InstructorLists.css';

const InstructorCard = ({ instructor }) => {
  const { avatar, name, bio } = instructor;

  return (
    <Card className="instructor-card shadow h-100 border-0 position-relative overflow-hidden">
      <div className="instructor-img-wrapper">
        <img
          src={avatar || '/default-avatar.png'}
          alt={name}
          className="instructor-img"
        />
        <div className="instructor-hover-overlay d-flex flex-column align-items-center justify-content-start">
          <div className="instructor-name text-center px-3 pt-3 w-100">{name}</div>
          {bio && (
            <div className="instructor-bio text-center px-3 pb-3">{bio}</div>
          )}
        </div>
      </div>
      <Card.Body className="text-center">
        <h5 className="card-title mb-1">{name}</h5>
      </Card.Body>
    </Card>
  );
};


const InstructorLists = () => {
  const [instructors, setInstructors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchInstructors()
      .then(data => {
        setInstructors(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Container className="py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </Container>
    );
  }

  if (!instructors.length) {
    return (
      <Container className="py-5 text-center">
        <p>No instructors found.</p>
      </Container>
    );
  }

  return (
    <section className="py-5">
      <Container>
        <Row className="g-4">
          {instructors.map(instructor => (
            <Col xs={12} sm={6} md={4} lg={3} key={instructor.id}>
              <InstructorCard instructor={instructor} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default InstructorLists;
