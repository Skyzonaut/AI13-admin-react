// AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);  

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    setIsAuthenticated(!!token);
    setIsLoading(false); 
  }, []);

  const setLoginConf = (token, user) => {
    sessionStorage.setItem('token', token);
    sessionStorage.setItem('userId', user.id);
    sessionStorage.setItem('user', JSON.stringify(user));
    setIsAuthenticated(true);
  };

  const logoutConf = () => {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('userId');
    sessionStorage.removeItem('user');
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated, setLoginConf, logoutConf }}>
      {children}
    </AuthContext.Provider>
  );
};