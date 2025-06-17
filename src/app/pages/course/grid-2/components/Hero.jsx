import GlightBox from '@/components/GlightBox';
import { Col, Container, Row } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';
import bgImg3 from '@/assets/images/bg/03.png';

const Hero = () => {
  return (
    <section
      className="pt-0 position-relative overflow-hidden h-400px h-sm-300px h-lg-400px"
      style={{
        backgroundImage: `url(${bgImg3})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-overlay bg-dark opacity-5" />
      <figure className="position-absolute bottom-0 left-0 w-100 d-md-block mb-n3 z-index-9">
        <svg className="fill-body" width="100%" height={150} viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,150 L0,40 Q250,150 500,40 L580,150 Z" />
        </svg>
      </figure>
      <Container className="z-index-9 position-relative">
        <Row className="py-0 py-md-5 align-items-center text-center text-sm-start">
          <Col sm={10} lg={8} xl={6} className="all-text-white my-5 mt-md-0">
            <div className="py-0 py-md-5 my-5">
              <h1 className="text-white display-5">
                Courses
              </h1>
              
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
