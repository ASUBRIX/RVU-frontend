import React, { useState, useEffect, useRef } from 'react';
import { Form, Row, Col, Button, InputGroup } from 'react-bootstrap';
import { FaUser, FaEnvelope, FaPhone, FaGraduationCap, FaCalendar, FaBook } from 'react-icons/fa';

const StudentForm = ({ student, onSubmit, onCancel }) => {
  const fileInputRef = useRef(null);

  const initialFormState = {
    first_name: '',
    last_name: '',
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

  useEffect(() => {
    if (student) {
      setFormData({ ...initialFormState, ...student });
    } else {
      setFormData(initialFormState);
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCourseChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions).map(option => option.value);
    setFormData(prev => ({ ...prev, courses: selectedOptions }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const form = e.currentTarget;

    if (!form.checkValidity()) {
      e.stopPropagation();
      setValidated(true);
      return;
    }

    console.log('form data',formData);
    

    onSubmit(formData);
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
                placeholder="Enter phone"
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
              <InputGroup.Text><FaCalendar /></InputGroup.Text>
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
            <Form.Select
              required
              name="program"
              value={formData.program}
              onChange={handleChange}
            >
              <option>Bachelor of Computer Science</option>
              <option>Bachelor of Data Science</option>
              <option>Bachelor of Software Engineering</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="studentSemester">
            <Form.Label>Semester</Form.Label>
            <Form.Select
              required
              name="semester"
              value={formData.semester}
              onChange={handleChange}
            >
              <option>1st Semester</option>
              <option>2nd Semester</option>
              <option>3rd Semester</option>
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={6}>
          <Form.Group controlId="studentYear">
            <Form.Label>Year</Form.Label>
            <Form.Select
              required
              name="year"
              value={formData.year}
              onChange={handleChange}
            >
              <option>1st Year</option>
              <option>2nd Year</option>
              <option>3rd Year</option>
            </Form.Select>
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
        <Col md={12}>
          <Form.Group controlId="studentCourses">
            <Form.Label>Courses</Form.Label>
            <Form.Select
              required
              multiple
              name="courses"
              value={formData.courses}
              onChange={handleCourseChange}
            >
              <option>Web Development</option>
              <option>Machine Learning</option>
              <option>Cloud Computing</option>
              <option>Data Structures</option>
            </Form.Select>
          </Form.Group>
        </Col>
      </Row>
      <div className="d-flex justify-content-end gap-2 mt-4">
        <Button variant="outline-secondary" onClick={onCancel}>Cancel</Button>
        <Button variant="primary" type="submit">{student ? 'Update Student' : 'Add Student'}</Button>
      </div>
    </Form>
  );
};

export default StudentForm;



