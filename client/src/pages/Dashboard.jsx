import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [sortBy, setSortBy] = useState('dateAsc'); // 'dateAsc', 'dateDesc', 'priceAsc', 'priceDesc'

  const fetchEvents = async () => {
    setLoading(true);
    try {
      const response = await API.get('/events');
      setEvents(response.data);
    } catch (err) {
      console.error("Error loading events:", err);
      alert("Failed to load events. Please try again later.");
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
      alert(response.data.message || "🎉 Ticket booked successfully!");
      fetchEvents(); 
    } catch (err) {
      alert(err.response?.data?.error || "Booking request dropped.");
    }
  };

  // Unique Location List
  const locations = ['All', ...new Set(events.map(evt => evt.location).filter(Boolean))];

  // Multi-Filter & Sort Pipeline
  const filteredEvents = events
    .filter(evt => {
      const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            evt.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = selectedLocation === 'All' || evt.location === selectedLocation;
      return matchesSearch && matchesLocation;
    })
    .sort((a, b) => {
      if (sortBy === 'dateAsc') return new Date(a.date) - new Date(b.date);
      if (sortBy === 'dateDesc') return new Date(b.date) - new Date(a.date);
      if (sortBy === 'priceAsc') return (a.price || 0) - (b.price || 0);
      if (sortBy === 'priceDesc') return (b.price || 0) - (a.price || 0);
      return 0;
    });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading available events...</div>;
  }

  return (
    <div>
      <h2>Explore Live Events</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Find, filter, and secure tickets instantly for upcoming events.</p>
      
      {/* Search, Location Filter & Sort Controls */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by event title or description..." 
          style={{ flex: 2, minWidth: '220px', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        
        <select 
          style={{ flex: 1, minWidth: '150px', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc === 'All' ? '🌍 All Locations' : `📍 ${loc}`}</option>
          ))}
        </select>

        <select 
          style={{ flex: 1, minWidth: '150px', padding: '0.6rem', borderRadius: '6px', border: '1px solid #cbd5e1' }}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
        >
          <option value="dateAsc">📅 Date: Soonest First</option>
          <option value="dateDesc">📅 Date: Latest First</option>
          <option value="priceAsc">🏷️ Price: Low to High</option>
          <option value="priceDesc">🏷️ Price: High to Low</option>
        </select>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredEvents.length === 0 ? (
          <div style={{ textAlign: 'center', gridColumn: '1 / -1', padding: '2rem', backgroundColor: '#f8fafc', borderRadius: '8px' }}>
            <p style={{ color: '#64748b', margin: 0 }}>No events match your selected criteria.</p>
          </div>
        ) : (
          filteredEvents.map(evt => (
            <div key={evt._id} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
              <h3 style={{ marginTop: 0, color: '#0f172a' }}>{evt.title}</h3>
              <p style={{ margin: '0.25rem 0', color: '#475569' }}>📍 {evt.location}</p>
              <p style={{ margin: '0.25rem 0', color: '#475569' }}>📅 {new Date(evt.date).toLocaleDateString()}</p>
              <p style={{ fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0' }}>
                {evt.price ? `Rs. ${evt.price}` : 'Free Entry'}
              </p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {evt.availableSeats > 0 ? `🎟️ ${evt.availableSeats} Seats Left` : '⚠️ Full / Waitlist'}
              </p>
              
              <button 
                onClick={() => handleBookTicket(evt._id)}
                style={{
                  width: '100%',
                  padding: '0.6rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '6px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  marginTop: '1rem'
                }}
              >
                {evt.availableSeats > 0 ? 'Book Ticket' : 'Join Waitlist'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Dashboard;