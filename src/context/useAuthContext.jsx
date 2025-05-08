import { deleteCookie, getCookie, hasCookie, setCookie } from 'cookies-next';
import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(undefined);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}

const authSessionKey = '_EDUPORT_AUTH_KEY_';

export function AuthProvider({ children }) {
  const navigate = useNavigate();
  
  const getSession = () => {
    console.log('Getting session from cookie');
    const fetchedCookie = getCookie(authSessionKey)?.toString();
    
    if (!fetchedCookie) {
      console.log('No session cookie found');
      return;
    } else {
      try {
        const parsedSession = JSON.parse(fetchedCookie);
        console.log('Session cookie found:', { 
          hasToken: !!parsedSession?.token,
          tokenPreview: parsedSession?.token ? (parsedSession.token.substring(0, 20) + '...') : 'no token'
        });
        return parsedSession;
      } catch (error) {
        console.error('Error parsing session cookie:', error);
        return;
      }
    }
  };
  
  const [user, setUser] = useState(getSession());
  
  // Debug logging for user state changes
  useEffect(() => {
    console.log('Auth state changed:', { 
      isAuthenticated: hasCookie(authSessionKey),
      hasUser: !!user,
      hasToken: !!user?.token
    });
  }, [user]);
  
  const saveSession = (userData) => {
    console.log('Saving session:', { 
      hasToken: !!userData?.token,
      tokenPreview: userData?.token ? (userData.token.substring(0, 20) + '...') : 'no token' 
    });
    
    setCookie(authSessionKey, JSON.stringify(userData));
    setUser(userData);
  };
  
  const removeSession = () => {
    console.log('Removing session');
    deleteCookie(authSessionKey);
    setUser(undefined);
    navigate('/auth/sign-in');
  };
  
  const isAuthenticated = hasCookie(authSessionKey);
  
  return (
    <AuthContext.Provider 
      value={{
        user,
        isAuthenticated,
        saveSession,
        removeSession
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
