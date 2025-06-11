import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table, Badge, Card, Container, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { FiEdit, FiTrash2 } from 'react-icons/fi';
import {
  getAnnouncements,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '@/helpers/announcementApi';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', isActive: true });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    try {
      const res = await getAnnouncements();
      setAnnouncements(res.data);
    } catch (err) {
      console.error('Error fetching announcements:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        await updateAnnouncement(editId, formData);
      } else {
        await createAnnouncement(formData);
      }
      fetchData();
      handleClose();
    } catch (err) {
      console.error('Error saving announcement:', err);
    }
  };

  const handleEdit = (announcement) => {
    setFormData({
      title: announcement.title,
      content: announcement.content,
      isActive: announcement.is_active
    });
    setEditId(announcement.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm('Are you sure you want to delete this announcement?');
    if (confirmDelete) {
      try {
        await deleteAnnouncement(id);
        fetchData();
      } catch (err) {
        console.error('Error deleting announcement:', err);
      }
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', content: '', isActive: true });
  };

  return (
    <Container className="py-5">
      <Card className="shadow rounded-4 p-4 border-0">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="fw-bold mb-0 text-primary">🗣️ Announcement Management</h2>
          <Button
            variant="primary"
            className="rounded-pill px-4 shadow-sm"
            onClick={() => setShowModal(true)}
          >
            + Add Announcement
          </Button>
        </div>

        <Table bordered hover responsive className="table-striped align-middle">
          <thead className="table-primary text-center">
            <tr>
              <th>Title</th>
              <th>Content</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {announcements.length > 0 ? (
              announcements.map((a) => (
                <tr key={a.id}>
                  <td className="text-center fw-semibold">{a.title}</td>
                  <td className="text-center" style={{ maxWidth: '300px' }}>
                    <div className="text-truncate" title={a.content}>
                      {a.content}
                    </div>
                  </td>
                  <td className="text-center">
                    <Badge
                      bg={a.is_active ? 'success' : 'secondary'}
                      className="px-3 py-1 rounded-pill"
                    >
                      {a.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </td>
                  <td className="text-center">
                    <div className="d-flex justify-content-center gap-2">
                      <OverlayTrigger placement="top" overlay={<Tooltip>Edit</Tooltip>}>
                        <Button
                          style={{
                            backgroundColor: '#ed155a',
                            border: 'none',
                            color: '#fff'
                          }}
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          onClick={() => handleEdit(a)}
                        >
                          <FiEdit />
                        </Button>
                      </OverlayTrigger>
                      <OverlayTrigger placement="top" overlay={<Tooltip>Delete</Tooltip>}>
                        <Button
                          style={{
                            backgroundColor: '#ed155a',
                            border: 'none',
                            color: '#fff'
                          }}
                          size="sm"
                          className="rounded-circle d-flex align-items-center justify-content-center"
                          onClick={() => handleDelete(a.id)}
                        >
                          <FiTrash2 />
                        </Button>
                      </OverlayTrigger>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center text-muted">
                  No announcements found.
                </td>
              </tr>
            )}
          </tbody>
        </Table>
      </Card>

      <Modal show={showModal} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">
            {editId ? 'Edit Announcement' : 'Add Announcement'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-semibold">Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                required
                className="rounded-3"
              />
            </Form.Group>

            <Form.Check
              type="switch"
              label="Make Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
              className="mb-3"
            />

            <div className="text-end">
              <Button
                variant="secondary"
                onClick={handleClose}
                className="me-2 rounded-pill px-4"
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
    </Container>
  );
};

export default AnnouncementManagement;
