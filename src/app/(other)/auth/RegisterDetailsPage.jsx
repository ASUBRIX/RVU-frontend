import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AuthLayout from './components/AuthLayout';
import { useAuthContext } from '../../../context/useAuthContext';
import authService from '@/helpers/authService';
import './RegisterDetailsPage.css'; // Import the dedicated CSS

export default function RegisterDetailsPage() {
  const location = useLocation();
  const mobile = location.state?.mobile || '';
  const { login } = useAuthContext();
  const navigate = useNavigate();

  const [fields, setFields] = useState({
    first_name: '',
    last_name: '',
    email: '',
    password_hash: '',
    phone_number: mobile,
    role: 'student',
  });

  const [err, setErr] = useState('');

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await authService.register(fields);
      if (res.user && res.accessToken) {
        login(res.user, res.accessToken);
        navigate('/home');
      } else {
        setErr('Registration failed.');
      }
    } catch (e) {
      setErr('Registration failed.');
    }
  };

  return (
    <AuthLayout>
      <div className="register-wrapper">
        <div className="register-box">
          <h2 className="title-gradient text-center">Complete Registration</h2>
          <p className="register-subtext text-center">
            Please enter your details to complete registration.
          </p>
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
              type="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Email"
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
            <button className="btn custom-signin-btn" type="submit">
              Register
            </button>
            {err && <div className="error-text">{err}</div>}
          </form>
        </div>
      </div>
    </AuthLayout>
  );
}
