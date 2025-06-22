import { Navigate, useLocation } from 'react-router-dom'
import { useAuthContext } from '../context/useAuthContext'

const ProtectedRoute = ({ allowedRoles = [], children }) => {
  console.log('🔍 ProtectedRoute Debug - Start');
  
  try {
    // Debug: Check location
    const location = useLocation();
    console.log('📍 Location:', location);

    // Debug: Check if useAuthContext is working
    console.log('🔐 Calling useAuthContext...');
    const authContext = useAuthContext();
    console.log('🔐 Auth Context:', authContext);

    // Safe destructuring with debugging
    const user = authContext?.user;
    const token = authContext?.token;
    console.log('👤 User:', user);
    console.log('🎫 Token:', token);

    // Debug: Check allowedRoles
    console.log('🛡️ Allowed Roles:', allowedRoles);
    const roles = Array.isArray(allowedRoles) ? allowedRoles : [];
    console.log('🛡️ Processed Roles:', roles);

    // Debug: User authentication check
    if (!user) {
      console.log('❌ No user found, redirecting...');
      if (roles.includes('admin')) {
        console.log('🔄 Redirecting to admin login');
        return <Navigate to="/auth/admin-login" state={{ from: location }} replace />;
      }
      console.log('🔄 Redirecting to mobile login');
      return <Navigate to="/auth/mobile-login" state={{ from: location }} replace />;
    }

    // Debug: Role checking
    console.log('👤 User Role:', user?.role);
    if (roles.length > 0 && !roles.includes(user?.role)) {
      console.log('🚫 User role not allowed, redirecting to home');
      return <Navigate to="/" replace />;
    }

    console.log('✅ Access granted, rendering children');
    return children;
    
  } catch (error) {
    console.error('💥 ProtectedRoute Error:', error);
    console.error('💥 Error Stack:', error.stack);
    console.error('💥 Error Name:', error.name);
    console.error('💥 Error Message:', error.message);
    
    // Fallback UI
    return (
      <div style={{ 
        padding: '20px', 
        background: '#ffe6e6', 
        border: '1px solid #ff9999',
        borderRadius: '5px',
        margin: '20px'
      }}>
        <h3 style={{ color: '#cc0000' }}>Protected Route Error</h3>
        <p><strong>Error:</strong> {error.message}</p>
        <p><strong>Type:</strong> {error.name}</p>
        <details>
          <summary>Full Error Details</summary>
          <pre>{error.stack}</pre>
        </details>
        <button 
          onClick={() => window.location.href = '/auth/admin-login'}
          style={{
            background: '#cc0000',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '3px',
            cursor: 'pointer'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }
};

export default ProtectedRoute;