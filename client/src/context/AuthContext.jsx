import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Pointing to your Express backend on Port 5001
const API_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

export const AuthContext = createContext({
  user: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore user session on app mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');

    if (token && storedUser) {
      try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(JSON.parse(storedUser));
      } catch (e) {
        console.error('Failed to restore session:', e);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        delete axios.defaults.headers.common['Authorization'];
      }
    }
    setLoading(false);
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      const { token, user: newUser } = response.data;
      const userPayload = newUser || {
        id: response.data.userId,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'Attendee'
      };

      if (token && userPayload) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userPayload));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(userPayload);
      }

      return { success: true, user: userPayload, data: response.data };
    } catch (err) {
      console.error('Registration Error:', err);
      return {
        success: false,
        error:
          err.response?.data?.error ||
          err.response?.data?.message ||
          (err.code === 'ERR_NETWORK'
            ? 'Cannot connect to server. Ensure Express is running on http://localhost:5001.'
            : 'Registration failed.')
      };
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email, password },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const { token, user: loggedUser } = response.data;

      if (token && loggedUser) {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(loggedUser));
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        setUser(loggedUser);
      }

      return { success: true, user: loggedUser, data: response.data };
    } catch (err) {
      console.error('Login Error:', err);
      return {
        success: false,
        error:
          err.response?.data?.message ||
          (err.code === 'ERR_NETWORK'
            ? 'Cannot connect to server. Ensure Express is running on http://localhost:5001.'
            : 'Login failed.')
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};