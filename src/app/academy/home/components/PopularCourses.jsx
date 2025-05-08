import GlightBox from '@/components/GlightBox'
import { currency } from '@/context/constants'
import clsx from 'clsx'
import { Button, Card, CardBody, Col, Container, Nav, NavItem, NavLink, Row, TabContainer, TabContent, TabPane } from 'react-bootstrap'
import { BsCart3, BsPatchCheckFill } from 'react-icons/bs'
import { FaPlay, FaRegStar, FaStar, FaStarHalfAlt } from 'react-icons/fa'
import about11 from '@/assets/images/about/11.jpg'
import about12 from '@/assets/images/about/12.jpg'
import about13 from '@/assets/images/about/13.jpg'
import about14 from '@/assets/images/about/14.jpg'
import about15 from '@/assets/images/about/15.jpg'
const CourseVideoCard = ({ showPricing, image }) => {
  const pricingPlans = [
    {
      duration: 6,
      price: 134,
    },
    {
      duration: 12,
      price: 355,
    },
    {
      duration: 18,
      price: 654,
    },
  ]
  return (
    <Card
      className={clsx('p-2 shadow', {
        'pb-0': showPricing,
      })}>
      <div
        className={clsx('overflow-hidden h-xl-200px', {
          'rounded-3': !showPricing,
        })}>
        <img src={image} className="card-img-top" alt="course image" />
        <div className="card-img-overlay d-flex p-3">
          <div className="m-auto">
            <GlightBox
              href="https://www.youtube.com/embed/tXHviS-4ygo"
              className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
              data-glightbox
              data-gallery="course-video">
              <FaPlay />
            </GlightBox>
          </div>
        </div>
      </div>
      {showPricing && (
        <CardBody>
          <Row className="g-3">
            {pricingPlans.map((plan, idx) => (
              <Col sm={4} lg={6} xl={4} key={idx}>
                <div className="d-flex align-items-center">
                  <a href="#" className="btn btn-orange rounded-2 me-3 mb-0">
                    <BsCart3 className="fs-5" />
                  </a>
                  <div>
                    <span className="badge text-bg-info mb-1">{plan.duration} months</span>
                    <h5 className="mb-0">
                      {currency}
                      {plan.price}
                    </h5>
                  </div>
                </div>
              </Col>
            ))}
          </Row>
        </CardBody>
      )}
    </Card>
  )
}
const DesignCourse = () => {
  return (
    <Row>
      <Col xs={12}>
        <Row className="justify-content-between">
          <TabContainer defaultActiveKey="1">
            <Col lg={6}>
              <h3>Test Series</h3>
              <p className="mb-3">
                Perceived end knowledge certainly day sweetness why cordially. Ask a quick six seven offer see among. Handsome met debating sir
                dwelling age material. As style lived he worse dried. Offered related so visitors we private removed.
              </p>
              <Nav as="ul" className="nav-pills nav-pill-dark-soft mb-0" id="course-pills-tab-inner" role="tablist">
                <NavItem className="me-2 me-sm-3" role="presentation">
                  <NavLink as="button" eventKey="1">
                    Test Series
                  </NavLink>
                </NavItem>
                <NavItem className="me-2 me-sm-3" role="presentation">
                  <NavLink as="button" eventKey="2">
                    Graphic Design
                  </NavLink>
                </NavItem>
                <NavItem className="me-2 me-sm-3" role="presentation">
                  <NavLink as="button" eventKey="3">
                    Web Design
                  </NavLink>
                </NavItem>
              </Nav>
              <div className="d-flex align-items-center mb-3">
                <h2 className="me-3 mb-0">4.5</h2>
                <div>
                  <ul className="list-inline mb-0">
                    {Array(Math.floor(4.5))
                      .fill(0)
                      .map((_star, idx) => (
                        <li key={idx} className="list-inline-item me-1 small">
                          <FaStar size={14} className="text-warning" />
                        </li>
                      ))}
                    {!Number.isInteger(4.5) && (
                      <li className="list-inline-item me-1 small">
                        <FaStarHalfAlt size={14} className="text-warning" />
                      </li>
                    )}
                    {4.5 < 5 &&
                      Array(5 - Math.ceil(4.5))
                        .fill(0)
                        .map((_star, idx) => (
                          <li key={idx} className="list-inline-item me-1 small">
                            <FaRegStar size={14} className="text-warning" />
                          </li>
                        ))}
                  </ul>
                  <p className="mb-0">Review from our students</p>
                </div>
              </div>
            </Col>
            <Col lg={6} className="position-relative">
              <figure className="position-absolute top-0 start-100 translate-middle z-index-1 mt-5 pt-5 ms-3 d-none d-md-block">
                <svg>
                  <path
                    className="fill-primary"
                    d="m105.32 16.607c-3.262 5.822-12.294 0.748-9.037-5.064 3.262-5.821 12.294-0.747 9.037 5.064zm-6.865 21.74c-5.481 9.779-20.654 1.255-15.182-8.509 5.48-9.779 20.653-1.255 15.182 8.509zm-36.466-11.481c6.134-10.943 23.113-1.404 16.99 9.522-6.133 10.943-23.113 1.404-16.99-9.522zm5.08-24.019c3.002-5.355 11.311-0.687 8.314 4.66-3.001 5.355-11.31 0.687-8.314-4.66zm-4.357 58.171c6.507-0.155 10.785 7.113 7.628 12.746-3.156 5.634-11.589 5.779-14.853 0.148-0.108-0.186-0.215-0.371-0.322-0.556-3.091-5.332 0.744-12.175 6.905-12.322 0.214-5e-3 0.428-0.011 0.642-0.016zm-14.997-8.34c-2.57 0.843-5.367 0.264-7.715-0.917-2.262-1.137-4.134-3.706-4.81-6.102-0.706-2.505-0.358-5.443 0.914-7.712 1.344-2.399 3.54-3.965 6.101-4.806 2.571-0.843 5.368-0.263 7.715 0.917 2.262 1.138 4.134 3.706 4.81 6.102 0.706 2.506 0.358 5.444-0.913 7.713-1.345 2.398-3.541 3.965-6.102 4.805zm-4.824-41.632c3.915-6.985 14.753-0.896 10.845 6.078-3.915 6.985-14.753 0.896-10.845-6.078zm-11.502 89.749c-1.138 1.37-3.658 2.357-5.408 2.314-1.387-0.035-2.719-0.374-3.958-0.997-1.529-0.769-2.655-2.243-3.307-3.773-0.615-1.445-0.989-3.345-0.459-4.903 0.039-0.113 0.077-0.227 0.116-0.341 0.929-2.724 2.63-4.878 5.509-5.688 1.943-0.547 4.222-0.276 5.984 0.711 1.861 1.043 3.077 2.746 3.729 4.732 0.922 2.805-0.2 5.531-1.976 7.668-0.077 0.093-0.153 0.185-0.23 0.277zm-7.657-31.402c2.806-5.006 10.573-0.642 7.772 4.356-2.806 5.006-10.573 0.642-7.772-4.356zm-3.281-18.47c3.262-5.821 12.294-0.747 9.037 5.065-3.262 5.821-12.294 0.747-9.037-5.065zm-4.63-25.623c3.849-6.869 14.506-0.881 10.663 5.976-3.849 6.869-14.507 0.882-10.663-5.976zm-0.416 16.398c-3.785 6.753-14.261 0.867-10.483-5.874 3.784-6.753 14.261-0.867 10.483 5.874zm-6.41 13.04c-2.871 5.122-10.819 0.657-7.953-4.457 2.871-5.123 10.819-0.658 7.953 4.457zm3.665 16.114c2.701 1.359 3.576 5.061 2.147 7.612-1.533 2.735-4.903 3.506-7.613 2.143-2.702-1.359-3.577-5.061-2.147-7.612 1.532-2.735 4.903-3.506 7.613-2.143zm6.319 39.375c-2.936 5.239-11.064 0.673-8.133-4.558 2.936-5.239 11.064-0.672 8.133 4.558zm30.789-17.287c-3.98 7.101-14.998 0.911-11.025-6.179 3.98-7.102 14.998-0.912 11.025 6.179zm7.01 23.118c-5.807 10.362-21.883 1.33-16.086-9.015 5.807-10.361 21.884-1.329 16.086 9.015z"
                    fill="#f00"
                    fillRule="evenodd"
                  />
                </svg>
              </figure>
              <TabContent className="mb-0 pb-0" id="course-pills-tabContent1">
                <TabPane eventKey="1" className="fade" id="course-pills-tab01" role="tabpanel" aria-labelledby="course-pills-tab-01">
                  <CourseVideoCard image={about13} showPricing />
                </TabPane>
                <TabPane eventKey="2" className="fade" id="course-pills-tab02" role="tabpanel" aria-labelledby="course-pills-tab-02">
                  <CourseVideoCard image={about11} showPricing />
                </TabPane>
                <TabPane eventKey="3" className="fade" id="course-pills-tab03" role="tabpanel" aria-labelledby="course-pills-tab-03">
                  <Card className="p-2 shadow">
                    <div className="overflow-hidden h-xl-200px">
                      <img src={about14} className="card-img-top" alt="course image" />
                      <div className="card-img-overlay d-flex p-3">
                        <div className="m-auto">
                          <GlightBox
                            href="https://www.youtube.com/embed/tXHviS-4ygo"
                            className="btn btn-lg text-danger btn-round btn-white-shadow mb-0"
                            data-glightbox
                            data-gallery="course-video">
                            <FaPlay />
                          </GlightBox>
                        </div>
                      </div>
                    </div>
                    <CardBody className="px-2">
                      <p className="mb-0">
                        <span className="h6 mb-0 fw-bold me-1">Note:</span>Before you learning this video you need to first learn Beginner course
                      </p>
                    </CardBody>
                  </Card>
                </TabPane>
              </TabContent>
            </Col>
          </TabContainer>
        </Row>
      </Col>
    </Row>
  )
}


