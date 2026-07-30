'use client';

import React from 'react';
import Link from 'next/link'; // Replaces 'react-router-dom' Link
import { useRouter } from 'next/router';

const Navbar = ({ user, onLogout }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (onLogout) onLogout();
    router.push('/login');
  };

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#0f172a',
      color: '#ffffff'
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.25rem' }}>
        <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
          🎉 EventHub
        </Link>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
        <Link 
          href="/dashboard" 
          style={{ 
            color: router.pathname === '/dashboard' ? '#38bdf8' : '#cbd5e1', 
            textDecoration: 'none' 
          }}
        >
          Explore Events
        </Link>

        {user?.role === 'organizer' && (
          <Link 
            href="/create-event" 
            style={{ 
              color: router.pathname === '/create-event' ? '#38bdf8' : '#cbd5e1', 
              textDecoration: 'none' 
            }}
          >
            Create Event
          </Link>
        )}

        <Link 
          href="/my-bookings" 
          style={{ 
            color: router.pathname === '/my-bookings' ? '#38bdf8' : '#cbd5e1', 
            textDecoration: 'none' 
          }}
        >
          My Bookings
        </Link>

        {user ? (
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.4rem 0.8rem',
              backgroundColor: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            Logout
          </button>
        ) : (
          <Link 
            href="/login" 
            style={{ 
              color: '#fff', 
              backgroundColor: '#2563eb', 
              padding: '0.4rem 0.8rem', 
              borderRadius: '4px', 
              textDecoration: 'none' 
            }}
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;