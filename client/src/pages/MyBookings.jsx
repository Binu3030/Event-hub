import React, { useState, useEffect } from 'react';
import API from '../api';
import MyBookings from './pages/MyBookings';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchMyBookings = async () => {
    try {
      const response = await API.get('/bookings/my-bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      alert("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  if (loading) {
    return <div style={{ textAlign: 'center', padding: '3rem' }}>Loading your tickets...</div>;
  }

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h2>My Booked Tickets</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>View and manage all your upcoming event reservations.</p>

      {bookings.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', marginBottom: '1rem' }}>You haven't booked any tickets yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div 
              key={booking._id} 
              style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '1.25rem', 
                backgroundColor: '#ffffff', 
                borderRadius: '8px', 
                border: '1px solid #e2e8f0',
                boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
              }}
            >
              <div>
                <h3 style={{ margin: '0 0 0.5rem 0', color: '#0f172a' }}>{booking.event?.title || 'Event Details Unavailable'}</h3>
                <p style={{ margin: '0 0 0.25rem 0', color: '#475569', fontSize: '0.9rem' }}>
                  📍 {booking.event?.location || 'N/A'} | 📅 {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                </p>
                <p style={{ margin: 0, color: '#2563eb', fontWeight: 'bold', fontSize: '0.9rem' }}>
                  Rs. {booking.event?.price || 'Free'}
                </p>
              </div>

              <div>
                <span 
                  style={{ 
                    padding: '0.35rem 0.75rem', 
                    borderRadius: '20px', 
                    fontSize: '0.8rem', 
                    fontWeight: 'bold', 
                    backgroundColor: '#dcfce7', 
                    color: '#15803d' 
                  }}
                >
                  Confirmed
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;