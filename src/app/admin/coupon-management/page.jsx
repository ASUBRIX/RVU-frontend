import { useEffect, useState } from 'react';
import { Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/helpers/couponApi';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import { useNotificationContext } from '../../../context/useNotificationContext';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const { showNotification } = useNotificationContext();

  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    usageLimit: '',
    expirationDate: '',
    isActive: true
  });

  const fetchCoupons = async () => {
    try {
      const res = await getAllCoupons();
      setCoupons(res.data);
    } catch (error) {
      console.error('Failed to load coupons:', error);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async () => {
    try {
      if (editingCoupon) {
        await updateCoupon(editingCoupon.id, formData);
        showNotification({ title: 'Updated', message: 'Coupon updated successfully', variant: 'success' });
      } else {
        await createCoupon(formData);
        showNotification({ title: 'Created', message: 'Coupon created successfully', variant: 'success' });
      }
      fetchCoupons();
      setShowModal(false);
      setEditingCoupon(null);
      resetForm();
    } catch (error) {
      console.error('Save failed:', error);
      showNotification({ title: 'Error', message: 'Failed to save coupon', variant: 'danger' });
    }
  };

  const confirmDelete = (id) => {
    setDeleteId(id);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await deleteCoupon(deleteId);
      fetchCoupons();
      showNotification({ title: 'Deleted', message: 'Coupon deleted successfully', variant: 'success' });
    } catch (error) {
      console.error('Delete failed:', error);
      showNotification({ title: 'Error', message: 'Failed to delete coupon', variant: 'danger' });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteId(null);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setShowModal(true);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: '',
      usageLimit: '',
      expirationDate: '',
      isActive: true
    });
  };

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold text-primary mb-0">🎟️ Coupon Management</h3>
        <Button className="rounded-pill px-4 shadow-sm" onClick={() => setShowModal(true)}>
          <FaPlus className="me-2" /> Add Coupon
        </Button>
      </div>

      <Table bordered hover responsive className="table-striped align-middle text-center">
        <thead className="table-primary">
          <tr>
            <th>Code</th>
            <th>Type</th>
            <th>Value</th>
            <th>Usage Limit</th>
            <th>Expires On</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {coupons.map((coupon) => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountType}</td>
              <td>{coupon.discountValue}</td>
              <td>{coupon.usageLimit || 'Unlimited'}</td>
              <td>{coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}</td>
              <td>
                <Badge bg={coupon.isActive ? 'success' : 'secondary'} className="px-3 py-1 rounded-pill">
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <div className="d-flex justify-content-center gap-2">
                  <Button size="sm" variant="warning" onClick={() => handleEdit(coupon)}>
                    <FaEdit />
                  </Button>
                  <Button size="sm" variant="danger" onClick={() => confirmDelete(coupon.id)}>
                    <FaTrash />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control
                value={formData.code}
                onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Type</Form.Label>
              <Form.Select
                value={formData.discountType}
                onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
              >
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Value</Form.Label>
              <Form.Control
                type="number"
                value={formData.discountValue}
                onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control
                type="number"
                value={formData.usageLimit || ''}
                onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control
                type="date"
                value={formData.expirationDate ? formData.expirationDate.substring(0, 10) : ''}
                onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
              />
            </Form.Group>

            <Form.Check
              type="switch"
              id="active"
              label="Active"
              checked={formData.isActive}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
              className="mb-3"
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete this coupon?</p>
          <div className="d-flex justify-content-center gap-3 mt-3">
            <Button variant="secondary" onClick={() => setShowDeleteConfirm(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleDeleteConfirmed}>
              Delete
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default CouponManagement;
