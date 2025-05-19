import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EnquiryDetailModal = ({ show, onHide, enquiry }) => {
  if (!enquiry) return null;

  const handleSendResponse = () => {
    const mailtoLink = `mailto:${enquiry.email}?subject=Response to Your Enquiry&body=Dear ${enquiry.name},%0D%0A%0D%0ARegarding your enquiry:%0D%0A${enquiry.message}%0D%0A%0D%0AOur Response:%0D%0A%0D%0ABest Regards,%0D%0APudhuyugam Team`;
    window.location.href = mailtoLink;
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Enquiry Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <h6 className="fw-semibold">Student Info</h6>
        <p><strong>Name:</strong> {enquiry.name}</p>
        <p><strong>Email:</strong> {enquiry.email}</p>
        <p><strong>Phone:</strong> {enquiry.phone}</p>
        <p><strong>Subject:</strong> {enquiry.subject || 'N/A'}</p>

        <h6 className="mt-4 fw-semibold">Message</h6>
        <p>{enquiry.message}</p>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>Close</Button>
        <Button variant="primary" onClick={handleSendResponse}>Send Response</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EnquiryDetailModal;
