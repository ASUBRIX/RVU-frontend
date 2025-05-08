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
  
  // State for departments and designations
  const [departmentOptions, setDepartmentOptions] = useState([
    'Computer Science',
    'Data Science',
    'Web Development',
    'Database Management',
    'Cybersecurity',
    'Mobile Development',
    'Artificial Intelligence',
    'DevOps & Cloud Computing'
  ]);

  const [designationOptions, setDesignationOptions] = useState([
    'Professor',
    'Associate Professor',
    'Assistant Professor',
    'Lecturer',
    'Instructor'
  ]);

  // State for adding new options
  const [showDepartmentModal, setShowDepartmentModal] = useState(false);
  const [showDesignationModal, setShowDesignationModal] = useState(false);
  const [newDepartment, setNewDepartment] = useState('');
  const [newDesignation, setNewDesignation] = useState('');

  // Initialize form data when editing
  useEffect(() => {
    if (faculty) {
      setFormData({
        name: faculty.name || '',
        email: faculty.email || '',
        phone: faculty.phone || '',
        department: faculty.department || 'Computer Science',
        designation: faculty.designation || 'Assistant Professor',
        status: faculty.status || 'active',
        qualification: faculty.qualification || '',
        experience: faculty.experience || '',
        avatar: faculty.avatar || 'default',
        joiningDate: faculty.joiningDate || ''
      });
    } else {
      setFormData(initialFormState);
    }
  }, [faculty]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleAvatarChange = () => {
    setFormData(prevState => ({
      ...prevState,
      avatar: 'default'
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prevState => ({
          ...prevState,
          avatar: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  // Handle adding new department
  const handleAddDepartment = () => {
    if (newDepartment && !departmentOptions.includes(newDepartment)) {
      setDepartmentOptions([...departmentOptions, newDepartment]);
      setFormData(prevState => ({
        ...prevState,
        department: newDepartment
      }));
      setNewDepartment('');
      setShowDepartmentModal(false);
    }
  };

  // Handle adding new designation
  const handleAddDesignation = () => {
    if (newDesignation && !designationOptions.includes(newDesignation)) {
      setDesignationOptions([...designationOptions, newDesignation]);
      setFormData(prevState => ({
        ...prevState,
        designation: newDesignation
      }));
      setNewDesignation('');
      setShowDesignationModal(false);
    }
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
    if (formData.avatar === 'default' || formData.avatar === 'default-male' || formData.avatar === 'default-female' || formData.avatar === 'default-neutral') {
      return <FaUserCircle size={80} className="text-primary" />;
    } else if (formData.avatar && formData.avatar.startsWith('data:')) {
      return <img src={formData.avatar} alt="Uploaded avatar" className="rounded-circle" width="120" height="120" />;
    } else {
      return <img src={formData.avatar} alt="Faculty avatar" className="rounded-circle" width="120" height="120" />;
    }
  };

  return (
    <>
      <Form noValidate validated={validated} onSubmit={handleSubmit}>
        <Row className="mb-4">
          <Col md={3} className="d-flex flex-column align-items-center">
            <div className="position-relative mb-3 d-flex justify-content-center align-items-center" style={{ width: 120, height: 120, border: '1px solid #ddd', borderRadius: '50%' }}>
              {getAvatarDisplay()}
            </div>
            <div className="mb-3">
              <Button 
                variant="outline-primary"
                size="sm"
                onClick={handleAvatarChange}
                title="Reset to default avatar"
                className="w-100"
              >
                <FaUserCircle className="me-2" /> Default Profile
              </Button>
            </div>
            <Button 
              variant="outline-success" 
              size="sm" 
              className="w-100"
              onClick={triggerFileInput}
            >
              <FaUpload className="me-2" /> Upload Photo
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              className="d-none"
              accept="image/*"
              onChange={handleFileUpload}
            />
            <Form.Text className="text-muted mt-1 text-center">
              PNG, JPG (max. 1MB)
            </Form.Text>
          </Col>
          <Col md={9}>
            <Row className="g-3">
              <Col md={12}>
                <Form.Group controlId="facultyName">
                  <Form.Label>Full Name</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaUser />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter full name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide a valid name.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="facultyEmail">
                  <Form.Label>Email</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaEnvelope />
                    </InputGroup.Text>
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
                <Form.Group controlId="facultyPhone">
                  <Form.Label>Phone Number</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaPhone />
                    </InputGroup.Text>
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
                <Form.Group controlId="facultyDepartment">
                  <Form.Label>Department</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaBriefcase />
                    </InputGroup.Text>
                    <Form.Select
                      required
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                    >
                      {departmentOptions.map((dept, index) => (
                        <option key={index} value={dept}>
                          {dept}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Please select a department.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button 
                    variant="link"
                    size="sm"
                    className="p-0 mt-1"
                    onClick={() => setShowDepartmentModal(true)}
                  >
                    <FaPlus size={12} className="me-1" /> Add new
                  </Button>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="facultyDesignation">
                  <Form.Label>Designation</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaGraduationCap />
                    </InputGroup.Text>
                    <Form.Select
                      required
                      name="designation"
                      value={formData.designation}
                      onChange={handleChange}
                    >
                      {designationOptions.map((designation, index) => (
                        <option key={index} value={designation}>
                          {designation}
                        </option>
                      ))}
                    </Form.Select>
                    <Form.Control.Feedback type="invalid">
                      Please select a designation.
                    </Form.Control.Feedback>
                  </InputGroup>
                  <Button 
                    variant="link"
                    size="sm"
                    className="p-0 mt-1"
                    onClick={() => setShowDesignationModal(true)}
                  >
                    <FaPlus size={12} className="me-1" /> Add new
                  </Button>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="facultyQualification">
                  <Form.Label>Qualification</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaGraduationCap />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter qualification"
                      name="qualification"
                      value={formData.qualification}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide qualification details.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={6}>
                <Form.Group controlId="facultyExperience">
                  <Form.Label>Experience</Form.Label>
                  <InputGroup hasValidation>
                    <InputGroup.Text className="bg-light">
                      <FaBriefcase />
                    </InputGroup.Text>
                    <Form.Control
                      required
                      type="text"
                      placeholder="Enter years of experience"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                    />
                    <Form.Control.Feedback type="invalid">
                      Please provide experience details.
                    </Form.Control.Feedback>
                  </InputGroup>
                </Form.Group>
              </Col>
              
              <Col md={faculty ? 6 : 12}>
                <Form.Group controlId="facultyStatus">
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
              
              {faculty && (
                <Col md={6}>
                  <Form.Group controlId="joiningDate">
                    <Form.Label>Joining Date</Form.Label>
                    <InputGroup>
                      <InputGroup.Text className="bg-light">
                        <FaCalendar />
                      </InputGroup.Text>
                      <Form.Control
                        type="date"
                        name="joiningDate"
                        value={formData.joiningDate}
                        onChange={handleChange}
                      />
                    </InputGroup>
                  </Form.Group>
                </Col>
              )}
            </Row>
          </Col>
        </Row>

        <div className="d-flex justify-content-end gap-2 mt-3">
          <Button variant="outline-secondary" onClick={() => onSubmit(null)}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {faculty ? 'Update Faculty' : 'Add Faculty'}
          </Button>
        </div>
      </Form>

      {/* Modal for adding new department */}
      <Modal show={showDepartmentModal} onHide={() => setShowDepartmentModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Department</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Department Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter department name"
              value={newDepartment}
              onChange={(e) => setNewDepartment(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDepartmentModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDepartment}>
            Add Department
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal for adding new designation */}
      <Modal show={showDesignationModal} onHide={() => setShowDesignationModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Designation</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group className="mb-3">
            <Form.Label>Designation Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter designation name"
              value={newDesignation}
              onChange={(e) => setNewDesignation(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDesignationModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDesignation}>
            Add Designation
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default FacultyForm;