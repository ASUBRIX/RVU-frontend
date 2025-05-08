/**
 * SCSS files:
 * Main styles: src/assets/scss/components/_student-management.scss
 * Shared styles:
 * - Table: src/assets/scss/components/_tables.scss
 * - Avatar: src/assets/scss/components/_avatar.scss
 * - General: src/assets/scss/components/_general.scss
 */

import PageMetaData from '@/components/PageMetaData'
import React, { useState } from 'react'
import { Button, Container, Form, Modal } from 'react-bootstrap'
import { FaPlus } from 'react-icons/fa'
import { FiSearch } from 'react-icons/fi'
import StudentFilterAndExport from './components/StudentFilterAndExport'
import StudentForm from './components/StudentForm'
import StudentTable from './components/StudentTable'

const dummyStudents = [
  {
    id: 1,
    name: 'Alice Johnson',
    enrollmentId: 'STU001',
    email: 'alice.johnson@example.com',
    phone: '+1 234-567-8901',
    enrollmentDate: '2023-09-01',
    status: 'active',
    courses: ['Computer Science 101', 'Data Structures', 'Web Development'],
  },
  {
    id: 2,
    name: 'Bob Smith',
    enrollmentId: 'STU002',
    email: 'bob.smith@example.com',
    phone: '+1 234-567-8902',
    enrollmentDate: '2023-09-01',
    status: 'blocked',
    courses: ['Mathematics 101', 'Physics 101'],
  },
  {
    id: 3,
    name: 'Charlie Brown',
    enrollmentId: 'STU003',
    email: 'charlie.brown@example.com',
    phone: '+1 234-567-8903',
    enrollmentDate: '2023-09-02',
    status: 'active',
    courses: ['Chemistry 101', 'Biology 101', 'Lab Practice'],
  },
  {
    id: 4,
    name: 'Diana Miller',
    enrollmentId: 'STU004',
    email: 'diana.miller@example.com',
    phone: '+1 234-567-8904',
    enrollmentDate: '2023-09-02',
    status: 'active',
    courses: ['English Literature', 'Creative Writing'],
  },
  {
    id: 5,
    name: 'Edward Wilson',
    enrollmentId: 'STU005',
    email: 'edward.wilson@example.com',
    phone: '+1 234-567-8905',
    enrollmentDate: '2023-09-03',
    status: 'active',
    courses: ['Computer Networks', 'Database Systems', 'Software Engineering'],
  },
]

