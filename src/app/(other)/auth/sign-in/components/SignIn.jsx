import React, { useState } from 'react';
import { Form, Button, Alert, Spinner } from 'react-bootstrap';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuthContext } from '@/context/useAuthContext';
import { useNotificationContext } from '@/context/useNotificationContext';
import authService from '@/helpers/authService';

const SignIn = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { saveSession } = useAuthContext();
  const [searchParams] = useSearchParams();
  const { showNotification } = useNotificationContext();

  // Login schema
  const loginSchema = yup.object({
    email: yup.string().email('Please enter a valid email').required('Email is required'),
    password_hash: yup.string().required('Password is required')
  });

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const redirectUser = () => {
    const redirectLink = searchParams.get('redirectTo');
    if (redirectLink) navigate(redirectLink);
    else navigate('/');
  };

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      setError(null);
      console.log('Attempting login with:', data.email);

      const responseData = await authService.loginWithEmail({
        email: data.email,
        password_hash: data.password_hash
      });

      console.log('Login response:', responseData);

      if (responseData.auth_key) {
        console.log('Auth key received:', responseData.auth_key.substring(0, 20) + '...');
        
        const sessionData = {
          token: responseData.auth_key,
          user: responseData.user
        };
        
        saveSession(sessionData);
        
        showNotification({
          message: 'Successfully logged in!',
          variant: 'success'
        });
        
        redirectUser();
      } else {
        setError('Invalid response from server');
        console.error('No auth_key in response:', responseData);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.error || 'Login failed. Please check your credentials.');
      
      showNotification({
        message: err.response?.data?.error || 'Login failed',
        variant: 'danger'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-form">
      {error && (
        <Alert variant="danger" className="mb-3">
          {error}
        </Alert>
      )}

      <Form onSubmit={handleSubmit(onSubmit)}>
        <Form.Group className="mb-3">
          <Form.Label>Email address</Form.Label>
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

        <Form.Group className="mb-3">
          {/* <Form.Label className="d-flex justify-content-between align-items-center">
            <span>Password</span>
            <a href="/auth/forgot-password" className="text-decoration-underline">Forgot password?</a>
          </Form.Label> */}
          <Form.Control
            type="password"
            placeholder="Enter your password"
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
              Signing in...
            </>
          ) : (
            'Sign In'
          )}
        </Button>
      </Form>
    </div>
  );
};

export default SignIn; 