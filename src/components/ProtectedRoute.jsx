import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/useAuthContext'

const ProtectedRoute = ({ allowedRoles, children }) => {
  const { user, loading } = useAuthContext()
  const location = useLocation()

  if (loading) return null 

  
  if (!user) {
    if (allowedRoles.includes('admin')) {
      return <Navigate to="/auth/admin-login" state={{ from: location }} replace />
    }
    return <Navigate to="/auth/mobile-login" state={{ from: location }} replace />
  }

  
  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/" replace />
  }

  return children
}

export default ProtectedRoute
