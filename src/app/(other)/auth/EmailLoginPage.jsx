import AuthLayout from './components/AuthLayout'
import { Col } from 'react-bootstrap'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '@/helpers/authService'

export default function EmailLoginPage() {
  const [fields, setFields] = useState({ email: '', password_hash: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value })

 const handleLogin = async () => {
  try {
    const response = await authService.loginWithEmail(fields);
    const user = response.user;

    console.log(response.accessToken);
    

    // Save token
    if (response.accessToken) {
      localStorage.setItem('accessToken', response.accessToken);
    }
    

    // Redirect based on role
    if (user.role === 'admin') {
      navigate('/admin/dashboard');
    } else if (user.role === 'student') {
      navigate('/');
    } else if (user.role === 'instructor') {
      navigate('/instructor/dashboard');
    } else {
      navigate('/');
    }
  } catch (e) {
    setErr('Invalid email or password.');
  }
};


  return (
    <AuthLayout>
      {/* <Col xs={12} lg={6} className="m-auto"> */}
        <div className="p-4">
          <h2>Sign in with Email</h2>
          <label>Email</label>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            value={fields.email}
            onChange={handleChange}
            placeholder="Email"
            autoComplete="username"
          />
          <label>Password</label>
          <input
            name="password_hash"
            type="password"
            className="form-control mb-3"
            value={fields.password_hash}
            onChange={handleChange}
            placeholder="Password"
            autoComplete="current-password"
          />
          <button className="btn btn-primary w-100" onClick={handleLogin}>Sign In</button>
          {err && <div style={{ color: 'red', marginTop: 8 }}>{err}</div>}
        </div>
      {/* </Col> */}
    </AuthLayout>
  )
}
