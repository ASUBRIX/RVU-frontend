import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Col } from 'react-bootstrap';
import authService from '@/helpers/authService';
import AuthLayout from './components/AuthLayout';
import { useAuthContext } from '../../../context/useAuthContext';

export default function RegisterDetailsPage() {
  const location = useLocation();
  const mobile = location.state?.mobile || '';
  const { login } = useAuthContext(); 
  const [fields, setFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password_hash: '',
    phone_number: mobile,
    role: 'student'
  });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(fields);
      if (res.user && res.accessToken) {
        login(res.user, res.accessToken);    // <-- Save to context/localStorage
        navigate('/home');                   // or dashboard as per your route config
      } else {
        setErr('Registration failed.');
      }
    } catch (e) {
      setErr('Registration failed.');
    }
  };

  return (
    <AuthLayout>
      <Col xs={12} lg={6} className="m-auto">
        <div className="p-5">
          <h2 className="mb-4">Complete Registration</h2>
          <form onSubmit={handleSubmit}>
            <input
              className="form-control mb-3"
              name="first_name"
              value={fields.first_name}
              onChange={handleChange}
              placeholder="First Name"
              required
            />
            <input
              className="form-control mb-3"
              name="last_name"
              value={fields.last_name}
              onChange={handleChange}
              placeholder="Last Name"
              required
            />
            <input
              className="form-control mb-3"
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Email"
              type="email"
              required
            />
            <input
              className="form-control mb-3"
              name="password_hash"
              type="password"
              value={fields.password_hash}
              onChange={handleChange}
              placeholder="Password"
              required
            />
            <button className="btn btn-primary w-100" type="submit">
              Register
            </button>
            {err && <div className="text-danger mt-3">{err}</div>}
          </form>
        </div>
      </Col>
    </AuthLayout>
  );
}
