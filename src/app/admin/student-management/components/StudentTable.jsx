import React, { useState } from 'react';
import { Card, Button, Modal } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import { useNotificationContext } from '../../../../context/useNotificationContext';
import StudentDetails from './StudentDetails';
import './StudentTable.scss';

const StudentTable = ({ students = [], onEdit, onDelete, onStatusChange }) => {
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { showNotification } = useNotificationContext();

  const handleStatusChange = (student) => {
    const newStatus = student.status === 'blocked' ? 'active' : 'blocked';
    onStatusChange(student.id, newStatus);
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedStudent(null);
  };

  const confirmDelete = (student) => {
    setDeleteTarget(student);
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirmed = async () => {
    try {
      await onDelete(deleteTarget);
      showNotification && showNotification({
        title: 'Deleted',
        message: 'Student deleted successfully',
        variant: 'success'
      });
    } catch (err) {
      showNotification && showNotification({
        title: 'Error',
        message: 'Failed to delete student',
        variant: 'danger'
      });
    } finally {
      setShowDeleteConfirm(false);
      setDeleteTarget(null);
    }
  };

  const totalStudents = students.length;
  const activeStudents = students.filter((s) => s.status === 'active').length;

  if (showDetails && selectedStudent) {
    return <StudentDetails student={selectedStudent} onBack={handleBack} onEdit={onEdit} onDelete={onDelete} />;
  }

  return (
    <div className="student-management">
      <div className="student-stats-container">
        <div className="student-stat-box">
          <h6>Total Students</h6>
          <h3>{totalStudents}</h3>
        </div>
        <div className="student-stat-box">
          <h6>Active Students</h6>
          <h3>{activeStudents}</h3>
        </div>
      </div>

      <Card className="student-card">
        <Card.Body>
          <div className="table-responsive">
            <table className="table align-middle text-center">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <tr key={student.id}>
                    <td>{`${student.first_name} ${student.last_name}`}</td>
                    <td>{`STU${String(index + 1).padStart(3, '0')}`}</td>
                    <td>
                      <span className={`badge bg-${student.status === 'active' ? 'success' : 'secondary'}`}>
                        {student.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons d-flex justify-content-center gap-2">
                        <Button size="sm" variant="outline-info" onClick={() => handleViewDetails(student)}>
                          <BsEye />
                        </Button>
                        <Button size="sm" variant="outline-primary" onClick={() => onEdit(student)}>
                          <BsPencilSquare />
                        </Button>
                        <Button
                          size="sm"
                          style={{ backgroundColor: '#ed155a', border: 'none', color: '#fff' }}
                          onClick={() => confirmDelete(student)}
                        >
                          <BsTrash />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-warning"
                          onClick={() => handleStatusChange(student)}
                        >
                          {student.status === 'blocked' ? <FaLockOpen /> : <FaLock />}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No students found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Delete confirmation modal */}
      <Modal show={showDeleteConfirm} onHide={() => setShowDeleteConfirm(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title className="fw-semibold">Confirm Deletion</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <p>Are you sure you want to delete this student?</p>
          <div className="d-flex justify-content-center gap-3 mt-4">
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

export default StudentTable;
