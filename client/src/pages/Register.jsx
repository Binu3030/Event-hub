import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../api';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee' // Default role
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Client-side validation check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      // Reaches out to your Day 4 User Registration backend route
      await API.post('/auth/register', {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      });

      alert('Registration successful! Please log in with your new credentials.');
      navigate('/login'); // Send them to the login screen
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '75vh',
      backgroundColor: '#f8fafc'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '100%',
      maxWidth: '450px'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '1.5rem',
      textAlign: 'center'
    },
    group: {
      marginBottom: '1.15rem',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      backgroundColor: '#ffffff',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    btn: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '0.75rem'
    },
    alert: {
      backgroundColor: '#fef2f2',
      color: '#dc2626',
      padding: '0.75rem',
      borderRadius: '6px',
      fontSize: '0.875rem',
      marginBottom: '1.25rem',
      border: '1px solid #fca5a5'
    },
    footerText: {
      textAlign: 'center',
      marginTop: '1.25rem',
      fontSize: '0.9rem',
      color: '#64748b'
    },
    link: {
      color: '#2563eb',
      textDecoration: 'none',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        
        {error && <div style={styles.alert}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              name="name"
              required 
              style={styles.input}
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email"
              required 
              style={styles.input}
              value={formData.email}
              onChange={handleChange}
              placeholder="name@domain.com"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Account Role</label>
            <select 
              name="role" 
              style={styles.select} 
              value={formData.role} 
              onChange={handleChange}
            >
              <option value="attendee">Attendee (Buy & Manage Tickets)</option>
              <option value="organizer">Organizer (Host & Manage Events)</option>
            </select>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password"
              required 
              style={styles.input}
              value={formData.password}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Confirm Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              required 
              style={styles.input}
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <p style={styles.footerText}>
          Already have an account? <Link to="/login" style={styles.link}>Sign In</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;