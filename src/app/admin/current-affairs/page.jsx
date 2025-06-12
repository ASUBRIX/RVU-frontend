import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table, Badge, Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import { getCurrentAffairs, createCurrentAffair, updateCurrentAffair, deleteCurrentAffair } from '@/helpers/currentAffairsApi';
import { useNotificationContext } from '../../../context/useNotificationContext';

const CurrentAffairsPage = () => {
  const [affairs, setAffairs] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    date: '',
    isActive: true,
    category: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [deleteItem, setDeleteItem] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const { showNotification } = useNotificationContext();

  const fetchAffairs = async () => {
    try {
      const res = await getCurrentAffairs();
      setAffairs(res.data);
    } catch (err) {
      console.error('Failed to fetch current affairs:', err);
      showNotification && showNotification({ 
        title: 'Error', 
        message: 'Failed to fetch current affairs', 
        variant: 'danger' 
      });
    }
  };

  useEffect(() => {
    fetchAffairs();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateCurrentAffair(editId, formData);
        showNotification && showNotification({ 
          title: 'Updated', 
          message: 'Current affair updated successfully', 
          variant: 'success' 
        });
      } else {
        await createCurrentAffair(formData);
        showNotification && showNotification({ 
          title: 'Created', 
          message: 'Current affair added successfully', 
          variant: 'success' 
        });
      }
      fetchAffairs();
      handleClose();
    } catch (err) {
      console.error('Failed to submit form:', err);
      showNotification && showNotification({ 
        title: 'Error', 
        message: 'Failed to save current affair', 
        variant: 'danger' 
      });
    }
  };

  const handleEdit = (item) => {
    setFormData({
      title: item.title,
      content: item.content,
      category: item.category || '',
      date: item.date,
      isActive: item.is_active
    });
    setEditId(item.id);
    setShowModal(true);
  };

  const confirmDelete = (item) => {
    setDeleteId(item.id);
    setDeleteItem(item);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;
    
    setIsDeleting(true);
    try {
      await deleteCurrentAffair(deleteId);
      await fetchAffairs();
      showNotification && showNotification({ 
        title: 'Deleted', 
        message: `"${deleteItem?.title}" has been deleted successfully`, 
        variant: 'success' 
      });
    } catch (err) {
      console.error('Failed to delete item:', err);
      showNotification && showNotification({ 
        title: 'Error', 
        message: 'Failed to delete current affair', 
        variant: 'danger' 
      });
    } finally {
      setIsDeleting(false);
      setShowDeleteConfirm(false);
      setDeleteId(null);
      setDeleteItem(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteConfirm(false);
    setDeleteId(null);
    setDeleteItem(null);
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', content: '', date: '', isActive: true, category: '' });
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className="py-5">
      <Card className="shadow rounded-4 p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">📰 Current Affairs Management</h2>
          <Button
            variant="primary"
            className="rounded-pill px-4 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            + Add Entry
          </Button>
        </div>

        <Table bordered hover responsive className="table-striped align-middle text-center">
          <thead className="table-primary">
            <tr>
              <th>Title</th>
              <th>Date</th>
              <th>Content</th>
              <th>Category</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {affairs.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-muted py-4">
                  No current affairs found. Click "Add Entry" to create your first entry.
                </td>
              </tr>
            ) : (
              affairs.map((item) => (
                <tr key={item.id}>
                  <td className="fw-medium">{item.title}</td>
                  <td>{formatDate(item.date)}</td>
                  <td className="text-start">
                    {item.content.length > 100 
                      ? `${item.content.substring(0, 100)}...` 
                      : item.content
                    }
                  </td>
                  <td>{item.category || '-'}</td>
                  <td>
                    <Badge
                      bg={item.is_active ? 'success' : 'secondary'}
                      className="px-3 py-1 rounded-pill"
                    >
                      {item.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td>
                    <div className="d-flex justify-content-center gap-2">
                      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          style={{ backgroundColor: '#ed155a', border: 'none', color: '#fff' }}
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          onClick={() => handleEdit(item)}
                        >
                          <FiEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          style={{ backgroundColor: '#dc3545', border: 'none', color: '#fff' }}
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          onClick={() => confirmDelete(item)}
                        >
                          <FiTrash2 />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Card>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">
            {editId ? 'Edit Current Affair' : 'Add Current Affair'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                placeholder="Enter title"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
                placeholder="Enter content"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
                placeholder="e.g., Politics, Sports, Technology"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Check
              type="switch"
              label="Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mb-3"
            />

            <div className="text-end">
              <Button
                variant="secondary"
                className="rounded-pill px-4 me-2"
                onClick={handleClose}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                style={{ backgroundColor: '#ed155a', border: 'none' }}
                className="rounded-pill px-4"
              >
                {editId ? 'Update' : 'Create'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>

      {/* Enhanced Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={handleDeleteCancel} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold text-danger">
            ⚠️ Confirm Deletion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <div className="mb-3">
            <p className="mb-2">Are you sure you want to delete this current affair?</p>
            {deleteItem && (
              <div className="bg-light p-3 rounded mb-3">
                <strong>"{deleteItem.title}"</strong>
                <br />
                <small className="text-muted">
                  {formatDate(deleteItem.date)} • {deleteItem.category || 'No category'}
                </small>
              </div>
            )}
            <p className="text-muted small">This action cannot be undone.</p>
          </div>
          <div className="d-flex justify-content-center gap-3">
            <Button 
              variant="secondary" 
              onClick={handleDeleteCancel}
              disabled={isDeleting}
              className="px-4"
            >
              Cancel
            </Button>
            <Button 
              variant="danger" 
              onClick={handleDeleteConfirmed}
              disabled={isDeleting}
              className="px-4"
            >
              {isDeleting ? 'Deleting...' : 'Delete'}
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default CurrentAffairsPage;