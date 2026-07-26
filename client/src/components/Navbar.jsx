import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    toast.info('Logged out successfully.');
    navigate('/login');
  };

  const linkStyle = ({ isActive }) => ({
    color: isActive ? '#2563eb' : '#475569',
    fontWeight: isActive ? 'bold' : 'normal',
    textDecoration: 'none',
    padding: '0.5rem 0.75rem',
    borderRadius: '4px',
    backgroundColor: isActive ? '#eff6ff' : 'transparent',
    transition: 'all 0.2s ease'
  });

  return (
    <nav style={{ 
      backgroundColor: '#ffffff', 
      borderBottom: '1px solid #e2e8f0', 
      padding: '1rem 2rem', 
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
        <h1 
          onClick={() => navigate(token ? '/dashboard' : '/login')} 
          style={{ margin: 0, fontSize: '1.4rem', cursor: 'pointer', color: '#1e293b' }}
        >
          🎟️ EventHub
        </h1>

        {token && (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink to="/dashboard" style={linkStyle}>
              Explore Events
            </NavLink>
            <NavLink to="/my-bookings" style={linkStyle}>
              My Bookings
            </NavLink>
            {role === 'organizer' && (
              <NavLink to="/create-event" style={linkStyle}>
                + Create Event
              </NavLink>
            )}
          </div>
        )}
      </div>

      <div>
        {token ? (
          <button 
            onClick={handleLogout}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ef4444',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: 'bold',
              cursor: 'pointer'
            }}
          >
            Logout
          </button>
        ) : (
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <NavLink to="/login" style={linkStyle}>
              Login
            </NavLink>
            <NavLink to="/register" style={linkStyle}>
              Register
            </NavLink>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;