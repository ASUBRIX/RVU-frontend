import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import authService from '@/helpers/authService'
import { useAuthContext } from '../../../context/useAuthContext'
import './AdminLoginPage.css'
import AuthLayout from '../../(other)/auth/components/AuthLayout'

export default function AdminLoginPage() {
  const [fields, setFields] = useState({ email: '', password: '' })
  const [err, setErr] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useAuthContext()

  const handleChange = (e) => {
    setFields({ ...fields, [e.target.name]: e.target.value })
  }


  
  
  const handleLogin = async (e) => {
    e.preventDefault()
    setErr('')
    setLoading(true)
    try {
      const response = await authService.adminLogin({
        email: fields.email,
        password_hash: fields.password,
      })
      const user = response.user
      if (user && user.role === 'admin' && response.accessToken) {
        login(user, response.accessToken)
        navigate('/admin/dashboard')
      } else {
        setErr('Access denied: Only admin can login here.')
      }
    } catch (error) {
      setErr('Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthLayout>
      <div className="admin-login-page">
        <div className="admin-login-form-wrapper">
          <form className="admin-login-form" onSubmit={handleLogin}>
            <h2>Admin Login</h2>
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={fields.email}
              onChange={handleChange}
              placeholder="Enter admin email"
              required
            />
            <label>Password</label>
            <input
              type="password"
              name="password"
              value={fields.password}
              onChange={handleChange}
              placeholder="Enter password"
              required
            />
            <button type="submit" disabled={loading}>
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
            {err && <div className="admin-login-error">{err}</div>}
          </form>
        </div>
      </div>
    </AuthLayout>
  )
}

