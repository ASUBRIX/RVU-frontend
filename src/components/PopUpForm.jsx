import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, FloatingLabel, Row, Col } from 'react-bootstrap';
import { FiSend } from 'react-icons/fi';
import { getEnquiryPrefill, submitEnquiry } from '@/helpers/userEnquiryApi';

const ContactForm = ({ show, handleClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    subject: '',
    message: ''
  });

  useEffect(() => {
    const prefillForm = async () => {
      if (show) {
        try {
          const data = await getEnquiryPrefill();
          setFormData(prev => ({
            ...prev,
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || ''
          }));
        } catch (err) {
          console.warn('User not logged in or fetch failed.');
        }
      }
    };

    prefillForm();
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await submitEnquiry(formData);
      console.log('Form submitted successfully');
      handleClose();
    } catch (error) {
      console.error('Error submitting form', error);
    }
  };

  const modalStyle = {
    boxShadow: '0 12px 28px rgba(0, 0, 0, 0.15)'
  };

  const headerStyle = {
    background: '#142841',
    color: 'white',
    padding: '1.5rem'
  };

  const buttonStyle = {
    background: 'primary',
    border: 'none',
    padding: '12px',
    fontWeight: '600',
    boxShadow: '0 4px 12px rgba(110, 142, 251, 0.3)'
  };

  return (
    <Modal
      show={show}
      onHide={handleClose}
      centered
      backdrop="static"
      size="lg"
      contentClassName="border-0"
      dialogClassName="modal-dialog-centered"
    >
      <div style={modalStyle}>
        <div style={headerStyle}>
          <Modal.Header closeButton className="border-0" closeVariant="white">
            <Modal.Title className="fw-bold fs-4 text-center w-100 text-white">Let's Connect</Modal.Title>
          </Modal.Header>
          <p className="mb-0 text-center opacity-75">We'd love to hear from you. Fill out the form below to get started.</p>
        </div>

        <Modal.Body className="p-4">
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6}>
                <FloatingLabel controlId="floatingName" label="Full Name" className="mb-4">
                  <Form.Control
                    type="text"
                    placeholder="Your Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="ps-3"
                    style={{ borderRadius: '8px', height: '58px' }}
                  />
                </FloatingLabel>
              </Col>
              <Col md={6}>
                <FloatingLabel controlId="floatingPhone" label="Phone Number" className="mb-4">
                  <Form.Control
                    type="tel"
                    placeholder="Phone Number"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="ps-3"
                    style={{ borderRadius: '8px', height: '58px' }}
                  />
                </FloatingLabel>
              </Col>
            </Row>

            <FloatingLabel controlId="floatingEmail" label="Email Address" className="mb-4">
              <Form.Control
                type="email"
                placeholder="name@example.com"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="ps-3"
                style={{ borderRadius: '8px', height: '58px' }}
              />
            </FloatingLabel>

            <FloatingLabel controlId="floatingSubject" label="Subject" className="mb-4">
              <Form.Control
                type="text"
                placeholder="Subject"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="ps-3"
                style={{ borderRadius: '8px', height: '58px' }}
              />
            </FloatingLabel>

            <FloatingLabel controlId="floatingMessage" label="Your Message (Optional)" className="mb-4">
              <Form.Control
                as="textarea"
                placeholder="Tell us more about your needs..."
                name="message"
                value={formData.message}
                onChange={handleChange}
                style={{ height: '120px', borderRadius: '8px' }}
              />
            </FloatingLabel>

            <div className="d-flex justify-content-between align-items-center mt-4">
              <p className="text-muted small mb-0">Your information is secure and encrypted</p>
              <Button variant="primary" type="submit" style={buttonStyle} className="px-4">
                <FiSend className="me-2" /> Send Message
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </div>
    </Modal>
  );
};

export default ContactForm;
