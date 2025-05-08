import { Card, Form, Row, Col } from 'react-bootstrap';
import { useState } from 'react';

const MailConfig = () => {
  const [mailConfig, setMailConfig] = useState({
    mailHost: '',
    mailPort: '',
    mailUsername: '',
    mailPassword: '',
    mailFromName: '',
    mailFromEmail: '',
    mailEncryption: 'SSL'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMailConfig(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission
    console.log(mailConfig);
  };

  return (
    <Card>
      <Card.Header>
        <h4 className="card-title mb-0">Mail Configuration</h4>
      </Card.Header>
      <Card.Body>
        <Form onSubmit={handleSubmit}>
          <Row className="g-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL HOST <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="mailHost"
                  value={mailConfig.mailHost}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL PORT <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="number"
                  name="mailPort"
                  value={mailConfig.mailPort}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL USERNAME <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="mailUsername"
                  value={mailConfig.mailUsername}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL PASSWORD</Form.Label>
                <Form.Control
                  type="password"
                  name="mailPassword"
                  value={mailConfig.mailPassword}
                  onChange={handleChange}
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL FROM NAME <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="text"
                  name="mailFromName"
                  value={mailConfig.mailFromName}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label>MAIL FROM EMAIL <span className="text-danger">*</span></Form.Label>
                <Form.Control
                  type="email"
                  name="mailFromEmail"
                  value={mailConfig.mailFromEmail}
                  onChange={handleChange}
                  required
                />
              </Form.Group>
            </Col>
            <Col md={12}>
              <Form.Group>
                <Form.Label>MAIL ENCRYPTION <span className="text-danger">*</span></Form.Label>
                <div>
                  <Form.Check
                    inline
                    type="radio"
                    name="mailEncryption"
                    label="SSL"
                    value="SSL"
                    checked={mailConfig.mailEncryption === 'SSL'}
                    onChange={handleChange}
                  />
                  <Form.Check
                    inline
                    type="radio"
                    name="mailEncryption"
                    label="TLS"
                    value="TLS"
                    checked={mailConfig.mailEncryption === 'TLS'}
                    onChange={handleChange}
                  />
                </div>
              </Form.Group>
            </Col>
            <Col md={12}>
              <div className="text-end">
                <button type="submit" className="btn btn-primary">Save</button>
              </div>
            </Col>
          </Row>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default MailConfig; 