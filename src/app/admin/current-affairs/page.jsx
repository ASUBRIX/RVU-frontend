import React, { useEffect, useState } from 'react';
import { Button, Form, Modal, Table } from 'react-bootstrap';
import {
  getCurrentAffairs,
  createCurrentAffair,
  updateCurrentAffair,
  deleteCurrentAffair
} from '../../../helpers/currentAffairsApi';

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

  const fetchAffairs = async () => {
    try {
      const res = await getCurrentAffairs();
      setAffairs(res.data);
    } catch (err) {
      console.error('Failed to fetch current affairs:', err);
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
      } else {
        await createCurrentAffair(formData);
      }
      fetchAffairs();
      handleClose();
    } catch (err) {
      console.error('Failed to submit form:', err);
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

  const handleDelete = async (id) => {
    try {
      await deleteCurrentAffair(id);
      fetchAffairs();
    } catch (err) {
      console.error('Failed to delete item:', err);
    }
  };

  const handleClose = () => {
    setShowModal(false);
    setEditId(null);
    setFormData({ title: '', content: '', date: '', isActive: true, category: '' });
  };

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>Current Affairs Management</h3>
        <Button onClick={() => setShowModal(true)}>+ Add Entry</Button>
      </div>

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>#</th>
            <th>Title</th>
            <th>Date</th>
            <th>Content</th>
            <th>Category</th>
            <th>Status</th>
            <th style={{ width: 150 }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {affairs.map((item, index) => (
            <tr key={item.id}>
              <td>{index + 1}</td>
              <td>{item.title}</td>
              <td>{item.date}</td>
              <td>{item.content}</td>
              <td>{item.category || '-'}</td>
              <td>{item.is_active ? 'Active' : 'Inactive'}</td>
              <td>
                <Button size="sm" onClick={() => handleEdit(item)}>Edit</Button>{' '}
                <Button size="sm" variant="danger" onClick={() => handleDelete(item.id)}>Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>{editId ? 'Edit' : 'Add'} Current Affair</Modal.Title>
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
                rows={3}
                name="content"
                value={formData.content}
                onChange={handleChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category (Optional)</Form.Label>
              <Form.Control
                type="text"
                name="category"
                value={formData.category}
                onChange={handleChange}
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

export default CurrentAffairsPage;
