import GlightBox from '@/components/GlightBox';
import { Col, Container, Row } from 'react-bootstrap';
import { FaPlay } from 'react-icons/fa';
import bgImg3 from '@/assets/images/bg/03.png';

const Hero = () => {
  return (
    <section
      className="hero-section hero-banner"
      style={{
        backgroundImage: `url(${bgImg3})`,
        backgroundPosition: 'center',
        backgroundSize: 'cover',
      }}
    >
      <div className="bg-overlay bg-dark" />
      <figure className="wave-shape">
        <svg viewBox="0 0 500 150" preserveAspectRatio="none">
          <path d="M0,150 L0,40 Q250,150 500,40 L580,150 Z" />
        </svg>
      </figure>
      <Container className="z-index-9 position-relative">
        <Row className="py-0 py-md-5 align-items-center text-center text-sm-start">
          <Col sm={10} lg={8} xl={6} className="all-text-white my-5 mt-md-0">
            <div className="py-0 py-md-5 my-5">
              <h1 className="text-white display-5">
                Free Test
              </h1>
            </div>
          </Col>
        </Row>
      </Container>
    </section>
  );
};

export default Hero;
