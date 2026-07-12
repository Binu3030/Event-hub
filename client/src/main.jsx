import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  // Modular styling object for inline clean layouts
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
      cursor: 'pointer'
    },
    linksContainer: {
      display: 'flex',
      gap: '1.5rem',
      alignItems: 'center'
    },
    link: {
      color: '#cbd5e1',
      textDecoration: 'none',
      cursor: 'pointer',
      fontSize: '0.95rem'
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
      color: '#38bdf8'
    }
  };

  return (
    <nav style={styles.nav}>
      <div style={styles.logo}>🎉 EventHub</div>
      
      <div style={styles.linksContainer}>
        <span style={styles.link}>Browse Events</span>
        
        {user ? (
          <>
            {/* Dynamic Rendering based on RBAC Role Types */}
            {user.role === 'organizer' ? (
              <span style={styles.link}>➕ Create Event</span>
            ) : (
              <span style={styles.link}>🎟️ My Tickets</span>
            )}
            
            <span style={styles.userBadge}>
              {user.name} ({user.role})
            </span>
            
            <button onClick={logout} style={styles.btn}>
              Logout
            </button>
          </>
        ) : (
          <>
            <span style={styles.link}>Login</span>
            <span style={styles.link}>Register</span>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;