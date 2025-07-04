import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import {
  FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaBriefcase,
  FaUserCircle, FaUpload
} from 'react-icons/fa';

const FacultyForm = ({ faculty, onSubmit }) => {
  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    status: 'active',
    qualification: '',
    experience: '',
    avatar: 'default',
    bio: '',
    board_member: false, 
  };

  const [formData, setFormData] = useState(initialFormState);
  const [validated, setValidated] = useState(false);

  useEffect(() => {
    if (faculty) {
      setFormData({
        ...initialFormState,
        ...faculty,
        board_member: Boolean(faculty.board_member), 
      });
    } else {
      setFormData(initialFormState);
    }
  }, [faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({ ...prev, avatar: e.target.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      e.stopPropagation();
      setValidated(true);
      return;
    }
    onSubmit(formData);
  };

  const getAvatarDisplay = () => {
    if (formData.avatar && formData.avatar.startsWith('data:')) {
      return <img src={formData.avatar} alt="avatar" className="rounded-circle" width="120" height="120" />;
    }
    return <FaUserCircle size={80} className="text-primary" />;
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="mb-4">
        <Col md={3} className="d-flex flex-column align-items-center">
          <div className="avatar-preview mb-2">{getAvatarDisplay()}</div>
          <Button variant="outline-success" size="sm" onClick={triggerFileInput} className="w-100">
            <FaUpload className="me-2" /> Upload Photo
          </Button>
          <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileUpload} />
        </Col>
        <Col md={9}>
          <Row className="g-3">
            {/* Name */}
            <Col md={12}>
              <Form.Group controlId="facultyName">
                <Form.Label>Full Name</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light"><FaUser /></InputGroup.Text>
                  <Form.Control required name="name" value={formData.name} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Please enter name.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Email & Phone */}
            <Col md={6}>
              <Form.Group controlId="facultyEmail">
                <Form.Label>Email</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light"><FaEnvelope /></InputGroup.Text>
                  <Form.Control required type="email" name="email" value={formData.email} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Enter a valid email.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="facultyPhone">
                <Form.Label>Phone</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light"><FaPhone /></InputGroup.Text>
                  <Form.Control required name="phone" value={formData.phone} onChange={handleChange} />
                  <Form.Control.Feedback type="invalid">Enter a valid phone.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Department & Designation - Now as Input Fields */}
            <Col md={6}>
              <Form.Group controlId="facultyDepartment">
                <Form.Label>Department</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light"><FaBriefcase /></InputGroup.Text>
                  <Form.Control 
                    required 
                    name="department" 
                    value={formData.department} 
                    onChange={handleChange}
                    placeholder="Enter department name"
                  />
                  <Form.Control.Feedback type="invalid">Please enter department.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="facultyDesignation">
                <Form.Label>Designation</Form.Label>
                <InputGroup hasValidation>
                  <InputGroup.Text className="bg-light"><FaGraduationCap /></InputGroup.Text>
                  <Form.Control 
                    required 
                    name="designation" 
                    value={formData.designation} 
                    onChange={handleChange}
                    placeholder="Enter designation"
                  />
                  <Form.Control.Feedback type="invalid">Please enter designation.</Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
            </Col>

            {/* Qualification & Experience */}
            <Col md={6}>
              <Form.Group controlId="facultyQualification">
                <Form.Label>Qualification</Form.Label>
                <Form.Control required name="qualification" value={formData.qualification} onChange={handleChange} />
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group controlId="facultyExperience">
                <Form.Label>Experience</Form.Label>
                <Form.Control required name="experience" value={formData.experience} onChange={handleChange} />
              </Form.Group>
            </Col>

            {/* Board Member Checkbox */}
            <Col md={12}>
              <Form.Group controlId="facultyBoardMember" className="form-check">
                <Form.Check
                  type="checkbox"
                  label="Member of Board of Directors"
                  checked={formData.board_member}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      board_member: e.target.checked,
                    }))
                  }
                />
              </Form.Group>
            </Col>

            {/* Bio */}
            <Col md={12}>
              <Form.Group controlId="facultyBio">
                <Form.Label>Instructor Bio <span className="text-muted small">(will display on hover)</span></Form.Label>
                <Form.Control
                  as="textarea"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Write a short bio or details about the instructor"
                  maxLength={400}
                />
                <Form.Text muted>
                  {formData.bio.length} / 400 characters
                </Form.Text>
              </Form.Group>
            </Col>

            {/* Status */}
            <Col md={12}>
              <Form.Group controlId="facultyStatus">
                <Form.Label>Status</Form.Label>
                <Form.Select name="status" value={formData.status} onChange={handleChange}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Form.Group>
            </Col>
          </Row>
        </Col>
      </Row>
      <div className="d-flex justify-content-end">
        <Button type="submit" variant="primary">{faculty ? 'Update Faculty' : 'Add Faculty'}</Button>
      </div>
    </Form>
  );
};

export default FacultyForm;