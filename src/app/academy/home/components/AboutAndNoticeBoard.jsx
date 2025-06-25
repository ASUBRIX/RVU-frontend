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
            <h3 className="mb-3">Welcome to Royal Victorian University</h3>
            <p>
              Royal Victorian University is a prestigious institution in Yeghegnadzor, Armenia, offering bachelor’s and master’s degree programs, including German language courses. Our dedicated faculty ensures a high-quality education in diverse fields such as business, engineering, arts, sciences, and technology.

We prioritize student success and provide state-of-the-art facilities for academic growth and research. With a multicultural and inclusive community, we welcome students from diverse backgrounds. International collaborations and exchange programs enhance global perspectives. Join us at Royal Victorian University for a transformative educational journey, equipping you with the tools, knowledge, and opportunities to excel in your chosen field and unlock your full potential.
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
              <div className="notice-board-container">
                {notices.length > 0 ? (
                  <div className="notice-ticker">
                    <div className="notice-content">
                      {notices.map((notice) => (
                        <div key={notice.id} className="notice-item">
                          <div className="notice-first-line">
                            <BsFillPinFill className="text-primary pin-icon" />
                            <small className="notice-date">
                              {new Date(notice.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="notice-heading">
                            <strong>{notice.title}</strong>
                          </div>
                          {notice.content && (
                            <div className="notice-description">
                              {notice.content}
                            </div>
                          )}
                        </div>
                      ))}
                      {/* Duplicate notices for seamless loop */}
                      {notices.map((notice) => (
                        <div key={`duplicate-${notice.id}`} className="notice-item">
                          <div className="notice-first-line">
                            <BsFillPinFill className="text-primary pin-icon" />
                            <small className="notice-date">
                              {new Date(notice.created_at).toLocaleDateString()}
                            </small>
                          </div>
                          <div className="notice-heading">
                            <strong>{notice.title}</strong>
                          </div>
                          {notice.content && (
                            <div className="notice-description">
                              {notice.content}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
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