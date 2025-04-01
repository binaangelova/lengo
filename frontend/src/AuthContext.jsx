// src/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  // Store the raw token
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);

  // We'll keep decoded user info (or null if no token or invalid token)
  const [user, setUser] = useState(null);

  // Whenever `token` changes, decode and check it
  useEffect(() => {
    const fetchUser = async () => {
      if (token) {
        try {
          const decoded = jwtDecode(token);

          // Check if token is expired
          const isExpired = decoded.exp * 1000 < Date.now();
          if (isExpired) {
            console.warn('JWT token is expired. Logging out.');
            logout();
          } else {
            const response = await fetch('http://localhost:5003/user', {
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
          }
        } catch (error) {
          console.error('Invalid token detected. Logging out.', error);
          logout();
        }
      } else {
        // No token in storage? Then user is not logged in.
        setUser(null);
      }
    }
    fetchUser()
  }, [token]);

  // Log user in: save token to localStorage & update state
  const login = (receivedToken) => {
    localStorage.setItem('token', receivedToken);
    setToken(receivedToken);
  };

  // Log user out: remove token & reset state
  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  };

  // Derive "isAuthenticated" from presence of a non-expired token (or user object)
  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ token, user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook to consume AuthContext
export const useAuth = () => useContext(AuthContext);
