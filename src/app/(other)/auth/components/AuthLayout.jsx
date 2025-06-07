// AuthLayout.jsx
import avatar1 from '@/assets/images/avatar/01.jpg';
import avatar2 from '@/assets/images/avatar/02.jpg';
import avatar3 from '@/assets/images/avatar/03.jpg';
import avatar4 from '@/assets/images/logo.png';
import elementImg from '@/assets/images/logo.png';
import { Col, Container, Row } from 'react-bootstrap';

const AuthLayout = ({ children }) => {
  return (
    <main>
      <section className="p-0 m-0 d-flex align-items-center position-relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <Container fluid className="p-0 m-0">
          <Row className="g-0">
            {/* Left side */}
            <Col xs={12} lg={6} className="d-flex flex-column align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100 p-4 text-center">
              <div className="mb-3">
                <h2 className="fw-bold fs-3">Welcome to Pudhuyugam Academy</h2>
                <p className="mb-0 h6 fw-light">Let's learn something new today!</p>
              </div>
              <div className="d-flex justify-content-center align-items-center">
                <img
                  src={elementImg}
                  className="img-fluid"
                  alt="element"
                  style={{ 
                    maxHeight: 200,
                    display: 'block'
                  }}
                />
              </div>
            </Col>
            
            {/* Right side */}
            <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center min-vh-100 p-0 m-0">
              <div
                className="w-100 py-4 m-0"
                style={{
                  maxWidth: 340,
                  margin: '0 auto',
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: 'none',
                }}
              >
                {children}
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};


export default AuthLayout;