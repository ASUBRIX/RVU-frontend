import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '@/helpers/authService';

export default function EmailLogin() {
  const [fields, setFields] = useState({ email: '', password_hash: '' });
  const [err, setErr] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value });

  const handleLogin = async () => {
    try {
      await authService.loginWithEmail(fields);
      navigate('/dashboard');
    } catch (e) {
      setErr('Invalid email or password.');
    }
  };

  return (
    <div>
      <h2>Sign in with Email</h2>
      <input name="email" value={fields.email} onChange={handleChange} placeholder="Email" />
      <input name="password_hash" type="password" value={fields.password_hash} onChange={handleChange} placeholder="Password" />
      <button onClick={handleLogin}>Sign In</button>
      {err && <div style={{ color: 'red' }}>{err}</div>}
    </div>
  );
}
