import React, { useState, useEffect } from 'react';
import API from '../api';

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch all bookings associated with the logged-in user
  const fetchBookings = async () => {
    try {
      const response = await API.get('/bookings');
      setBookings(response.data);
    } catch (err) {
      console.error("Error loading personal bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  // Cancel a booking and release the seat/trigger waitlist updates
  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking reservation?")) return;

    try {
      const response = await API.delete(`/bookings/${bookingId}`);
      alert(response.data.message || "Booking successfully cancelled.");
      fetchBookings(); // Reload list
    } catch (err) {
      alert(err.response?.data?.error || "Failed to cancel booking reservation.");
    }
  };

  const styles = {
    container: {
      maxWidth: '800px',
      margin: '0 auto'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '0.5rem',
      textAlign: 'left'
    },
    sub: {
      color: '#64748b',
      textAlign: 'left',
      marginBottom: '2rem'
    },
    card: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0',
      marginBottom: '1rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap',
      gap: '1rem'
    },
    eventTitle: {
      fontSize: '1.2rem',
      fontWeight: 'bold',
      color: '#1e293b',
      marginBottom: '0.25rem'
    },
    meta: {
      fontSize: '0.875rem',
      color: '#475569'
    },
    badge: (status) => ({
      display: 'inline-block',
      padding: '0.25rem 0.6rem',
      borderRadius: '12px',
      fontSize: '0.75rem',
      fontWeight: 'bold',
      backgroundColor: status === 'confirmed' ? '#d1fae5' : '#fef3c7',
      color: status === 'confirmed' ? '#065f46' : '#92400e',
      textTransform: 'capitalize',
      marginTop: '0.5rem'
    }),
    cancelBtn: {
      padding: '0.5rem 1rem',
      backgroundColor: '#ef4444',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600'
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: '2rem' }}>Loading your reservations...</div>;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>🎟️ My Bookings</h2>
      <p style={styles.sub}>Track your active tickets, real-time waitlist statuses, and manage cancellations.</p>

      {bookings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
          <p style={{ color: '#64748b', fontSize: '1rem' }}>You haven't reserved any tickets yet.</p>
        </div>
      ) : (
        bookings.map((booking) => (
          <div key={booking._id} style={styles.card}>
            <div style={{ textAlign: 'left' }}>
              {/* Supports fallback rendering if event data populated dynamically */}
              <div style={styles.eventTitle}>{booking.event?.title || 'Unknown Event'}</div>
              <div style={styles.meta}>📍 {booking.event?.location || 'TBD'}</div>
              <div style={styles.meta}>📅 {booking.event ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}</div>
              
              <span style={styles.badge(booking.status)}>
                {booking.status === 'confirmed' ? '✓ Confirmed Ticket' : '⏳ Waitlisted'}
              </span>
            </div>

            <div>
              <button 
                onClick={() => handleCancelBooking(booking._id)} 
                style={styles.cancelBtn}
              >
                Cancel Ticket
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default MyBookings;