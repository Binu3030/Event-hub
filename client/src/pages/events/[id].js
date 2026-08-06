import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!id) return;

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error loading event:', err);
        setMessage({
          type: 'error',
          text: err.response?.data?.error || 'Failed to load event details.'
        });
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    setBookingLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const response = await axios.post(`/api/events/${id}/book`);
      
      // Update local event data with new availableSeats count
      if (response.data?.event) {
        setEvent(response.data.event);
      } else {
        // Fallback re-fetch if updated object isn't returned directly
        const updatedRes = await axios.get(`/api/events/${id}`);
        setEvent(updatedRes.data);
      }

      setMessage({
        type: 'success',
        text: response.data?.message || 'Seat reserved successfully!'
      });
    } catch (err) {
      console.error('Booking error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || 'Booking failed. Please try again.'
      });
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
        Loading event details...
      </div>
    );
  }

  if (!event && message.type === 'error') {
    return (
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '1rem' }}>
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          {message.text}
        </div>
        <div style={{ textAlign: 'center', marginTop: '1rem' }}>
          <Link href="/events" style={{ color: '#2563eb', textDecoration: 'none', fontWeight: '600' }}>
            ← Back to Explore Events
          </Link>
        </div>
      </div>
    );
  }

  const isSoldOut = event?.availableSeats <= 0;
  const isAlreadyBooked = user && event?.attendees?.includes(user.id);

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Back Link */}
      <Link href="/events" style={{ color: '#64748b', textDecoration: 'none', fontSize: '0.875rem', fontWeight: '600', display: 'inline-block', marginBottom: '1.5rem' }}>
        ← Back to Explore Events
      </Link>

      {/* Main Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
        
        {/* Banner Header */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '2rem' }}>
          <span style={{ backgroundColor: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase' }}>
            {event.category || 'General'}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '0.5rem' }}>
            {event.title}
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            📍 {event.location || 'Online'}
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem' }}>
          {/* Alert Message Box */}
          {message.text && (
            <div style={{
              padding: '0.875rem 1rem',
              borderRadius: '6px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              backgroundColor: message.type === 'error' ? '#fef2f2' : '#f0fdf4',
              color: message.type === 'error' ? '#dc2626' : '#166534',
              border: `1px solid ${message.type === 'error' ? '#fecaca' : '#bbf7d0'}`
            }}>
              {message.text}
            </div>
          )}

          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', marginBottom: '0.5rem' }}>
            About This Event
          </h3>
          <p style={{ color: '#334155', lineHeight: '1.6', whiteSpace: 'pre-line', marginTop: 0, marginBottom: '2rem' }}>
            {event.description}
          </p>

          {/* Key Metrics Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '2rem', border: '1px solid #f1f5f9' }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Date & Time</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>
                📅 {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Total Capacity</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '600', color: '#0f172a', marginTop: '0.25rem' }}>
                👥 {event.capacity} Seats
              </div>
            </div>

            <div>
              <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', textTransform: 'uppercase' }}>Seat Status</div>
              <div style={{ fontSize: '0.95rem', fontWeight: '700', marginTop: '0.25rem', color: isSoldOut ? '#dc2626' : '#166534' }}>
                🎟️ {isSoldOut ? 'Sold Out' : `${event.availableSeats} Remaining`}
              </div>
            </div>
          </div>

          {/* Tags */}
          {event.tags && event.tags.length > 0 && (
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b', marginBottom: '0.5rem' }}>Tags</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {event.tags.map((tag, idx) => (
                  <span key={idx} style={{ backgroundColor: '#e2e8f0', color: '#334155', padding: '0.25rem 0.625rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Reservation Action Section */}
          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                {isAlreadyBooked ? 'You have a confirmed reservation.' : 'Ready to attend? Reserve your spot below.'}
              </div>
            </div>

            <button
              onClick={handleBooking}
              disabled={bookingLoading || isAlreadyBooked}
              style={{
                padding: '0.75rem 1.75rem',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.95rem',
                border: 'none',
                cursor: (bookingLoading || isAlreadyBooked) ? 'not-allowed' : 'pointer',
                backgroundColor: isAlreadyBooked ? '#166534' : isSoldOut ? '#d97706' : '#2563eb',
                color: '#ffffff',
                transition: 'background-color 0.2s ease'
              }}
            >
              {bookingLoading
                ? 'Processing...'
                : isAlreadyBooked
                ? '✓ Seat Booked'
                : isSoldOut
                ? 'Join Waitlist'
                : 'Book Seat Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}