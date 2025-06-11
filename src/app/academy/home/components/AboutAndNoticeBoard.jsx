import React, { useEffect, useState } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { BsFillPinFill } from 'react-icons/bs'
import { TfiAnnouncement } from 'react-icons/tfi'
import { Link } from 'react-router-dom'
import './AboutAndNoticeBoard.scss'
import { fetchNoticeBoard } from '@/helpers/homeApi'

const AboutAndNoticeBoard = () => {
  const [notices, setNotices] = useState([])

  useEffect(() => {
    fetchNoticeBoard()
      .then(setNotices)
      .catch(() => setNotices([]))
  }, [])

  return (
    <Container>
      <Row className="py-5">
        <Col lg={7}>
          <div className="p-4 d-flex flex-column">
            <h5>About Us</h5>
            <h3 className="mb-3">Welcome to Pudhuyugam</h3>
            <p>
              Pudhuyugam Academy embarked on a resolute mission – to deliver top-notch education for a spectrum of competitive examinations. Our
              academy has been on a transformative journey, sculpting the futures of aspirants by providing unparalleled guidance. Our mission extends
              beyond shaping futures; it aims to create opportunities for aspirants, especially those from rural areas, enabling them to flourish and
              excel in their competitive exam endeavors.
            </p>
            <p>
              Led by visionary educators, Pudhuyugam Academy is dedicated to shaping the destinies of aspirants, fostering a culture of excellence,
              and cultivating leaders for tomorrow. Our leadership team brings a wealth of experience and a passion for education, ensuring that each
              student is prepared for exams and life's challenges beyond academia.
            </p>
            <div className="mt-2">
              <Link to="/about" className="btn btn-outline-primary">
                More about us
              </Link>
            </div>
          </div>
        </Col>

        <Col lg={5}>
          <div className="notice-board-wrapper">
            <h3 className="notice-head">
              Announcements
              <TfiAnnouncement className="mx-3 text-primary" />
            </h3>
            <div className="notice-board">
              <div className="notice-board-container manual-scroll">
                {notices.length > 0 ? (
                  notices.map((notice) => (
                    <div key={notice.id} className="notice-item">
                      <div className="d-flex align-items-center">
                        <h5 className="text-primary mb-0">
                          <BsFillPinFill />
                        </h5>
                        <p className="mb-0 ms-2">{notice.title}</p>
                      </div>
                      <div className="mt-1 mb-2">
                        <small className="notice-date">
                          {new Date(notice.created_at).toLocaleDateString()}
                        </small>
                      </div>
                      {notice.content && <strong>{notice.content}</strong>}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4">
                    <p className="text-muted mb-0">No announcements to display</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  )
}

export default AboutAndNoticeBoard
