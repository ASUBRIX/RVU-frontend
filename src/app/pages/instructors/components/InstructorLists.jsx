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
        <div className="instructor-hover-overlay d-flex flex-column align-items-center justify-content-center">
          <div className="instructor-name text-center px-3 pt-3 w-100">{name}</div>
          {bio && (
            <div className="instructor-bio text-center px-3 pb-3">{Bio}</div>
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
        console.log('instructors:',data);
        
        setInstructors(data || []);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return (
    <section className="py-5 bg-light board-section">
      <Container>
        <div className="board-title-wrap">
          <h2 className="board-title">Board of Directors</h2>
        </div>
        {loading ? (
          <div className="py-5 text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : instructors.length === 0 ? (
          <div className="py-5 text-center">
            <p>No board members found.</p>
          </div>
        ) : (
          <Row className="g-4 justify-content-center">
            {instructors.slice(0, 4).map(instructor => (
              <Col xs={12} sm={6} md={4} lg={3} key={instructor.id}>
                <InstructorCard instructor={instructor} />
              </Col>
            ))}
          </Row>
        )}
      </Container>
    </section>
  );
};

export default InstructorLists;