const Development = () => {
  const features = [
    'Create responsive, accessible, and beautiful layouts',
    'Course Videos & Readings',
    'Manipulate the DOM with vanilla JS',
    'Master the command line interface',
    'Create your own Node modules',
  ]
  return (
    <Row className="row">
      <Col lg={6}>
        <h3>Development</h3>
        <p className="mb-3">
          Ask a quick six seven offer see among. Handsome met debating sir dwelling age material. As style lived he worse dried. Offered related so
          visitors we private removed.
        </p>
        <h6 className="mt-4">What you’ll learn</h6>
        <ul className="list-group list-group-borderless mb-3">
          {features.map((feature, idx) => (
            <li className="list-group-item h6 fw-light d-flex mb-0" key={idx}>
              <BsPatchCheckFill className="text-success me-2" />
              {feature}
            </li>
          ))}
        </ul>
      </Col>
      <Col lg={6}>
        <CourseVideoCard image={about14} showPricing={false} />
      </Col>
    </Row>
  )
}



const PopularCourse = ({ title, image, description }) => {
  return (
    <Row className="g-4">
      <Col lg={6}>
        <h3>{title}</h3>
        <p className="mb-3">
          {description}
        </p>
        <div className="d-flex align-items-center mb-3">
          <h2 className="me-3 mb-0">4.0</h2>
          <div>
            <ul className="list-inline mb-0">
              {Array(Math.floor(4))
                .fill(0)
                .map((_star, idx) => (
                  <li key={idx} className="list-inline-item me-1 small">
                    <FaStar size={14} className="text-warning" />
                  </li>
                ))}
              {!Number.isInteger(4) && (
                <li className="list-inline-item me-1 small">
                  <FaStarHalfAlt size={14} className="text-warning" />
                </li>
              )}
              {4 < 5 &&
                Array(5 - Math.ceil(4))
                  .fill(0)
                  .map((_star, idx) => (
                    <li key={idx} className="list-inline-item me-1 small">
                      <FaRegStar size={14} className="text-warning" />
                    </li>
                  ))}
            </ul>
            <p className="mb-0">Review from our students </p>
          </div>
        </div>
        <div className="mt-3">
          <Button className='bg-theme-secondary border-0' href='/pages/course/detail-adv'>Buy course</Button>
        </div>
      </Col>
      <Col lg={6}>
        <CourseVideoCard image={image} showPricing={false} />
      </Col>
    </Row>
  )
}
const PopularCourses = () => {
  return (
    <section className="bg-light position-relative overflow-hidden">
      <Container className="position-relative">
        <Row className="mb-4">
          <Col xs={12}>
            <h2 className="fs-1 fw-bold">
              <span className="position-relative z-index-9">Most Popular</span>&nbsp;
              <span className="position-relative z-index-1">
                Courses
              </span>
            </h2>
            <p className="mb-0">See what course other students and experts in your domain are learning on.</p>
          </Col>
        </Row>
        <TabContainer defaultActiveKey="design">
          <Nav as="ul" className="custom-nav-pills mb-3" id="course-pills-tab" role="tablist">
            <NavItem className="custom-nav-item me-sm-5" role="presentation">
              <NavLink eventKey="design" as="button" className="custom-nav-link">
                Test Series
              </NavLink>
            </NavItem>
            <NavItem className="custom-nav-item me-sm-5" role="presentation">
              <NavLink eventKey="development" as="button" className="custom-nav-link">
                TNPSC
              </NavLink>
            </NavItem>
            <NavItem className="custom-nav-item me-sm-5" role="presentation">
              <NavLink eventKey="data-science" as="button" className="custom-nav-link">
                UPSC - CSE
              </NavLink>
            </NavItem>
            <NavItem className="custom-nav-item me-sm-5" role="presentation">
              <NavLink eventKey="marketing" as="button" className="custom-nav-link">
                Bank Exam
              </NavLink>
            </NavItem>
            <NavItem className="custom-nav-item me-sm-5" role="presentation">
              <NavLink eventKey="finance" as="button" className="custom-nav-link">
                Railway Exams
              </NavLink>
            </NavItem>
          </Nav>
          <TabContent className="mb-0" id="course-pills-tabContent">
            <TabPane className="fade" eventKey="design">
            <PopularCourse title="Test Series" description="lorem ipsum dolor sit amet" image={about15} />
            </TabPane>
            <TabPane className="fade" eventKey="development">
            <PopularCourse title="TNPSC" description="lorem ipsum dolor sit amet" image={about15} />
            </TabPane>
            <TabPane className="fade" eventKey="data-science">
              <PopularCourse title="UPSC - CSE" description="lorem ipsum dolor sit amet" image={about15} />
            </TabPane>
            <TabPane className="fade" eventKey="marketing">
              <PopularCourse title="Bank Exam" description="lorem ipsum dolor sit amet" image={about12} />
            </TabPane>
            <TabPane className="fade" eventKey="finance">
              <PopularCourse title="Railways Exam" description="lorem ipsum dolor sit amet" image={about11} />
            </TabPane>
          </TabContent>
        </TabContainer>
      </Container>
    </section>
  )
}
export default PopularCourses
