import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogoutClick = () => {
    logout();
    navigate('/login'); // Instantly kick user back to clean login state
  };

  const styles = {
    nav: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      backgroundColor: '#1e293b',
      color: '#ffffff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    },
    logo: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      letterSpacing: '0.5px',
      color: '#ffffff',
      textDecoration: 'none'
    },
    linksContainer: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center'
    },
    link: {
      color: '#cbd5e1',
      textDecoration: 'none',
      fontSize: '0.95rem',
      transition: 'color 0.2s'
    },
    btn: {
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      padding: '0.5rem 1rem',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '0.9rem'
    },
    userBadge: {
      fontSize: '0.85rem',
      backgroundColor: '#334155',
      padding: '0.25rem 0.6rem',
      borderRadius: '12px',
      color: '#38bdf8',
      textTransform: 'capitalize'
    }
  };

  return (
    <nav style={styles.nav}>
      <Link to="/dashboard" style={styles.logo}>🎉 EventHub</Link>
      
      <div style={styles.linksContainer}>
        <Link to="/dashboard" style={styles.link}>Browse Events</Link>
        
        {user ? (
          <>
            {/* My Bookings option visible for all authenticated users */}
            <Link to="/my-bookings" style={styles.link}>My Bookings</Link>

            {/* Create Event option visible strictly to Organizers */}
            {user.role === 'organizer' && (
              <Link to="/create-event" style={styles.link}>➕ Create Event</Link>
            )}
            
            <span style={styles.userBadge}>
              {user.name} ({user.role})
            </span>
            
            <button onClick={handleLogoutClick} style={styles.btn}>
              Logout
            </button>
          </>
        ) : (
          <>
            {/* Navigation links for guests */}
            <Link to="/login" style={styles.link}>Login</Link>
            <Link to="/register" style={styles.link}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;