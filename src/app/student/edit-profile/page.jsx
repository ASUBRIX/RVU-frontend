import PageMetaData from '@/components/PageMetaData'
import { Container, Row, Col } from 'react-bootstrap'
import EditProfile from './components/EditProfile'

const EditProfilePage = () => (
  <>
    <PageMetaData title="Edit Profile" />
    <section className="py-4" style={{ background: '#f8fafc', minHeight: '100vh' }}>
      <Container>
        <Row className="justify-content-center mb-4">
          <Col lg={8} md={10}>
            <EditProfile />
          </Col>
        </Row>
      </Container>
    </section>
  </>
)

export default EditProfilePage
