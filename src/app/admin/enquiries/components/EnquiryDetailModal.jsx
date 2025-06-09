import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const EnquiryDetailModal = ({ show, onHide, enquiry }) => {
  if (!enquiry) return null;

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
      </Modal.Footer>
    </Modal>
  );
};

export default EnquiryDetailModal;
