import { useAuthContext } from '../context/useAuthContext';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, loading, token } = useAuthContext();

  // Development mode bypass - set this to false in production
  const DEVELOPMENT_MODE = true;

  if (DEVELOPMENT_MODE) {
    console.log('🚧 DEVELOPMENT MODE: Bypassing authentication');
    return children;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-2 text-muted">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!user || !token) {
    console.log('🔒 User not authenticated, redirecting to login');
    return <Navigate to="/auth/admin-login" replace />;
  }

  // Check role-based access
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    console.log('🚫 User role not authorized:', user.role, 'Required:', allowedRoles);
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;