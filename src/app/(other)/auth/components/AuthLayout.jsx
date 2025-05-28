import avatar1 from '@/assets/images/avatar/01.jpg';
import avatar2 from '@/assets/images/avatar/02.jpg';
import avatar3 from '@/assets/images/avatar/03.jpg';
import avatar4 from '@/assets/images/avatar/04.jpg';
import elementImg from '@/assets/images/element/02.svg';
import { Col, Container, Row } from 'react-bootstrap';

const AuthLayout = ({ children }) => {
  return (
    <main>
      <section className="p-0 d-flex align-items-center position-relative overflow-hidden" style={{ minHeight: '100vh' }}>
        <Container fluid>
          <Row className="g-0">
            {/* Left side: Illustration and Info */}
            <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center bg-primary bg-opacity-10 vh-lg-100">
              <div className="p-3 p-lg-5 w-100">
                <div className="text-center">
                  <h2 className="fw-bold">Welcome to Pudhuyugam Academy</h2>
                  <p className="mb-0 h6 fw-light">Let's learn something new today!</p>
                </div>
                <img src={elementImg} className="mt-5 img-fluid" alt="element" style={{ maxHeight: 220 }} />
                <div className="d-sm-flex mt-5 align-items-center justify-content-center">
                  <ul className="avatar-group mb-2 mb-sm-0">
                    <li className="avatar avatar-sm">
                      <img className="avatar-img rounded-circle" src={avatar1} alt="avatar" />
                    </li>
                    <li className="avatar avatar-sm">
                      <img className="avatar-img rounded-circle" src={avatar2} alt="avatar" />
                    </li>
                    <li className="avatar avatar-sm">
                      <img className="avatar-img rounded-circle" src={avatar3} alt="avatar" />
                    </li>
                    <li className="avatar avatar-sm">
                      <img className="avatar-img rounded-circle" src={avatar4} alt="avatar" />
                    </li>
                  </ul>
                  <p className="mb-0 h6 fw-light ms-0 ms-sm-3">
                    4k+ Students joined us, now it's your turn.
                  </p>
                </div>
              </div>
            </Col>

            {/* Right side: Auth form/content */}
            <Col xs={12} lg={6} className="d-flex align-items-center justify-content-center min-vh-100">
              <div
                className="w-100 py-4"
                style={{
                  maxWidth: 340, // Make form container smaller (was 420)
                  margin: '0 auto',
                  background: 'white',
                  borderRadius: 16,
                  boxShadow: '0 0 24px 0 rgba(0,0,0,0.06)',
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
