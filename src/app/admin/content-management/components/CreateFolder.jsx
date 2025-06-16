import React, { useState } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';
import { createFolder } from '@/helpers/admin/testApi';
import { useNotificationContext } from '@/context/useNotificationContext';

const CreateFolder = ({ show, onHide, parentId = null, onFolderCreated }) => {
  const [folderName, setFolderName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { showNotification } = useNotificationContext();

  const handleSubmit = async () => {
    if (!folderName.trim()) {
      setError('Folder name cannot be empty.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = {
        name: folderName.trim(),
        parent_id: parentId || null
      };
      await createFolder(data);
      showNotification({ message: 'Folder created successfully!', variant: 'success' });
      setFolderName('');
      onHide();
      onFolderCreated();
    } catch (err) {
      console.error('Create folder failed:', err);
      setError('Failed to create folder. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Create New Folder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        <Form.Group className="mb-3">
          <Form.Label>Folder Name</Form.Label>
          <Form.Control
            type="text"
            placeholder="Enter folder name"
            value={folderName}
            onChange={(e) => setFolderName(e.target.value)}
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide} disabled={loading}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSubmit} disabled={loading}>
          {loading ? 'Creating...' : 'Create Folder'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default CreateFolder;
