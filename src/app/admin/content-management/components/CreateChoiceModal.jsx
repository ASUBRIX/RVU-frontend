import React from 'react';
import { Modal, Button, Row, Col } from 'react-bootstrap';
import { FiFolder, FiFileText } from 'react-icons/fi';

const CreateChoiceModal = ({ show, onHide, onSelectFolder, onSelectTest }) => {
  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col xs={6}>
            <Button
              variant="outline-primary"
              className="w-100 py-4 d-flex flex-column align-items-center"
              onClick={onSelectFolder}
            >
              <FiFolder size={24} className="mb-2" />
              <span>Create Folder</span>
            </Button>
          </Col>
          <Col xs={6}>
            <Button
              variant="outline-primary"
              className="w-100 py-4 d-flex flex-column align-items-center"
              onClick={onSelectTest}
            >
              <FiFileText size={24} className="mb-2" />
              <span>Create Test</span>
            </Button>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default CreateChoiceModal; 