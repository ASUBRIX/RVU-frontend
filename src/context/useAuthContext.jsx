import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  console.log('🔐 AuthProvider - Initializing');
  
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true) // Add loading state
  const [error, setError] = useState(null)

  // Get token and user from local storage
  useEffect(() => {
    console.log('🔐 AuthProvider - useEffect triggered');
    
    try {
      setLoading(true);
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user')
      
      console.log('🔐 Token from localStorage:', t ? 'EXISTS' : 'NULL');
      console.log('🔐 User from localStorage:', u ? 'EXISTS' : 'NULL');
      
      if (t && u) {
        try {
          const parsedUser = JSON.parse(u);
          console.log('🔐 Parsed User:', parsedUser);
          setToken(t)
          setUser(parsedUser)
        } catch (parseError) {
          console.error('🔐 Error parsing user from localStorage:', parseError);
          localStorage.removeItem('user');
          localStorage.removeItem('token');
        }
      }
    } catch (error) {
      console.error('🔐 Error in AuthProvider useEffect:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [])

  // Login: save to localStorage and state
  const login = (userObj, jwtToken) => {
    try {
      console.log('🔐 Login called:', { userObj, jwtToken });
      localStorage.setItem('token', jwtToken)
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      setToken(jwtToken)
      setError(null)
    } catch (error) {
      console.error('🔐 Login error:', error);
      setError(error.message);
    }
  }

  // Logout: clear everything
  const logout = () => {
    try {
      console.log('🔐 Logout called');
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setToken(null)
      setError(null)
    } catch (error) {
      console.error('🔐 Logout error:', error);
      setError(error.message);
    }
  }

  const contextValue = { 
    user, 
    token, 
    loading, 
    error, 
    login, 
    logout 
  };

  console.log('🔐 AuthProvider - Context Value:', contextValue);

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export function useAuthContext() {
  console.log('🔐 useAuthContext called');
  
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    console.error('🔐 useAuthContext must be used within an AuthProvider');
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  
  console.log('🔐 useAuthContext returning:', context);
  return context;
}