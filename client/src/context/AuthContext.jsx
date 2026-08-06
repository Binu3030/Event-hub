import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Express backend base URL
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export const AuthContext = createContext({
  user: null,
  token: null,
  loading: true,
  login: async () => {},
  register: async () => {},
  logout: () => {}
});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore and verify user session on app mount
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
        setToken(storedToken);

        // Fallback to local storage user while verifying fresh user status
        if (storedUser) {
          try {
            setUser(JSON.parse(storedUser));
          } catch (e) {
            console.error('Failed to parse cached user:', e);
          }
        }

        // Fetch fresh profile from backend to sync real-time database changes (e.g., admin role updates)
        try {
          const res = await axios.get(`${API_URL}/auth/me`, { timeout: 5000 });
          if (res.data?.user) {
            setUser(res.data.user);
            localStorage.setItem('user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session check failed or expired token:', err?.message);
          // Only clear if server returns 401/403 explicit unauthorized error
          if (err.response?.status === 401 || err.response?.status === 403) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    initializeAuth();
  }, []);

  const register = async (userData) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      const { token: newToken, user: newUser } = response.data;
      const userPayload = newUser || {
        id: response.data.userId,
        name: userData.name,
        email: userData.email,
        role: userData.role || 'user'
      };

      if (newToken && userPayload) {
        localStorage.setItem('token', newToken);
        localStorage.setItem('user', JSON.stringify(userPayload));
        axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        setToken(newToken);
        setUser(userPayload);
      }

      return { success: true, user: userPayload, token: newToken };
    } catch (err) {
      console.error('Registration Error:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to server. Ensure Express backend is running.'
          : 'Registration failed.');

      throw new Error(errorMessage);
    }
  };

  const login = async (userEmail, userPassword) => {
    try {
      const response = await axios.post(
        `${API_URL}/auth/login`,
        { email: userEmail, password: userPassword },
        {
          headers: { 'Content-Type': 'application/json' },
          timeout: 10000
        }
      );

      const {
        token: authToken,
        user: loggedUser,
        id,
        name,
        role,
        email: responseEmail
      } = response.data;

      const resolvedUser = loggedUser || (id ? { id, name, email: responseEmail, role } : null);

      if (!authToken || !resolvedUser) {
        throw new Error('Invalid response structure from authentication server.');
      }

      // Persist session
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(resolvedUser));
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      // Update state
      setToken(authToken);
      setUser(resolvedUser);

      return { success: true, user: resolvedUser, token: authToken };
    } catch (err) {
      console.error('Login Error:', err);
      const errorMessage =
        err.response?.data?.error ||
        err.response?.data?.message ||
        (err.code === 'ERR_NETWORK'
          ? 'Cannot connect to server. Ensure Express backend is running on port 5001.'
          : 'Login failed.');

      // Throw error to trigger catch block in login page
      const errorObj = new Error(errorMessage);
      errorObj.response = err.response;
      throw errorObj;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    delete axios.defaults.headers.common['Authorization'];
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};