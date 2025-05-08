/**
 * Component SCSS:
 * - Table styles: src/assets/scss/components/_tables.scss
 * - Faculty specific styles: src/assets/scss/components/_faculty-management.scss
 */

import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { BsPencilSquare, BsTrash, BsEye } from 'react-icons/bs';
import { FaLock, FaLockOpen } from 'react-icons/fa';
import FacultyDetails from './FacultyDetails';

const FacultyTable = ({ faculty = [], onEdit, onDelete, onStatusChange }) => {
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [showDetails, setShowDetails] = useState(false);

  const handleStatusChange = (faculty) => {
    const newStatus = faculty.status === 'blocked' ? 'active' : 'blocked';
    onStatusChange(faculty.id, newStatus);
  };

  const handleViewDetails = (faculty) => {
    setSelectedFaculty(faculty);
    setShowDetails(true);
  };

  const handleBack = () => {
    setShowDetails(false);
    setSelectedFaculty(null);
  };

  if (showDetails && selectedFaculty) {
    return (
      <FacultyDetails 
        faculty={selectedFaculty}
        onBack={handleBack}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    );
  }

  return (
    <div className="faculty-management">
      <Card className="faculty-card">
        <Card.Body>
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>ID</th>
                  <th>Designation</th>
                  <th>Status</th>
                  <th className='text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {faculty.map((faculty) => (
                  <tr key={faculty.id}>
                    <td>{faculty.name}</td>
                    <td>{faculty.facultyId}</td>
                    <td>{faculty.designation}</td>
                    <td>
                      <span className={`badge bg-${faculty.status === 'active' ? 'success' : 'secondary'}`}>
                        {faculty.status === 'active' ? 'Active' : 'Blocked'}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action view-btn" onClick={() => handleViewDetails(faculty)}>
                          <BsEye />
                        </button>
                        <button className="btn-action edit-btn" onClick={() => onEdit(faculty)}>
                          <BsPencilSquare />
                        </button>
                        <button className="btn-action delete-btn" onClick={() => onDelete(faculty)}>
                          <BsTrash />
                        </button>
                        <button className="btn-action" onClick={() => handleStatusChange(faculty)}>
                          {faculty.status === 'blocked' ? <FaLockOpen /> : <FaLock />}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {faculty.length === 0 && (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No faculty members found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default FacultyTable; 