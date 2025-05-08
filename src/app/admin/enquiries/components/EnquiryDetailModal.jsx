/**
 * Component SCSS:
 * - Enquiry styles: src/assets/scss/components/_enquiries.scss
 * - Modal styles: src/assets/scss/components/_general.scss
 */

import React from 'react'
import { Modal, Button, Form } from 'react-bootstrap'

const EnquiryDetailModal = ({ show, onHide, enquiry }) => {
  if (!enquiry) return null

  const handleSendResponse = () => {
    // Construct the mailto link with pre-filled details
    const mailtoLink = `mailto:${enquiry.email}?subject=Response to Your Enquiry&body=Dear ${enquiry.name},

Regarding your enquiry (ID: ${enquiry.id}):

${enquiry.message}

Our Response:
`

    // Open the default email client
    window.location.href = mailtoLink
  }

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Enquiry Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="mb-4">
          <h6>Student Information</h6>
          <p>
            <strong>Name:</strong> {enquiry.name}
          </p>
          <p>
            <strong>ID:</strong> {enquiry.id}
          </p>
          <p>
            <strong>Email:</strong> {enquiry.email}
          </p>
          <p>
            <strong>Phone:</strong> {enquiry.phone}
          </p>
        </div>

        <div className="mb-4">
          <h6>Message</h6>
          <p>{enquiry.message}</p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="theme-secondary" onClick={onHide}>
          Close
        </Button>
        <Button variant="primary" onClick={handleSendResponse}>
          Send Response
        </Button>
      </Modal.Footer>
    </Modal>
  )
}

export default EnquiryDetailModal