const StudentManagement = () => {
  const [students, setStudents] = useState(dummyStudents)
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingStudent, setEditingStudent] = useState(null)
  const [isFilterActive, setIsFilterActive] = useState(false)

  const handleEdit = (student) => {
    setEditingStudent(student)
    setShowAddModal(true)
  }

  const handleDelete = (student) => {
    setStudents(students.filter((s) => s.id !== student.id))
  }

  const handleStatusChange = (studentId, newStatus) => {
    setStudents(students.map((student) => (student.id === studentId ? { ...student, status: newStatus } : student)))
  }

  const handleAddStudent = (newStudent) => {
    // If newStudent is null, just close the modal
    if (newStudent === null) {
      setShowAddModal(false)
      setEditingStudent(null)
      return
    }

    if (editingStudent) {
      // Update existing student
      setStudents(students.map((student) => (student.id === editingStudent.id ? { ...newStudent, id: student.id } : student)))
    } else {
      // Add new student
      setStudents([
        ...students,
        {
          ...newStudent,
          id: students.length + 1,
          enrollmentId: `STU${String(students.length + 1).padStart(3, '0')}`,
        },
      ])
    }
    setShowAddModal(false)
    setEditingStudent(null)
  }

  const handleCloseModal = () => {
    setShowAddModal(false)
    setEditingStudent(null)
  }

  // Filter students based on search query
  const filteredStudents = students.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) || student.enrollmentId.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  // Format student data for export
  const exportableStudentData = filteredStudents.map((student) => ({
    ID: student.enrollmentId,
    Name: student.name,
    Email: student.email,
    Phone: student.phone,
    EnrollmentDate: student.enrollmentDate,
    Status: student.status,
    Courses: student.courses.join(', '),
  }))

  // Add these functions to StudentManagement
  const handleDateFilterChange = (filterType, startDate, endDate) => {
    // Filter the students based on enrollment date
    let filteredData = [...dummyStudents]

    if (filterType === 'custom' && startDate && endDate) {
      filteredData = dummyStudents.filter((student) => {
        const enrollmentDate = new Date(student.enrollmentDate)
        return enrollmentDate >= startDate && enrollmentDate <= endDate
      })
      setIsFilterActive(true) // Set filter active flag
    } else if (filterType === 'clear') {
      // Handle clear filter case
      setIsFilterActive(false)
    }

    setStudents(filteredData)
  }

  const handleSortChange = (sortField) => {
    setSortBy(sortField)
    // You can implement additional sorting logic here if needed
  }

  return (
    <div className="student-management">
      {/* Header Section */}
      <div className="bg-light p-4 mb-4">
        <Container fluid>
          <div className="d-flex flex-wrap justify-content-between align-items-center mb-3">
            <div>
              <h3 className="page-title mb-0">Student Management</h3>
              <nav aria-label="breadcrumb">
                <ol className="breadcrumb mb-0 mt-2">
                  <li className="breadcrumb-item">
                    <a href="#" className="text-muted">
                      Dashboard
                    </a>
                  </li>
                  <li className="breadcrumb-item active text-dark" aria-current="page">
                    Students
                  </li>
                </ol>
              </nav>
            </div>
            <Button className="btn-add-content d-flex align-items-center" onClick={() => setShowAddModal(true)}>
              <FaPlus className="me-2" />
              Add New Student
            </Button>
          </div>

          {/* Search and Sort Section */}
          <div className="row g-3 align-items-center">
            <div className="col-md-8">
              <div className="search-input">
                <div className="input-group">
                  <span className="input-group-text border-end-0">
                    <FiSearch className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    placeholder="Search students..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="border-start-0 ps-0"
                  />
                </div>
              </div>
            </div>
            <div className="col-md-4">
              <div className="d-flex align-items-center justify-content-end">
                <label className="me-2 text-nowrap fw-medium">Sort by:</label>
                <Form.Select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="form-select">
                  <option value="newest">Newest First</option>
                  <option value="oldest">Oldest First</option>
                  <option value="name">Name</option>
                  <option value="status">Status</option>
                </Form.Select>
              </div>
            </div>
          </div>
        </Container>
      </div>

      {/* Stats Cards and Export Section */}
      {/* Stats Cards and Export Section */}
      <Container fluid>
        <div className="row mb-4 align-items-center">
          <div className="col-md-3 col-sm-6 mb-md-0 mb-3">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <h5 className="text-uppercase text-muted mb-0 fs-6">TOTAL STUDENTS</h5>
              </div>
              <div className="border border-2 border-secondary rounded p-2 px-3">
                <h3 className="m-0 fw-bold">{students.length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-3 col-sm-6 mb-md-0 mb-3">
            <div className="d-flex align-items-center">
              <div className="me-3">
                <h5 className="text-uppercase text-muted mb-0 fs-6">ACTIVE STUDENTS</h5>
              </div>
              <div className="border border-2 border-danger rounded p-2 px-3">
                <h3 className="m-0 fw-bold text-danger">{students.filter((s) => s.status === 'active').length}</h3>
              </div>
            </div>
          </div>

          <div className="col-md-6 text-md-end mt-sm-3 mt-md-0">
            <div className="d-flex justify-content-md-end gap-2">
              {isFilterActive && (
                <span
                  className="filter-clear-btn cursor-pointer d-inline-flex align-items-center gap-2 px-2 py-0 m-0 "
                  onClick={() => {
                    setStudents(dummyStudents)
                    setIsFilterActive(false)
                  }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-x-circle" viewBox="0 0 16 16">
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z" />
                  </svg>
                  Clear Filter
                </span>
              )}
              <StudentFilterAndExport
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                tableData={exportableStudentData}
                onDateFilterChange={handleDateFilterChange}
                onSortChange={handleSortChange}
              />
            </div>
          </div>
        </div>

        {/* Student Table */}
        <div className="card">
          <div className="card-body px-0 pt-0 pb-2">
            <StudentTable students={filteredStudents} onEdit={handleEdit} onDelete={handleDelete} onStatusChange={handleStatusChange} />
          </div>
        </div>
      </Container>

      {/* Add/Edit Student Modal */}
      <Modal show={showAddModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{editingStudent ? 'Edit Student' : 'Add New Student'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <StudentForm onSubmit={handleAddStudent} student={editingStudent} />
        </Modal.Body>
      </Modal>
    </div>
  )
}

const StudentManagementPage = () => {
  return (
    <>
      <PageMetaData title="Student Management" />
      <StudentManagement />
    </>
  )
}

export default StudentManagementPage
