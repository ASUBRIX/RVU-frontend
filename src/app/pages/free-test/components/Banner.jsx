import { Col, Container, Row } from 'react-bootstrap';
const Banner = () => {
  return <section className="py-0">
      <Container>
        <Row>
          <Col xs={12}>
            <div className="bg-dark p-4 text-center rounded-3">
              <h1 className="text-white m-0">Free Tests</h1>
              
            </div>
          </Col>
        </Row>
      </Container>
    </section>;
};
export default Banner;
