// ---------- FacultyForm.jsx ----------
import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, InputGroup, Modal } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendar, FaBriefcase, FaUserCircle, FaUpload, FaPlus } from 'react-icons/fa';

const FacultyForm = ({ faculty, onSubmit }) => {
  const fileInputRef = useRef(null);

  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    department: 'Computer Science',
    designation: 'Assistant Professor',
    status: 'active',
    qualification: '',
    experience: '',
    avatar: 'default'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [validated, setValidated] = useState(false);

  const [departmentOptions, setDepartmentOptions] = useState([
    'Computer Science', 'Data Science', 'Web Development', 'Database Management',
    'Cybersecurity', 'Mobile Development', 'Artificial Intelligence', 'DevOps & Cloud Computing'
  ]);

  const [designationOptions, setDesignationOptions] = useState([
    'Professor', 'Associate Professor', 'Assistant Professor', 'Lecturer', 'Instructor'
  ]);

  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');

  useEffect(() => {
    if (faculty) {
      setFormData({ ...initialFormState, ...faculty });
    } else {
      setFormData(initialFormState);
    }
  }, [faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleAvatarChange = () => {
    setFormData(prev => ({ ...prev, avatar: 'default' }));
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

  const handleAddDepartment = () => {
    if (newDepartment && !departmentOptions.includes(newDepartment)) {
      setDepartmentOptions([...departmentOptions, newDepartment]);
      setFormData(prev => ({ ...prev, department: newDepartment }));
    }
    setNewDepartment('');
    setShowDepartmentModal(false);
  };

  const handleAddDesignation = () => {
    if (newDesignation && !designationOptions.includes(newDesignation)) {
      setDesignationOptions([...designationOptions, newDesignation]);
      setFormData(prev => ({ ...prev, designation: newDesignation }));
    }
    setNewDesignation('');
    setShowDesignationModal(false);
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
    if (formData.avatar.startsWith('data:')) {
      return <img src={formData.avatar} alt="avatar" className="rounded-circle" width="120" height="120" />;
    }
    return <FaUserCircle size={80} className="text-primary" />;
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={3} className="d-flex flex-column align-items-center">
            <div className="avatar-preview mb-2">{getAvatarDisplay()}</div>
            <Button variant="outline-primary" size="sm" onClick={handleAvatarChange} className="w-100 mb-2">
              <FaUserCircle className="me-2" /> Default Profile
            </Button>
            <Button variant="outline-success" size="sm" onClick={triggerFileInput} className="w-100">
              <FaUpload className="me-2" /> Upload Photo
            </Button>
            <input ref={fileInputRef} type="file" accept="image/*" className="d-none" onChange={handleFileUpload} />
          </Col>
          <Col md={9}>
            <Row className="g-3">
              {/* Full Name */}
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

              {/* Department & Designation */}
              <Col md={6}>
                <Form.Group controlId="facultyDepartment">
                  <Form.Label>Department</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light"><FaBriefcase /></InputGroup.Text>
                    <Form.Select required name="department" value={formData.department} onChange={handleChange}>
                      {departmentOptions.map((d, i) => <option key={i}>{d}</option>)}
                    </Form.Select>
                  </InputGroup>
                  <Button variant="link" size="sm" className="p-0" onClick={() => setShowDepartmentModal(true)}><FaPlus /> Add new</Button>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="facultyDesignation">
                  <Form.Label>Designation</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light"><FaGraduationCap /></InputGroup.Text>
                    <Form.Select required name="designation" value={formData.designation} onChange={handleChange}>
                      {designationOptions.map((d, i) => <option key={i}>{d}</option>)}
                    </Form.Select>
                  </InputGroup>
                  <Button variant="link" size="sm" className="p-0" onClick={() => setShowDesignationModal(true)}><FaPlus /> Add new</Button>
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

      {/* Add Department Modal */}
      <Modal show={showDepartmentModal} onHide={() => setShowDepartmentModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Department</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Department</Form.Label>
            <Form.Control value={newDepartment} onChange={(e) => setNewDepartment(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepartmentModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddDepartment}>Add</Button>
        </Modal.Footer>
      </Modal>

      {/* Add Designation Modal */}
      <Modal show={showDesignationModal} onHide={() => setShowDesignationModal(false)}>
        <Modal.Header closeButton><Modal.Title>Add Designation</Modal.Title></Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>New Designation</Form.Label>
            <Form.Control value={newDesignation} onChange={(e) => setNewDesignation(e.target.value)} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDesignationModal(false)}>Cancel</Button>
          <Button variant="primary" onClick={handleAddDesignation}>Add</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FacultyForm;
