import { Card, Col, Row, Container } from 'react-bootstrap';
import { renderToString } from 'react-dom/server';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import TinySlider from '@/components/TinySlider';
import backgroundBannerImg from '@/assets/images/bg/banner1.png';
import backgroundBannerImg2 from '@/assets/images/bg/banner2.png';

const HeroSlider = () => {
  const courseSliderSettings = {
    arrowKeys: true,
    gutter: 0,
    mouseDrag: true,
    autoplayButton: false,
    autoplayButtonOutput: false,
    controlsText: [renderToString(<FaChevronLeft size={16} />), renderToString(<FaChevronRight size={16} />)],
    autoplay: false,
    controls: true,
    edgePadding: 0,
    items: 1,
    nav: false,
    loop: true,
    speed: 1000,
    responsive: {
      320: {
        items: 1,
        controls: true
      },
      768: {
        items: 1,
        controls: true
      }
    }
  };

  return (
    <section className="pt-0">
      <Row className="mx-0">
        <Col xs={12} className="p-0">
          <div className="tiny-slider hero-slider arrow-round arrow-blur arrow-hover rounded-0 overflow-hidden">
            <TinySlider settings={courseSliderSettings} className="tiny-slider-inner">
              {/* First Banner */}
              <Card className="overflow-hidden h-500px h-md-600px text-start rounded-0" style={{
                backgroundImage: `url(${backgroundBannerImg})`,
                backgroundPosition: 'center left',
                backgroundSize: 'cover'
              }}>
                <div className="card-img-overlay d-flex align-items-center p-2 p-sm-4">
                  <Container> {/* Added Container only for text */}
                    <Row className="justify-content-start">
                      <Col xs={11} lg={7}>
                        <h1 className="mb-0 text-black display-6">
                          Get new skills <br /> for the&nbsp;
                          <span className="position-relative">digital world</span>
                        </h1>
                        <p className="text-black w-75">
                          Get the right professional certificate program for you. See what course other students and experts in your domain are
                          learning on
                        </p>
                        <a href="#" className="btn mb-0 text-white bg-primary" >
                          Get Started
                        </a>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Card>

              {/* Second Banner */}
              <Card className="overflow-hidden h-500px h-md-600px text-start rounded-0" style={{
                backgroundImage: `url(${backgroundBannerImg2})`,
                backgroundPosition: 'center left',
                backgroundSize: 'cover'
              }}>
                <div className="card-img-overlay d-flex align-items-center p-3 p-sm-4">
                  <Container> {/* Added Container only for text */}
                    <Row className="justify-content-start">
                      <Col xs={11} lg={6}>
                        <h1 className="mb-0 text-black display-6">
                          Get new skills <br /> for the&nbsp;
                          <span className="position-relative">digital world</span>
                        </h1>
                        <p className="text-black w-75">
                          Get the right professional certificate program for you. See what course other students and experts in your domain are
                          learning on
                        </p>
                        <a href="#" className="btn mb-0 text-white bg-primary" >
                          Get Started
                        </a>
                      </Col>
                    </Row>
                  </Container>
                </div>
              </Card>
            </TinySlider>
          </div>
        </Col>
      </Row>
    </section>
  );
};

export default HeroSlider;
