/**
 * Component SCSS:
 * - Table styles: src/assets/scss/components/_tables.scss
 * - Student specific styles: src/assets/scss/components/_student-management.scss
 */

import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import StudentDetails from './StudentDetails'

const StudentTable = ({ students = [], onEdit, onDelete, onStatusChange }) => {
  console.log(students);
  
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const handleStatusChange = (student) => {
    const newStatus = student.status === 'blocked' ? 'active' : 'blocked'
    onStatusChange(student.id, newStatus)
  }

  const handleViewDetails = (student) => {
    setSelectedStudent(student)
    setShowDetails(true)
  }

  const handleBack = () => {
    setShowDetails(false)
    setSelectedStudent(null)
  }

  if (showDetails && selectedStudent) {
    return <StudentDetails student={selectedStudent} onBack={handleBack} onEdit={onEdit} onDelete={onDelete} />
  }

  return (
    <div className="student-management">
      <Card className="student-card">
        <Card.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.id}>
                    <td>{student.name}</td>
                    <td>{`STU${String(student.id).padStart(3, '0')}`}</td>
                    <td>
                      <span className={`badge bg-${student.status === 'active' ? 'success' : 'secondary'}`}>
                        {student.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action view-btn" onClick={() => handleViewDetails(student)}>
                          <BsEye />
                        </button>
                        <button className="btn-action edit-btn" onClick={() => onEdit(student)}>
                          <BsPencilSquare />
                        </button>
                        <button className="btn-action delete-btn" onClick={() => onDelete(student)}>
                          <BsTrash />
                        </button>
                        <button className="btn-action" onClick={() => handleStatusChange(student)}>
                          {student.status === 'blocked' ? <FaLockOpen /> : <FaLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  )
}

export default StudentTable
