import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)

  // Get token and user from local storage
  useEffect(() => {
    const t = localStorage.getItem('token')
    const u = localStorage.getItem('user')
    if (t && u) {
      setToken(t)
      setUser(JSON.parse(u))
    }
  }, [])

  // Login: save to localStorage and state
  const login = (userObj, jwtToken) => {
    localStorage.setItem('token', jwtToken)
    localStorage.setItem('user', JSON.stringify(userObj))
    setUser(userObj)
    setToken(jwtToken)
  }

  // Logout: clear everything
  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// Custom hook for using auth context
export function useAuthContext() {
  return useContext(AuthContext)
}
