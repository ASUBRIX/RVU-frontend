import AuthLayout from '../../(other)/auth/components/AuthLayout'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '@/helpers/authService'
import { useAuthContext } from '../../../context/useAuthContext' 

export default function AdminLoginPage() {
  const [fields, setFields] = useState({ email: '', password_hash: '' })
  const [err, setErr] = useState('')
  const navigate = useNavigate()
  const { login } = useAuthContext() 

  const handleChange = (e) =>
    setFields({ ...fields, [e.target.name]: e.target.value })

  const handleLogin = async () => {
    try {
      const response = await authService.loginWithEmail(fields)
      const user = response.user
      if (response.user && response.accessToken) {
        login(response.user, response.accessToken)
      }
      if (user.role === 'admin') {
        navigate('/admin/dashboard')
      } else if (user.role === 'student') {
        navigate('/')
      } else if (user.role === 'instructor') {
        navigate('/instructor/dashboard')
      } else {
        navigate('/')
      }
    } catch (e) {
      setErr('Invalid email or password.')
    }
  }

  return (
    <AuthLayout>
      <div className="email-login-wrapper">
        <div className="email-login-box">
          <h2 className="mb-4 text-center">Sign In</h2>
          <label className="form-label">Email</label>
          <input
            name="email"
            type="email"
            className="form-control mb-3"
            value={fields.email}
            onChange={handleChange}
            placeholder="Enter your email"
            autoComplete="username"
          />
          <label className="form-label">Password</label>
          <input
            name="password_hash"
            type="password"
            className="form-control mb-3"
            value={fields.password_hash}
            onChange={handleChange}
            placeholder="Enter your password"
            autoComplete="current-password"
          />
          <button className="btn btn-primary w-100 custom-signin-btn" onClick={handleLogin}>
            Sign In
          </button>
          {err && <div className="error-msg">{err}</div>}
        </div>
      </div>
    </AuthLayout>
  )
}

