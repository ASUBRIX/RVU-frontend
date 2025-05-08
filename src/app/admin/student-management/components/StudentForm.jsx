import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendar, FaBook, FaUserCircle, FaUpload } from 'react-icons/fa';

const StudentForm = ({ student, onSubmit }) => {
  const fileInputRef = useRef(null);
  
  const initialFormState = {
    name: '',
    email: '',
    phone: '',
    enrollmentDate: '',
    status: 'active',
    courses: [],
    program: 'Bachelor of Computer Science',
    semester: '1st Semester',
    year: '1st Year',
    avatar: 'default'
  };

  const [formData, setFormData] = useState(initialFormState);
  const [validated, setValidated] = useState(false);
  
  // Sample program options
  const programOptions = [
    'Bachelor of Computer Science',
    'Bachelor of Data Science',
    'Bachelor of Information Technology',
    'Bachelor of Software Engineering',
    'Bachelor of Cybersecurity'
  ];

  // Sample semester options
  const semesterOptions = [
    '1st Semester',
    '2nd Semester',
    '3rd Semester',
    '4th Semester',
    '5th Semester',
    '6th Semester',
    '7th Semester',
    '8th Semester'
  ];

  // Sample year options
  const yearOptions = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

  // Sample course options
  const courseOptions = [
    { id: 1, name: 'Computer Science 101' },
    { id: 2, name: 'Data Structures' },
    { id: 3, name: 'Web Development' },
    { id: 4, name: 'Database Systems' },
    { id: 5, name: 'Software Engineering' },
    { id: 6, name: 'Machine Learning' },
    { id: 7, name: 'Network Security' },
    { id: 8, name: 'Mobile Development' },
    { id: 9, name: 'Cloud Computing' },
    { id: 10, name: 'Artificial Intelligence' }
  ];

  // If student prop exists, initialize form with student data
  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        email: student.email || '',
        phone: student.phone || '',
        enrollmentDate: student.enrollmentDate || '',
        status: student.status || 'active',
        courses: student.courses || [],
        program: student.program || 'Bachelor of Computer Science',
        semester: student.semester || '1st Semester',
        year: student.year || '1st Year',
        avatar: student.avatar || 'default'
      });
    } else {
      setFormData(initialFormState);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleCourseChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prevState => ({
      ...prevState,
      courses: selectedOptions
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
      return <img src={formData.avatar} alt="Student avatar" className="rounded-circle" width="120" height="120" />;
    }
  };

  return (
    <Form noValidate validated={validated} onSubmit={handleSubmit}>
      <Row className="g-3">
        <Col md={6}>
          <Form.Group controlId="studentName">
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
          <Form.Group controlId="studentEmail">
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
          <Form.Group controlId="studentPhone">
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
          <Form.Group controlId="enrollmentDate">
            <Form.Label>Enrollment Date</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-light">
                <FaCalendar />
              </InputGroup.Text>
              <Form.Control
                required
                type="date"
                name="enrollmentDate"
                value={formData.enrollmentDate}
                onChange={handleChange}
              />
              <Form.Control.Feedback type="invalid">
                Please provide an enrollment date.
              </Form.Control.Feedback>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentProgram">
            <Form.Label>Program</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-light">
                <FaGraduationCap />
              </InputGroup.Text>
              <Form.Select
                required
                name="program"
                value={formData.program}
                onChange={handleChange}
              >
                {programOptions.map((program, index) => (
                  <option key={index} value={program}>
                    {program}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentYear">
            <Form.Label>Year</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-light">
                <FaGraduationCap />
              </InputGroup.Text>
              <Form.Select
                required
                name="year"
                value={formData.year}
                onChange={handleChange}
              >
                {yearOptions.map((year, index) => (
                  <option key={index} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group controlId="studentSemester">
            <Form.Label>Semester</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-light">
                <FaGraduationCap />
              </InputGroup.Text>
              <Form.Select
                required
                name="semester"
                value={formData.semester}
                onChange={handleChange}
              >
                {semesterOptions.map((semester, index) => (
                  <option key={index} value={semester}>
                    {semester}
                  </option>
                ))}
              </Form.Select>
            </InputGroup>
          </Form.Group>
        </Col>
        
        <Col md={12}>
          <Form.Group controlId="studentCourses">
            <Form.Label>Courses</Form.Label>
            <InputGroup hasValidation>
              <InputGroup.Text className="bg-light">
                <FaBook />
              </InputGroup.Text>
              <Form.Select
                required
                multiple
                name="courses"
                value={formData.courses}
                onChange={handleCourseChange}
                style={{ height: '120px' }}
              >
                {courseOptions.map(course => (
                  <option key={course.id} value={course.name}>
                    {course.name}
                  </option>
                ))}
              </Form.Select>
              <Form.Control.Feedback type="invalid">
                Please select at least one course.
              </Form.Control.Feedback>
            </InputGroup>
            <Form.Text className="text-muted">
              Hold Ctrl (or Cmd) to select multiple courses
            </Form.Text>
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
              <option value="blocked">Blocked</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>

      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="outline-secondary" onClick={() => onSubmit(null)}>
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