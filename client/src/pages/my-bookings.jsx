'use client';

import React, { useState, useEffect } from 'react';
import API from '../api'; // ✅ Fixed relative path to src/api.js

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await API.get('/bookings/MyBookings');
        setBookings(response.data);
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) return <div style={{ padding: '2rem' }}>Loading your tickets...</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h2>My Booked Tickets</h2>
      {bookings.length === 0 ? (
        <p>No tickets booked yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '1rem', marginTop: '1rem' }}>
          {bookings.map((b) => (
            <div key={b._id} style={{ padding: '1rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
              <h3>{b.event?.title || 'Event Ticket'}</h3>
              <p>📍 {b.event?.location}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyBookings;