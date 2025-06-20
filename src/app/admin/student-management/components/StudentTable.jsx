import React, { useState, useMemo } from 'react';
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

  // Console log the received students data
  console.log("🔍 StudentTable received students:", students);
  console.log("🔍 Students count:", students.length);
  
  // Log each student individually for detailed debugging
  students.forEach((student, index) => {
    console.log(`📋 Student ${index + 1}:`, {
      id: student.id,
      name: `${student.first_name} ${student.last_name}`,
      enrollment_id: student.enrollment_id,
      enrollmentId: student.enrollmentId,
      status: student.status,
      email: student.email,
      phone: student.phone,
      program: student.program,
      user_id: student.user_id
    });
  });

  // Sort students by enrollment ID to ensure proper order
  const sortedStudents = useMemo(() => {
    console.log("🔄 Sorting students...");
    
    const sorted = [...students].sort((a, b) => {
      const idA = a.enrollment_id || a.enrollmentId || '';
      const idB = b.enrollment_id || b.enrollmentId || '';
      
      console.log(`🔄 Comparing: ${idA} vs ${idB}`);
      
      // Extract number from enrollment ID (STU001 -> 1, STU002 -> 2)
      const numA = parseInt(idA.replace(/\D/g, '')) || 0;
      const numB = parseInt(idB.replace(/\D/g, '')) || 0;
      
      console.log(`🔄 Numeric comparison: ${numA} vs ${numB}`);
      
      return numA - numB;
    });
    
    console.log("✅ Sorted students:", sorted.map(s => ({
      name: `${s.first_name} ${s.last_name}`,
      id: s.enrollment_id || s.enrollmentId || 'NO_ID'
    })));
    
    return sorted;
  }, [students]);

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
                  <th>S.No</th>
                  <th>Name</th>
                  <th>Student ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sortedStudents.map((student, index) => {
                  console.log(`🗂️ Rendering row ${index + 1}:`, {
                    student_id: student.id,
                    name: `${student.first_name} ${student.last_name}`,
                    enrollment_id: student.enrollment_id || student.enrollmentId || 'MISSING',
                    status: student.status
                  });
                  
                  return (
                    <tr key={student.id}>
                      <td>{index + 1}</td>
                      <td>{`${student.first_name} ${student.last_name}`}</td>
                      <td>
                        {student.enrollment_id || student.enrollmentId || (
                          <span style={{color: 'red', fontStyle: 'italic'}}>
                            No ID
                          </span>
                        )}
                      </td>
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
                  );
                })}
                {sortedStudents.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
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