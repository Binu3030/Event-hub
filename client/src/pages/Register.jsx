'use client';

import React, { useState, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

export default function RegisterPage() {
  const { register } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Email format validation helper
  const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  // Password rules validation helper
  const isPasswordStrong = (pwd) => {
    // Min 8 chars, at least 1 uppercase, 1 lowercase, 1 number
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(pwd);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // 1. Email format check
    if (!isValidEmail(formData.email)) {
      setError('Please enter a valid email address (e.g. user@gmail.com).');
      return;
    }

    // 2. Password strength check
    if (!isPasswordStrong(formData.password)) {
      setError('Password must be at least 8 characters long and include uppercase, lowercase, and numbers.');
      return;
    }

    // 3. Password match check
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setLoading(true);

    try {
      const result = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      setLoading(false);

      if (result?.success) {
        router.push('/dashboard');
      } else {
        setError(result?.error || 'Registration failed. Please try again.');
      }
    } catch (err) {
      setLoading(false);
      setError('An error occurred during registration.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh', padding: '1rem' }}>
      <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        <h2 style={{ fontSize: '1.75rem', fontWeight: 'bold', textAlign: 'center', color: '#0f172a', marginBottom: '0.5rem' }}>Create an Account</h2>
        <p style={{ textAlign: 'center', color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Join EventHub to explore and manage live events.</p>

        {error && (
          <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Full Name */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Binu Magar"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="name@gmail.com"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Must be a valid email (e.g. Gmail, Yahoo, or custom domain).</span>
          </div>

          {/* Password */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem' }}>Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
              Must contain at least 8 characters, 1 uppercase, 1 lowercase, and 1 number.
            </div>
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.25rem' }}>Confirm Password *</label>
            <input
              type="password"
              required
              placeholder="••••••••"
              style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', boxSizing: 'border-box' }}
              value={formData.confirmPassword}
              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', color: '#ffffff', border: 'none', borderRadius: '6px', fontWeight: '600', cursor: 'pointer' }}
          >
            {loading ? 'Creating Account...' : 'Register'}
          </button>
        </form>

        <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#64748b', marginTop: '1.5rem' }}>
          Already have an account?{' '}
          <Link href="/login" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}