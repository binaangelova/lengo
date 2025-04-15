// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const decoded = jwtDecode(storedToken);
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          return null;
        }
        return storedToken;
      } catch (error) {
        localStorage.removeItem('token');
        return null;
      }
    }
    return null;
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('csrfToken');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  const login = useCallback((receivedToken) => {
    try {
      // Verify token format and expiration
      const decoded = jwtDecode(receivedToken);
      if (decoded.exp * 1000 < Date.now()) {
        throw new Error('Token is expired');
      }
      localStorage.setItem('token', receivedToken);
      setToken(receivedToken);
      setError(null);
    } catch (error) {
      console.error('Invalid token:', error);
      setError('Invalid authentication token');
      logout();
    }
  }, [logout]);

  useEffect(() => {
    const fetchUser = async () => {
      if (!token) {
        setUser(null);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch('https://lengo-vz4i.onrender.com/user', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user details');
        }

        const data = await response.json();
        setUser(data);
        setError(null);
      } catch (error) {
        console.error('Error fetching user:', error);
        setError('Authentication failed');
        logout();
      } finally {
        setIsLoading(false);
      }
    };

    fetchUser();
  }, [token, logout]);

  // Add session timeout checking
  useEffect(() => {
    if (!token) return;

    try {
      const decoded = jwtDecode(token);
      const expirationTime = decoded.exp * 1000; // Convert to milliseconds
      const currentTime = Date.now();
      const timeUntilExpiration = expirationTime - currentTime;

      // If token expires in less than 5 minutes, attempt to refresh
      if (timeUntilExpiration < 300000 && timeUntilExpiration > 0) {
        const refreshSession = async () => {
          try {
            const response = await fetch('https://lengo-vz4i.onrender.com/user', {
              headers: {
                'Authorization': `Bearer ${token}`,
                'x-csrf-token': localStorage.getItem('csrfToken')
              }
            });

            if (!response.ok) {
              throw new Error('Session refresh failed');
            }

            // If we get here, the session is still valid
            const data = await response.json();
            setUser(data);
          } catch (error) {
            console.warn('Session expired, logging out');
            logout();
          }
        };

        refreshSession();
      }

      // Set up automatic logout when token expires
      const logoutTimer = setTimeout(() => {
        console.warn('Session expired');
        logout();
      }, timeUntilExpiration);

      return () => clearTimeout(logoutTimer);
    } catch (error) {
      console.error('Error checking token expiration:', error);
      logout();
    }
  }, [token, logout]);

  const value = {
    token,
    user,
    isAuthenticated: !!user,
    isLoading,
    error,
    login,
    logout
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume AuthContext
export const useAuth = () => useContext(AuthContext);
