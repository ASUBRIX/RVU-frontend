// RegisterDetailsPage.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import authService from '@/helpers/authService';

export default function RegisterDetailsPage() {
  const location = useLocation();
  const mobile = location.state?.mobile || '';
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

  const handleSubmit = async () => {
    try {
      await authService.register(fields);
      navigate('/dashboard');
    } catch (e) {
      setErr('Registration failed.');
    }
  };

  return (
    <div>
      <h2>Complete Registration</h2>
      <input name="first_name" value={fields.first_name} onChange={handleChange} placeholder="First Name" />
      <input name="last_name" value={fields.last_name} onChange={handleChange} placeholder="Last Name" />
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
      <input name="password_hash" type="password" value={fields.password_hash} onChange={handleChange} placeholder="Password" />
      <button onClick={handleSubmit}>Register</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
    </div>
  );
}
