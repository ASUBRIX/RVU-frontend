import about5 from '@/assets/images/about/05.png';
import about6 from '@/assets/images/about/06.jpeg';
import { Col, Container, Row } from 'react-bootstrap'

const About = () => {
  return (
    <section className="py-5">
      <Container>
        {/* First Section */}
        <Row className="align-items-stretch mb-5">
          <Col lg={6} className="d-flex align-items-center mb-4 mb-lg-0">
            <div className="text-center w-100">
              <img
                src={about5}
                className="rounded img-fluid shadow object-cover"
                alt="Students learning together"
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </Col>
          <Col lg={6} className="d-flex align-items-center">
            <div className="ps-lg-4">
              <h2 className="mb-4">35,000+ happy students joined with us to achieve their goals</h2>
              <p className="mb-4">
                Pudhuyugam Academy embarked on a resolute mission to deliver top-notch education for a spectrum of competitive examinations. Our academy
                has been on a transformative journey, sculpting the futures of aspirants by providing unparalleled guidance. Our mission extends beyond
                shaping futures; it aims to create opportunities for aspirants, especially those from rural areas, enabling them to flourish and excel
                in their competitive exam endeavors.
              </p>
              <p>
                Pudhuyugam Academy embarked on a resolute mission to deliver top-notch education for a spectrum of competitive examinations. Our academy
                has been on a transformative journey, sculpting the futures of aspirants by providing unparalleled guidance. Our mission extends beyond
                shaping futures; it aims to create opportunities for aspirants, especially those from rural areas, enabling them to flourish and excel
              </p>
            </div>
          </Col>
        </Row>

        {/* Second Section */}
        <Row className="align-items-stretch">
          <Col lg={6} className="order-2 order-lg-1 d-flex align-items-center">
            <div className="pe-lg-4">
              <h2 className="mb-4">Our Vision</h2>
              <p className="mb-4">
                Our vision is to be a beacon of excellence in education, empowering individuals with the knowledge and skills needed to achieve their
                goals. We strive to create a learning environment that fosters innovation, critical thinking, and personal growth.
              </p>

              <h2 className="mb-4">Our Mission</h2>
              <p className="mb-4">
                Our mission is to provide high-quality education and guidance for competitive examinations, ensuring that students—especially those from
                underserved communities—have the resources and mentorship needed to succeed. We are committed to shaping future leaders by instilling
                confidence and academic excellence.
              </p>

              <h2 className="mb-4">Our Values</h2>
              <p>
                We believe in integrity, dedication, and inclusivity. Our core values drive us to maintain high educational standards, promote equal
                learning opportunities, and support students in their journey towards success.
              </p>
            </div>
          </Col>
          <Col lg={6} className="order-1 order-lg-2 d-flex align-items-center mb-4 mb-lg-0">
            <div className="text-center w-100">
              <img
                src={about6}
                className="rounded img-fluid shadow object-cover"
                alt="Our campus environment"
                style={{ height: '400px', width: '100%' }}
              />
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default About