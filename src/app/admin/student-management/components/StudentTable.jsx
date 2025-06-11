import React, { useState } from 'react'
import { Card } from 'react-bootstrap'
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs'
import { FaLock, FaLockOpen } from 'react-icons/fa'
import StudentDetails from './StudentDetails'
import './StudentTable.scss'

const StudentTable = ({ students = [], onEdit, onDelete, onStatusChange }) => {
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

  const totalStudents = students.length
  const activeStudents = students.filter((s) => s.status === 'active').length

  if (showDetails && selectedStudent) {
    return <StudentDetails student={selectedStudent} onBack={handleBack} onEdit={onEdit} onDelete={onDelete} />
  }

  return (
    <div className="student-management">
      {/* COUNT BOXES */}
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

      {/* TABLE */}
      <Card className="student-card">
        <Card.Body>
          <div className="table-responsive">
            <table className="table align-middle">
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
                      <div className="action-buttons d-flex gap-2">
                        <button className="btn btn-sm btn-outline-info" onClick={() => handleViewDetails(student)}>
                          <BsEye />
                        </button>
                        <button className="btn btn-sm btn-outline-primary" onClick={() => onEdit(student)}>
                          <BsPencilSquare />
                        </button>
                        <button className="btn btn-sm btn-outline-danger" onClick={() => onDelete(student)}>
                          <BsTrash />
                        </button>
                        <button className="btn btn-sm btn-outline-warning" onClick={() => handleStatusChange(student)}>
                          {student.status === 'blocked' ? <FaLockOpen /> : <FaLock />}
                        </button>
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
    </div>
  )
}

export default StudentTable
