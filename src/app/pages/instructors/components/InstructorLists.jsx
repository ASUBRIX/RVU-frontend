import React, { useEffect, useState } from 'react';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { fetchInstructors } from '@/helpers/instructorApi';
import './InstructorLists.css';

const InstructorCard = ({ instructor }) => {
  const { avatar, name, bio, designation } = instructor;

  return (
    <Card className="instructor-card shadow h-100 border-0 position-relative overflow-hidden">
      <div className="instructor-img-wrapper">
        <img
          src={avatar || '/default-avatar.png'}
          alt={name}
          className="instructor-img"
        />
        <div className="instructor-hover-overlay">
          <div className="instructor-designation" style={{ position: 'absolute', top: '50%', left: '16px', right: '16px', transform: 'translateY(-50%)' }}>
            {designation || 'Faculty Member'}
          </div>
          {bio && (
            <div className="instructor-bio" style={{ position: 'absolute', bottom: '16px', left: '16px', right: '16px' }}>
              {bio}
            </div>
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
  const [faculties, setFaculties] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
   fetchInstructors().then(data => {
  console.log('API RAW:', data);
  setFaculties(data || []);
  setLoading(false);
});

  }, []);

const boardMembers = faculties.filter(f => f.board_member === true || f.board_member === 't' || f.board_member === 'true');
console.log('board of members:',boardMembers);

const facultyMembers = faculties.filter(f => !f.board_member || f.board_member === 'f' || f.board_member === 'false');
console.log('faculty members:',facultyMembers);

  return (
    <>
      {/* Board of Directors */}
      <section className="py-5 bg-white board-section">
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
          ) : boardMembers.length === 0 ? (
            <div className="py-5 text-center">
              <p>No board members found.</p>
            </div>
          ) : (
            <Row className="g-4 justify-content-center">
              {boardMembers.map(member => (
                <Col xs={12} sm={6} md={4} lg={3} key={member.id}>
                  <InstructorCard instructor={member} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>

      {/* Faculty Members */}
      <section className="py-5 bg-white board-section">
        <Container>
          <div className="board-title-wrap">
            <h2 className="board-title">Faculty & Team Members</h2>
          </div>
          {loading ? (
            <div className="py-5 text-center">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : facultyMembers.length === 0 ? (
            <div className="py-5 text-center">
              <p>No faculty members found.</p>
            </div>
          ) : (
            <Row className="g-4 justify-content-center">
              {facultyMembers.map(member => (
                <Col xs={12} sm={6} md={4} lg={3} key={member.id}>
                  <InstructorCard instructor={member} />
                </Col>
              ))}
            </Row>
          )}
        </Container>
      </section>
    </>
  );
};

export default InstructorLists;