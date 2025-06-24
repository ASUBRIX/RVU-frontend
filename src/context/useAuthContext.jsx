import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  useEffect(() => {
    try {
      setLoading(true)
      const t = localStorage.getItem('token')
      const u = localStorage.getItem('user')

      if (t && u) {
        try {
          const parsedUser = JSON.parse(u)
          setToken(t)
          setUser(parsedUser)
        } catch (parseError) {
          localStorage.removeItem('user')
          localStorage.removeItem('token')
        }
      }
    } catch (error) {
      console.error('🔐 Error in AuthProvider useEffect:', error)
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = (userObj, jwtToken) => {
    try {
      localStorage.setItem('token', jwtToken)
      localStorage.setItem('user', JSON.stringify(userObj))
      setUser(userObj)
      setToken(jwtToken)
      setError(null)
    } catch (error) {
      console.error('🔐 Login error:', error)
      setError(error.message)
    }
  }

  // Logout: clear everything
  const logout = () => {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      setUser(null)
      setToken(null)
      setError(null)
    } catch (error) {
      console.error('🔐 Logout error:', error)
      setError(error.message)
    }
  }

  const contextValue = {
    user,
    token,
    loading,
    error,
    login,
    logout,
  }

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
}

export function useAuthContext() {
  const context = useContext(AuthContext)

  if (context === undefined) {
    console.error('🔐 useAuthContext must be used within an AuthProvider')
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
