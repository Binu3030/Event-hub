import React, { createContext, useState, useEffect } from 'react';
import API from '../api';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if a session token exists when the application first loads up
  useEffect(() => {
    const token = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  /**
   * Universal Login Handler
   * Reaches out to the Day 4 user login backend routing system
   */
  const login = async (email, password) => {
    try {
      const response = await API.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      // Persist the credentials directly into browser localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));

      setUser(userData);
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err.response?.data?.error || 'Authentication server communications failure.' 
      };
    }
  };

  /**
   * Universal Logout Handler
   * Destroys active local tokens and resets the global React layout tree state
   */
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};