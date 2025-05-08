import event11 from '@/assets/images/event/11.jpg'
import event12 from '@/assets/images/event/12.jpg'
import event13 from '@/assets/images/event/13.jpg'
import event14 from '@/assets/images/event/14.jpg'
import event15 from '@/assets/images/event/15.jpg'
import event16 from '@/assets/images/event/16.jpg'
import event17 from '@/assets/images/event/17.jpg'
import GlightBox from '@/components/GlightBox'
import { Card, Col, Container, Row } from 'react-bootstrap'
import { BsFullscreen } from 'react-icons/bs'
import { FaPlay } from 'react-icons/fa'
const Gallery = () => {
  return (
    <section className="pt-0 pt-md-5">
      <Container>
        <Row className="mb-3 mb-sm-4">
          <Col xs={12} className="mx-auto text-center">
            <h2 className="fs-1 fw-bold">
              <span className="position-relative z-index-9">Our Best</span>&nbsp;
              <span className="position-relative z-index-1">Moments</span>
            </h2>
          </Col>
        </Row>
        <Row className="g-4">
          <Col lg={4}>
            <Row className="g-4">
              <Col md={6}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event11} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event11}>
                    <BsFullscreen
                      size={30}
                      className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                    />
                  </GlightBox>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event12} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event12}>
                    <BsFullscreen
                      size={30}
                      className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                    />
                  </GlightBox>
                </Card>
              </Col>
              <Col xs={12}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event14} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event14}>
                    <BsFullscreen
                      size={30}
                      className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                    />
                  </GlightBox>
                </Card>
              </Col>
            </Row>
          </Col>
          <Col lg={4}>
            <Card className="overflow-hidden">
              <div className="card-overlay-hover">
                <img src={event17} className="rounded-3" alt="course image" />
              </div>
              <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event17}>
                <BsFullscreen size={30} className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1" />
              </GlightBox>
            </Card>
          </Col>
          <Col lg={4}>
            <Row className="g-4">
              <Col xs={12}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event16} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox
                    className="card-element-hover position-absolute w-100 h-100"
                    data-glightbox
                    data-gallery="gallery"
                    href="https://www.youtube.com/embed/tXHviS-4ygo">
                    <span className="btn text-danger btn-round btn-white-shadow mb-0 position-absolute top-50 start-50 translate-middle">
                      <FaPlay />
                    </span>
                  </GlightBox>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event13} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event13}>
                    <BsFullscreen
                      size={30}
                      className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                    />
                  </GlightBox>
                </Card>
              </Col>
              <Col md={6}>
                <Card className="overflow-hidden">
                  <div className="card-overlay-hover">
                    <img src={event15} className="rounded-3" alt="course image" />
                  </div>
                  <GlightBox className="card-element-hover position-absolute w-100 h-100" data-glightbox data-gallery="gallery" href={event15}>
                    <BsFullscreen
                      size={30}
                      className="fs-6 text-white position-absolute top-50 start-50 translate-middle bg-dark rounded-3 p-2 lh-1"
                    />
                  </GlightBox>
                </Card>
              </Col>
            </Row>
          </Col>
        </Row>
      </Container>
    </section>
  )
}
export default Gallery
