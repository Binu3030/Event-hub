import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [networkError, setNetworkError] = useState(false); // Track network dropping out
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

  // Fetch events safely from the backend database
  const fetchEvents = async () => {
    setLoading(true);
    setNetworkError(false);
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error("Error loading events:", err);
      setNetworkError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const handleBookTicket = async (eventId) => {
    try {
      const response = await API.post(`/bookings/${eventId}`);
      alert(response.data.message);
      fetchEvents(); // Instantly refresh counts
    } catch (err) {
      alert(err.response?.data?.error || "Booking request dropped.");
    }
  };

  const locations = ['All', ...new Set(events.map(evt => evt.location))];

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || evt.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  const styles = {
    filterBar: {
      display: 'flex',
      gap: '1rem',
      marginBottom: '2rem',
      flexWrap: 'wrap',
      backgroundColor: '#ffffff',
      padding: '1rem',
      borderRadius: '8px',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },
    input: {
      flex: 2,
      minWidth: '200px',
      padding: '0.65rem 1rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      fontSize: '0.95rem',
      outline: 'none'
    },
    select: {
      flex: 1,
      minWidth: '150px',
      padding: '0.65rem 1rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      backgroundColor: '#ffffff',
      fontSize: '0.95rem',
      outline: 'none'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
      gap: '1.5rem',
      padding: '1rem 0'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      minHeight: '200px'
    },
    // Shimmering layout placeholders
    skeletonPulse: {
      backgroundColor: '#e2e8f0',
      borderRadius: '4px',
      marginBottom: '0.75rem',
      animation: 'pulse 1.5s infinite ease-in-out'
    },
    title: { fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' },
    meta: { fontSize: '0.875rem', color: '#475569', marginBottom: '0.5rem' },
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

  // Render network error retry panel if backend is down
  if (networkError) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #fee2e2', maxWidth: '500px', margin: '2rem auto' }}>
        <h3 style={{ color: '#ef4444', marginBottom: '0.5rem' }}>Connection Failed</h3>
        <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Unable to contact the central server. Please check your network connectivity.</p>
        <button onClick={fetchEvents} style={{ ...styles.btn, backgroundColor: '#2563eb', width: 'auto', padding: '0.5rem 1.5rem', marginTop: 0 }}>🔌 Try Reconnecting</button>
      </div>
    );
  }

  return (
    <div>
      <h2 style={{ color: '#0f172a', textAlign: 'left', marginBottom: '0.5rem' }}>Explore Live Events</h2>
      <p style={{ color: '#64748b', textAlign: 'left', marginBottom: '1.5rem' }}>Find, filter, and secure tickets instantly for upcoming events.</p>
      
      <div style={styles.filterBar}>
        <input 
          type="text" 
          placeholder="Search by event title or description..." 
          style={styles.input}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          disabled={loading}
        />
        <select 
          style={styles.select}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
          disabled={loading}
        >
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc === 'All' ? '🌍 All Locations' : `📍 ${loc}`}</option>
          ))}
        </select>
      </div>

      <div style={styles.grid}>
        {loading ? (
          // Render a grid of 3 premium skeleton loading structures
          [1, 2, 3].map((n) => (
            <div key={n} style={{ ...styles.card, opacity: 0.6 }}>
              <div>
                <div style={{ ...styles.skeletonPulse, width: '70%', height: '1.5rem' }} />
                <div style={{ ...styles.skeletonPulse, width: '40%', height: '1rem' }} />
                <div style={{ ...styles.skeletonPulse, width: '30%', height: '1rem' }} />
              </div>
              <div>
                <div style={{ ...styles.skeletonPulse, width: '50%', height: '1.25rem', marginTop: '1rem' }} />
                <div style={{ ...styles.skeletonPulse, width: '100%', height: '2.5rem', borderRadius: '6px' }} />
              </div>
            </div>
          ))
        ) : filteredEvents.length === 0 ? (
          <p style={{ color: '#64748b', gridColumn: '1 / -1', textAlign: 'center', padding: '2rem' }}>
            No events match your current search criteria.
          </p>
        ) : (
          filteredEvents.map(evt => (
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