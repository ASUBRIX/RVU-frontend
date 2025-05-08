import React, { useState } from 'react';
import { Form, Button, Alert, Spinner, Col, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useNotificationContext } from '@/context/useNotificationContext';
import authService from '@/helpers/authService';

const SignUpForm = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { showNotification } = useNotificationContext();

  // Registration schema
  const signUpSchema = yup.object({
    first_name: yup.string().required('First name is required'),
    last_name: yup.string().required('Last name is required'),
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    phone_number: yup.string().required('Phone number is required'),
    password_hash: yup.string()
      .min(8, 'Password must be at least 8 characters')
      .required('Password is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(signUpSchema)
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting registration with:', data);

      const userData = {
        first_name: data.first_name,
        email: data.email,
        password_hash: data.password_hash,
        phone_number: data.phone_number,
        last_name: data.last_name,
        role: 'student' // Always set role to student
      };

      const responseData = await authService.register(userData);
      console.log('Registration response:', responseData);

      showNotification({
        message: 'Registration successful! Please sign in.',
        variant: 'success'
      });
      
      navigate('/auth/sign-in');
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
      
      showNotification({
        message: err.response?.data?.error || 'Registration failed',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-form">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your first name"
                {...register('first_name')}
                isInvalid={!!errors.first_name}
              />
              {errors.first_name && (
                <Form.Control.Feedback type="invalid">
                  {errors.first_name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your last name"
                {...register('last_name')}
                isInvalid={!!errors.last_name}
              />
              {errors.last_name && (
                <Form.Control.Feedback type="invalid">
                  {errors.last_name.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                placeholder="Enter your email"
                {...register('email')}
                isInvalid={!!errors.email}
              />
              {errors.email && (
                <Form.Control.Feedback type="invalid">
                  {errors.email.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
          
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter your phone number"
                {...register('phone_number')}
                isInvalid={!!errors.phone_number}
              />
              {errors.phone_number && (
                <Form.Control.Feedback type="invalid">
                  {errors.phone_number.message}
                </Form.Control.Feedback>
              )}
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Password</Form.Label>
          <Form.Control
            type="password"
            placeholder="Create a password"
            {...register('password_hash')}
            isInvalid={!!errors.password_hash}
          />
          {errors.password_hash && (
            <Form.Control.Feedback type="invalid">
              {errors.password_hash.message}
            </Form.Control.Feedback>
          )}
        </Form.Group>

        <Button 
          variant="primary" 
          type="submit" 
          className="w-100 mt-3" 
          disabled={loading}
        >
          {loading ? (
            <>
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-2"
              />
              Creating Account...
            </>
          ) : (
            'Sign Up'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default SignUpForm; 