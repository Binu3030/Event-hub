import React, { useState, useEffect } from 'react';
import API from '../api';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');

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

  const locations = ['All', ...new Set(events.map(evt => evt.location))];

  const filteredEvents = events.filter(evt => {
    const matchesSearch = evt.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          evt.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLocation = selectedLocation === 'All' || evt.location === selectedLocation;
    return matchesSearch && matchesLocation;
  });

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading available events...</div>;
  }

  return (
    <div>
      <h2>Explore Live Events</h2>
      <p>Find, filter, and secure tickets instantly for upcoming events.</p>
      
      {/* Search and Filters */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
        <input 
          type="text" 
          placeholder="Search by event title or description..." 
          style={{ flex: 2, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <select 
          style={{ flex: 1, padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }}
          value={selectedLocation}
          onChange={(e) => setSelectedLocation(e.target.value)}
        >
          {locations.map((loc, idx) => (
            <option key={idx} value={loc}>{loc === 'All' ? '🌍 All Locations' : `📍 ${loc}`}</option>
          ))}
        </select>
      </div>

      {/* Events Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
        {filteredEvents.length === 0 ? (
          <p style={{ textAlign: 'center', gridColumn: '1 / -1' }}>No events match your search criteria.</p>
        ) : (
          filteredEvents.map(evt => (
            <div key={evt._id} style={{ border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', backgroundColor: '#fff' }}>
              <h3>{evt.title}</h3>
              <p>📍 {evt.location}</p>
              <p>📅 {new Date(evt.date).toLocaleDateString()}</p>
              <p style={{ fontWeight: 'bold', color: '#2563eb' }}>Rs. {evt.price || 'Free'}</p>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>
                {evt.availableSeats > 0 ? `🎟️ ${evt.availableSeats} Seats Left` : '⚠️ Full / Waitlist'}
              </p>
              
              <button 
                onClick={() => handleBookTicket(evt._id)}
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  backgroundColor: '#10b981',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
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