import { useEffect, useState } from 'react';
import { Button, Modal, Form, Table, Badge } from 'react-bootstrap';
import { getAllCoupons, createCoupon, updateCoupon, deleteCoupon } from '@/helpers/couponApi';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';

const CouponManagement = () => {
  const [coupons, setCoupons] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState(null);
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
      } else {
        await createCoupon(formData);
      }
      fetchCoupons();
      setShowModal(false);
      setEditingCoupon(null);
      setFormData({
        code: '',
        discountType: 'percentage',
        discountValue: '',
        usageLimit: '',
        expirationDate: '',
        isActive: true
      });
    } catch (error) {
      console.error('Save failed:', error);
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData(coupon);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this coupon?')) {
      await deleteCoupon(id);
      fetchCoupons();
    }
  };

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h4 className="fw-bold">Coupon Management</h4>
        <Button onClick={() => setShowModal(true)}><FaPlus className="me-2" /> Add Coupon</Button>
      </div>

      <Table bordered hover responsive>
        <thead>
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
          {coupons.map(coupon => (
            <tr key={coupon.id}>
              <td>{coupon.code}</td>
              <td>{coupon.discountType}</td>
              <td>{coupon.discountValue}</td>
              <td>{coupon.usageLimit || 'Unlimited'}</td>
              <td>{coupon.expirationDate ? new Date(coupon.expirationDate).toLocaleDateString() : 'Never'}</td>
              <td>
                <Badge bg={coupon.isActive ? 'success' : 'secondary'}>
                  {coupon.isActive ? 'Active' : 'Inactive'}
                </Badge>
              </td>
              <td>
                <Button size="sm" variant="warning" className="me-2" onClick={() => handleEdit(coupon)}>
                  <FaEdit />
                </Button>
                <Button size="sm" variant="danger" onClick={() => handleDelete(coupon.id)}>
                  <FaTrash />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editingCoupon ? 'Edit Coupon' : 'Add New Coupon'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Code</Form.Label>
              <Form.Control value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Type</Form.Label>
              <Form.Select value={formData.discountType} onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}>
                <option value="percentage">Percentage</option>
                <option value="flat">Flat</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Discount Value</Form.Label>
              <Form.Control type="number" value={formData.discountValue} onChange={(e) => setFormData({ ...formData, discountValue: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Usage Limit</Form.Label>
              <Form.Control type="number" value={formData.usageLimit || ''} onChange={(e) => setFormData({ ...formData, usageLimit: e.target.value })} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Expiration Date</Form.Label>
              <Form.Control type="date" value={formData.expirationDate ? formData.expirationDate.substring(0, 10) : ''} onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })} />
            </Form.Group>

            <Form.Check 
              type="switch" 
              id="active" 
              label="Active" 
              checked={formData.isActive} 
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })} 
            />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleSave}>Save</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CouponManagement;
