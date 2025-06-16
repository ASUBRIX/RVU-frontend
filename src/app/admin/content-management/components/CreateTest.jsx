import React, { useState } from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { createTest } from '@/helpers/admin/testApi';
import { useNotificationContext } from '@/context/useNotificationContext';

const CreateTest = ({ onClose, onSave, currentFolderId }) => {
  
  const { showNotification } = useNotificationContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    passing_score: 60,
    duration_minutes: 60,
    folder_id: currentFolderId || null,
    status: 'draft',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createTest(formData);
      showNotification({ message: 'Test created successfully', variant: 'success' });
      onSave();
    } catch (error) {
      console.error('Failed to create test:', error);
      showNotification({ message: 'Failed to create test', variant: 'danger' });
    }
  };

  return (
    <Modal show onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Test</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Test Title</Form.Label>
            <Form.Control
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Passing Score</Form.Label>
            <Form.Control
              type="number"
              name="passing_score"
              value={formData.passing_score}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Duration (minutes)</Form.Label>
            <Form.Control
              type="number"
              name="duration_minutes"
              value={formData.duration_minutes}
              onChange={handleChange}
              min="1"
            />
          </Form.Group>
          <Button variant="primary" type="submit" className="w-100">
            Create Test
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default CreateTest;
