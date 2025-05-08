import { currency } from '@/context/constants'
import { getAllCourses } from '@/helpers/data'
import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { Card, CardBody, CardTitle, Col, Container, Row, Button } from 'react-bootstrap'
import { FaRegBookmark, FaRegClock, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import { useFetchData } from '@/hooks/useFetchData'
import thumbnailPlaceholder from '@/assets/images/bg/thumbnail-placeholder.webp'

const CourseCard = ({ course }) => {
  const { avatar, studentImage, rating, price, role, courseDuration, title, name, badge, duration } = course
  return (
    <Card className="shadow-hover overflow-hidden bg-transparent border border-2 h-100 d-flex flex-column">
      <div className="position-relative">
        <img
          className="card-img-top"
          src={thumbnailPlaceholder}
          alt="Card image"
          style={{ height: '180px', objectFit: 'cover' }}
        />
        <div className="bg-overlay bg-dark opacity-4" />
        <div className="card-img-overlay d-flex align-items-start flex-column">
          <div className="w-100 mt-auto d-inline-flex"></div>
        </div>
      </div>
      <CardBody className="d-flex flex-column">
        <div className="d-flex justify-content-between mb-3">
          <div className="hstack gap-2">
            <span className="badge bg-light text-dark border border-secondary fw-semibold">LIVE CLASS</span>
            <span className="badge bg-light text-dark border border-secondary fw-semibold">FREE CONTENT</span>
            <span className="badge bg-light text-dark border border-secondary fw-semibold">TESTS</span>
          </div>
        </div>

        <CardTitle className="mb-3">
          <Link to={'/pages/course/detail-adv'}>{title}</Link>
        </CardTitle>

        <div className="text-danger mb-2">
          <span className="me-1">🔥</span>
          <span>Extra 5% coupon discount</span>
        </div>
        <hr />
        <div className="mt-auto">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="text-success mb-0">
              ₹{price}
              <span className="text-muted ms-2 h5">
                <del>₹{price + 100}</del>
              </span>
            </h4>
          </div>
          <Button className="btn btn-primary w-100">Buy Now</Button>
        </div>
      </CardBody>
    </Card>
  )
}

const FeaturedCourses = () => {
  const trendingCourses = useFetchData(getAllCourses)
  return (
    <section className="pt-0 pt-lg-5">
      <Container>
        <Row className="mb-4">
          <Col xs={6}>
            <h2 className="mb-0">Featured Courses</h2>
            <p className="text-muted">Find courses that are best for your profession</p>
          </Col>
          <Col xs={6} className="text-end">
            <Link to="/pages/course/grid-2" className="btn">
              View all
            </Link>
          </Col>
        </Row>
        <Row className="g-4">
          {trendingCourses?.slice(0, 3).map((course, idx) => (
            <Col sm={12} md={4} key={idx}>
              <CourseCard course={course} />
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  )
}

export default FeaturedCourses