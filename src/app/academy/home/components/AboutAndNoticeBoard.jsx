import React, { useEffect, useRef } from 'react'
import { Col, Container, Row } from 'react-bootstrap'
import { BsFillPinFill, BsShieldCheck, BsStopwatch, BsTag } from 'react-icons/bs'
import { TfiAnnouncement } from "react-icons/tfi";
import { Link } from 'react-router-dom'
import './AboutAndNoticeBoard.scss'

const AboutAndNoticeBoard = () => {
  // Empty notices array for now, will be populated from backend in future
  const notices = []
  const marqueeRef = useRef(null)

  useEffect(() => {
    if (marqueeRef.current && notices.length > 0) {
      const originalContent = marqueeRef.current.innerHTML
      marqueeRef.current.innerHTML = originalContent + originalContent

      marqueeRef.current.addEventListener('mouseenter', () => {
        marqueeRef.current.style.animationPlayState = 'paused'
      })

      marqueeRef.current.addEventListener('mouseleave', () => {
        marqueeRef.current.style.animationPlayState = 'running'
      })
    }
  }, [notices])

  return (
    <Container>
      <Row className="py-5">
        <Col lg={7}>
          <div className="p-4 d-flex flex-column">
            <h5>
              {/* <BsShieldCheck className="me-2" /> */}
              About Us
            </h5>
            <h3 className="mb-3">Welcome to pudhuyugam</h3>
            <p>
            Pudhuyugam Academy embarked on a resolute mission – to deliver top-notch education for a spectrum of competitive examinations. Our academy has been on a transformative journey, sculpting the futures of aspirants by providing unparalleled guidance. Our mission extends beyond shaping futures; it aims to create opportunities for aspirants, especially those from rural areas, enabling them to flourish and excel in their competitive exam endeavors.
            </p>
            <p>
            Led by visionary educators, Pudhuyugam Academy is dedicated to shaping the destinies of aspirants, fostering a culture of excellence, and cultivating leaders for tomorrow. Our leadership team brings a wealth of experience and a passion for education, ensuring that each student is prepared for exams and life's challenges beyond academia.
            </p>
            {/* <p>
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Aspernatur illo, temporibus in sunt facere commodi quos ducimus ipsam! Officia
              amet ipsum perspiciatis repellat! Quos possimus dicta, similique dolor rerum laborum!
            </p> */}
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
              Announcements<TfiAnnouncement className='mx-3 text-primary'/>
            </h3>
            <div className="notice-board">
              <div className="notice-board-container">
                {notices.length > 0 ? (
                  <div ref={marqueeRef} className="notice-board-marquee">
                    {notices.map((notice) => (
                      <div key={notice.id} className="notice-item">
                        <div className="d-flex">
                          <h5 className="text-primary">
                            <BsFillPinFill />
                          </h5>
                          <p className="mb-0 mx-1">{notice.text}</p>
                        </div>
                        <div className="d-flex justify-content-between align-items-center mb-2">
                          <span className="notice-date">
                            <small>{notice.date}</small>
                          </span>
                          <span className="notice-tag">
                            <small>
                              <BsTag className="me-1" /> {notice.tag}
                            </small>
                          </span>
                        </div>
                      </div>
                    ))}
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
