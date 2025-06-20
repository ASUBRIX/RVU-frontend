import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap } from 'react-icons/fa';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);

  const initialFormState = {
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    status: 'active',
    qualification: '',
    avatar: 'default'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (student) {
      console.log("Editing student:", student); // Debug log
      setFormData({ 
        ...initialFormState, 
        ...student,
        first_name: student.first_name || student.firstName || '',
        last_name: student.last_name || student.lastName || '',
        qualification: student.program || student.qualification || '',
        // Preserve enrollment ID and other important fields
        enrollment_id: student.enrollment_id || student.enrollmentId || '',
        user_id: student.user_id || student.userId || null,
        id: student.id || null
      });
    } else {
      setFormData(initialFormState);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    // Prepare data for submission
    const submitData = {
      ...formData,
      program: formData.qualification, // Backend expects 'program' field
      // Preserve important fields during edit
      ...(student && {
        id: student.id,
        enrollment_id: student.enrollment_id || student.enrollmentId,
        user_id: student.user_id || student.userId,
        enrollment_date: student.enrollment_date || student.enrollmentDate
      })
    };

    console.log('Submit data:', submitData); // Debug log
    onSubmit(submitData);
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="studentFirstName">
            <Form.Label>First Name</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                required
                type="text"
                placeholder="Enter first name"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid first name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentLastName">
            <Form.Label>Last Name</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text><FaUser /></InputGroup.Text>
              <Form.Control
                required
                type="text"
                placeholder="Enter last name"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid last name.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentEmail">
            <Form.Label>Email</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text><FaEnvelope /></InputGroup.Text>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid email.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentPhone">
            <Form.Label>Phone</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text><FaPhone /></InputGroup.Text>
              <Form.Control
                required
                type="text"
                placeholder="Enter phone number"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a valid phone number.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentQualification">
            <Form.Label>Qualification</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text><FaGraduationCap /></InputGroup.Text>
              <Form.Control
                required
                type="text"
                placeholder="Enter qualification (e.g., Bachelor of Computer Science)"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide a qualification.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentStatus">
            <Form.Label>Status</Form.Label>
            <Form.Select
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </Form.Select>
          </Form.Group>
        </Col>

        {/* Show enrollment ID for editing (read-only) */}
        {student && (
          <Col md={12}>
            <Form.Group controlId="studentEnrollmentId">
              <Form.Label>Student ID</Form.Label>
              <Form.Control
                type="text"
                value={student.enrollment_id || student.enrollmentId || 'Not assigned'}
                readOnly
                className="bg-light"
              />
              <Form.Text className="text-muted">
                Student ID is automatically assigned and cannot be changed.
              </Form.Text>
            </Form.Group>
          </Col>
        )}
      </Row>
      
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="outline-secondary" onClick={onCancel}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          {student ? 'Update Student' : 'Add Student'}
        </Button>
      </div>
    </Form>
  );
};

export default StudentForm;