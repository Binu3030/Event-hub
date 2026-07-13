import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');

  // Fetch events from the backend database when the component loads
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await API.get('/events');
        setEvents(response.data);
      } catch (err) {
        console.error("Error loading events:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  /**
   * Ticket Booking Trigger
   * Dispatches request directly to your Day 7 priority waitlist engine
   */
  const handleBookTicket = async (eventId) => {
    try {
      setMessage('');
      const response = await API.post(`/bookings/${eventId}`);
      alert(response.data.message);
      
      // Refresh event list to reflect updated seat counts
      const updated = await API.get('/events');
      setEvents(updated.data);
    } catch (err) {
      alert(err.response?.data?.error || "Booking request dropped.");
    }
  };

  const styles = {
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1.5rem 0'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -1px rgba(0,0,0,0.03)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    title: {
      fontSize: '1.25rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '0.5rem'
    },
    meta: {
      fontSize: '0.875rem',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    badge: {
      display: 'inline-block',
      padding: '0.25rem 0.5rem',
      borderRadius: '4px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      backgroundColor: '#f1f5f9',
      color: '#0f172a',
      marginTop: '0.5rem'
    },
    btn: {
      width: '100%',
      padding: '0.6rem',
      backgroundColor: '#10b981',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '0.95rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem'
    }
  };

  if (loading) return <div>Loading available events...</div>;

  return (
    <div>
      <h2 style={{ color: '#0f172a', textAlign: 'left', marginBottom: '0.5rem' }}>Explore Live Events</h2>
      <p style={{ color: '#64748b', textAlign: 'left' }}>Secure your tickets instantly or join the high-priority waitlist matrix if full.</p>
      
      <div style={styles.grid}>
        {events.length === 0 ? (
          <p>No active events scheduled at the moment.</p>
        ) : (
          events.map(evt => (
            <div key={evt._id} style={styles.card}>
              <div>
                <div style={styles.title}>{evt.title}</div>
                <div style={styles.meta}>📍 {evt.location}</div>
                <div style={styles.meta}>📅 {new Date(evt.date).toLocaleDateString()}</div>
                <div style={{ ...styles.meta, fontWeight: 'bold', color: '#2563eb' }}>
                  Rs. {evt.price || 'Free'}
                </div>
              </div>
              
              <div>
                <span style={styles.badge}>
                  {evt.availableSeats > 0 ? `🎟️ ${evt.availableSeats} Seats Left` : '⚠️ Waitlist Mode Active'}
                </span>
                
                <button style={styles.btn} onClick={() => handleBookTicket(evt._id)}>
                  {evt.availableSeats > 0 ? 'Book Ticket' : 'Join Priority Waitlist'}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;