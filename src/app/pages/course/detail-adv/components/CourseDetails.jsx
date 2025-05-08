import { Card, CardBody, CardHeader, Col, Container, Row } from 'react-bootstrap'
import { BsPatchExclamationFill } from 'react-icons/bs'
import { FaGlobe, FaSignal, FaStar, FaUserGraduate, FaCheckCircle, FaFolder, FaFilePdf } from 'react-icons/fa'
import { MdOutlineLiveTv } from 'react-icons/md'
import { TfiWrite } from 'react-icons/tfi'
import { RiEmojiStickerLine } from 'react-icons/ri'

import PriceCard from './PriceCard'
// import CourseSlider from './CourseSlider';
import Nav from 'react-bootstrap/Nav'
import { useState } from 'react'
import Curriculum from './Curriculum'
import Materials from './Materials'
import ResourceCarousel from './ResourseCarousel'

const CourseDetails = () => {
  const [activeTab, setActiveTab] = useState('description')

  return (
    <section className="pt-3 pt-xl-5">
      <Container data-sticky-container>
        <Row className="g-4">
          <Col xl={8}>
            <Row className="g-4">
              {/* Course Details top section */}
              <Col xs={12}>
                <h2>UPSC FOUNDATION</h2>
                <p>
                  Lorem ipsum is a dummy or placeholder text commonly used in graphic design, publishing, and web development to fill empty spaces in
                  a layout that does not yet have content.
                </p>
                <ul className="list-inline mb-0">
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0 fw-bold px-2">
                    <MdOutlineLiveTv size={20} className="me-2" color="red" />
                    Live Class
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0 fw-bold px-2">
                    <RiEmojiStickerLine size={20} color="yellow" className="me-2" />
                    Free Content
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0 fw-bold px-2">
                    <TfiWrite size={20} color="orange" className="me-2" />
                    Test's
                  </li>
                  <li className="list-inline-item fw-light h6 me-3 mb-1 mb-sm-0 fw-bold px-2">
                    <FaFilePdf size={20} color="maroon" className="me-2" />
                    PDF
                  </li>
                </ul>
              </Col>
              {/* course slider */}
              <Col xs={12} className="position-relative">
                <ResourceCarousel />
              </Col>
            </Row>
          </Col>
          <Col xl={4}>
            <PriceCard />
          </Col>
        </Row>

        {/* Navigation Tabs */}
        <Nav variant="tabs" className="mt-5" activeKey={activeTab} onSelect={(key) => setActiveTab(key || 'description')}>
          <Nav.Item>
            <Nav.Link eventKey="description">Description</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="videos">Videos</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="materials">Materials</Nav.Link>
          </Nav.Item>
        </Nav>

        {/* Tab Content */}
        <Card className="border rounded-3 mt-4">
          <CardBody>
            {activeTab === 'description' && (
              <>
                <h4>Course Description</h4>
                <ul className="list-unstyled">
                  <li>
                    <FaCheckCircle className="text-success me-2" /> 100+ Interactive Sessions
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> Duration: 1 Year
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> Weekend Classes - 2 Hours/Day
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> Pre-Recorded Videos of NCERT Books
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> 5000+ Practice Questions
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> 10+ Webinars
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> One-Time Course Fee
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> Topper's Study Materials
                  </li>
                  <li>
                    <FaCheckCircle className="text-success me-2" /> 1-1 Mentorships
                  </li>
                </ul>
              </>
            )}
            {activeTab === 'videos' && <Curriculum />}
            {activeTab === 'materials' && <Materials />}
          </CardBody>
        </Card>
      </Container>
    </section>
  )
}

export default CourseDetails
