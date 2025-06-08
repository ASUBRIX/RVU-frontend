import React, { useState } from 'react';
import { Button, Col, Container, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import {
  FaFacebookSquare,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from 'react-icons/fa';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import contactImg from '@/assets/images/logo.png';
import TextFormInput from '@/components/form/TextFormInput';
import TextAreaFormInput from '@/components/form/TextAreaFormInput';
import { yupResolver } from '@hookform/resolvers/yup';
import httpClient from '@/helpers/httpClient';
import './ContactFormAndMap.scss';

const contactFormSchema = yup.object({
  name: yup.string().required('Please enter your name'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Please enter your email'),
  phone: yup.string().max(20, 'Phone number is too long'),
  subject: yup.string().max(255, 'Subject is too long'),
  message: yup.string().required('Please enter your message'),
});

const ContactFormAndMap = () => {
  const { control, handleSubmit, reset } = useForm({
    resolver: yupResolver(contactFormSchema),
  });

  const [formStatus, setFormStatus] = useState({ success: '', error: '' });

  const onSubmit = async (data) => {
    setFormStatus({ success: '', error: '' });
    try {
      await httpClient.post('/api/contact-enquiry', data);
      setFormStatus({
        success: 'Thank you! Your message has been sent.',
        error: '',
      });
      reset();
    } catch (error) {
      setFormStatus({
        success: '',
        error: 'Failed to send message. Please try again.',
      });
    }
  };

  return (
    <>
      <section className="contact-section">
        <Container>
          <Row className="g-3 align-items-center">
            <Col md={6} className="text-center">
              <img src={contactImg} className="h-300px" alt="contact-image" />
              <div className="d-sm-flex align-items-center justify-content-center mt-3">
                <h6 className="mb-0 me-2">Follow us:</h6>
                <ul className="list-inline mb-0">
                  {[
                    { icon: <FaFacebookSquare />, class: 'text-facebook' },
                    { icon: <FaInstagram />, class: 'text-instagram' },
                    { icon: <FaTwitter />, class: 'text-twitter' },
                    { icon: <FaLinkedinIn />, class: 'text-linkedin' },
                  ].map((social, index) => (
                    <li key={index} className="list-inline-item">
                      <Link className={`fs-5 me-1 ${social.class}`} to="">
                        {social.icon}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </Col>

            <Col md={6} className="d-flex justify-content-center">
              <div className="w-100" style={{ maxWidth: '400px' }}>
                <h4 className="mb-3">Let&apos;s Talk</h4>
                <form onSubmit={handleSubmit(onSubmit)} autoComplete="off">
                  <TextFormInput
                    name="name"
                    label="Name *"
                    control={control}
                    className="form-control-sm"
                    containerClassName="mb-3 bg-light-input"
                  />
                  <TextFormInput
                    name="email"
                    type="email"
                    label="Email *"
                    control={control}
                    className="form-control-sm"
                    containerClassName="mb-3 bg-light-input"
                  />
                  <TextFormInput
                    name="phone"
                    label="Phone"
                    control={control}
                    className="form-control-sm"
                    containerClassName="mb-3 bg-light-input"
                  />
                  <TextFormInput
                    name="subject"
                    label="Subject"
                    control={control}
                    className="form-control-sm"
                    containerClassName="mb-3 bg-light-input"
                  />
                  <TextAreaFormInput
                    name="message"
                    label="Message *"
                    rows={3}
                    control={control}
                    containerClassName="mb-3 bg-light-input"
                  />
                  {formStatus.error && (
                    <div className="alert alert-danger mt-2">{formStatus.error}</div>
                  )}
                  {formStatus.success && (
                    <div className="alert alert-success mt-2">{formStatus.success}</div>
                  )}
                  <div className="d-grid">
                    <Button variant="primary" size="sm" type="submit">
                      Send Message
                    </Button>
                  </div>
                </form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <section className="pt-0 pb-0 contact-map-section">
        <div className="w-100 vw-100 contact-map-container">
          <iframe
            className="w-100 vw-100 h-400px rounded-0 m-0 p-0 contact-map-frame"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3916.261996232096!2d77.0243787!3d11.018958999999999!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ba85700125327fb%3A0x95423240cfd3a583!2sPudhuyugam%20Academy!5e0!3m2!1sen!2sin!4v1741930122609!5m2!1sen!2sin"
            aria-hidden="false"
            tabIndex={0}
            title="Pudhuyugam Academy Map"
          />
        </div>
      </section>
    </>
  );
};

export default ContactFormAndMap;
