import React from 'react'
import { Accordion, AccordionBody, AccordionHeader, AccordionItem, Col, Container, Row } from 'react-bootstrap'
import { questionsData } from '../data'
import { Link } from 'react-router-dom'

const FaqContent = () => {
  // Accordion item component
  const QuestionsCard = ({ description, id, title }) => {
    return (
      <AccordionItem eventKey={id} className="mb-3">
        <AccordionHeader className="accordion-header font-base" id={`heading-${id}`}>
          <div className="fw-bold">{title}</div>
        </AccordionHeader>
        <AccordionBody className="accordion-body mt-3">{description}</AccordionBody>
      </AccordionItem>
    )
  }

  return (
    <section className="pt-5 pb-0 pb-lg-5">
      <Container>
        <Row className="g-4 g-md-5">
          <Col lg={5}>
            <h3 className="mb-4 fw-bold">Lorem ipsum dolor sit amet consectetur</h3>

            <p className="mb-4">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Dignissimos maxime magnam reiciendis vitae suscipit laudantium quisquam,
              repellendus necessitatibus perferendis debitis tempora alias corrupti praesentium consectetur nemo, animi architecto iure! Soluta. Lorem
              ipsum dolor sit amet consectetur adipisicing elit. Voluptatibus quod consequuntur ex unde in fuga ipsam. Vel voluptatem, asperiores
              ratione ipsa dicta, dolore, ut nobis facere optio odit reprehenderit repudiandae!
            </p>

            <Link to={'/contact-us'} className="btn btn-primary  rounded-pill px-4 py-2 d-inline-flex align-items-center">
              Contact Now
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="ms-2">
                <path d="M5 12h14"></path>
                <path d="M12 5l7 7-7 7"></path>
              </svg>
            </Link>
          </Col>

          <Col lg={7}>
            <Accordion className="accordion accordion-icon accordion-bg-light" id="accordionExample2">
              {questionsData.map((item, idx) => (
                <QuestionsCard {...item} key={idx} />
              ))}
            </Accordion>
          </Col>
        </Row>
      </Container>
    </section>
  )
}

export default FaqContent
