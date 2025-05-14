import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import {getAnnouncements,createAnnouncement,updateAnnouncement,deleteAnnouncement} from '@/helpers/announcementApi';

const AnnouncementManagement = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [formData, setFormData] = useState({ title: '', content: '', isActive: true });
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);

  const fetchData = async () => {
    const res = await getAnnouncements();
    setAnnouncements(res.data);
  };

  useEffect(() => { fetchData(); }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editId) {
      await updateAnnouncement(editId, formData);
    } else {
      await createAnnouncement(formData);
    }
    fetchData();
    handleClose();
  };

  const handleEdit = (announcement) => {
    setFormData(announcement);
    setEditId(announcement.id);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    await deleteAnnouncement(id);
    fetchData();
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', content: '', isActive: true });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Announcement Management</h3>
        <Button onClick={() => setShowModal(true)}>+ Add Announcement</Button>
      </div>

      <Table bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {announcements.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.title}</td>
              <td>{a.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(a)}>Edit</Button>{' '}
                <Button variant="danger" size="sm" onClick={() => handleDelete(a.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Announcement</Modal.Title>
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
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Content</Form.Label>
              <Form.Control
                as="textarea"
                name="content"
                rows={4}
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Check
              type="checkbox"
              label="Active"
              name="isActive"
              checked={formData.isActive}
              onChange={handleChange}
            />
            <div className="text-end mt-3">
              <Button type="submit">{editId ? 'Update' : 'Create'}</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AnnouncementManagement;
