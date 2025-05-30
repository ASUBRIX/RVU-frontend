import PageMetaData from '@/components/PageMetaData';
import { Container, Row, Col } from 'react-bootstrap';
import EditProfile from './components/EditProfile';
import EmailChange from './components/EmailChange';
import PasswordChange from './components/PasswordChange';

const EditProfilePage = () => (
  <>
    <PageMetaData title="Edit Profile" />
    <section className="py-4" style={{ background: "#f8fafc", minHeight: "100vh" }}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} md={10}>
            <EditProfile />
            <div className="mt-4">
              <EmailChange />
            </div>
          </Col>
        </Row>
        
        <Container>
          <Row className="justify-content-center">
            <Col lg={6} md={8}>
              <PasswordChange />
            </Col>
          </Row>
        </Container>
      </Container>
    </section>
  </>
);

export default EditProfilePage;
