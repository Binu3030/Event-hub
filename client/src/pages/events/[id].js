import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function EventDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [userBooking, setUserBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // Fetch event details and check if user already has a booking
  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch event info
        const eventRes = await axios.get(`${API_URL}/events/${id}`);
        setEvent(eventRes.data.event || eventRes.data);

        // Fetch user bookings if logged in to check existing reservation
        if (token) {
          const bookingsRes = await axios.get(`${API_URL}/bookings/my-bookings`, {
            headers: { Authorization: `Bearer ${token}` },
          });

          const currentBooking = bookingsRes.data.find(
            (b) => (b.eventId?._id || b.eventId) === id
          );
          if (currentBooking) {
            setUserBooking(currentBooking);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setMessage({ type: 'error', text: 'Failed to load event details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, token]);

  // Handle Booking / Waitlist Request
  const handleBookSeat = async () => {
    if (!user || !token) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // POST /api/bookings/:eventId
      const res = await axios.post(
        `${API_URL}/bookings/${id}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({
        type: 'success',
        text: res.data.message || 'Seat reserved successfully!',
      });

      // Update state if booked or waitlisted
      if (res.data.booking) {
        setUserBooking(res.data.booking);
        setEvent((prev) => ({
          ...prev,
          availableSeats: Math.max(0, (prev.availableSeats || 0) - 1),
        }));
      }
    } catch (err) {
      console.error('Booking error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error || err.response?.data?.message || 'Failed to process request.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  // Handle Cancellation Request
  const handleCancelBooking = async () => {
    if (!userBooking) return;

    setActionLoading(true);
    setMessage({ type: '', text: '' });

    try {
      // DELETE /api/bookings/:bookingId
      const res = await axios.delete(`${API_URL}/bookings/${userBooking._id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({
        type: 'success',
        text: res.data.message || 'Booking cancelled successfully.',
      });

      setUserBooking(null);

      // Increment available seats if no waitlist reallocation occurred
      if (!res.data.reallocated) {
        setEvent((prev) => ({
          ...prev,
          availableSeats: (prev.availableSeats || 0) + 1,
        }));
      }
    } catch (err) {
      console.error('Cancellation error:', err);
      setMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to cancel booking.',
      });
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        Loading event details...
      </div>
    );
  }

  if (!event) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>
        <h2>Event not found.</h2>
        <Link href="/events" style={{ color: '#2563eb', textDecoration: 'none' }}>
          Back to Events
        </Link>
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Navigation Link */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link
          href="/events"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.375rem',
            color: '#2563eb',
            fontWeight: '600',
            textDecoration: 'none',
            fontSize: '0.875rem',
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Events
        </Link>
      </div>

      <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '2rem', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)', border: '1px solid #e2e8f0' }}>
        {/* Banner Alert Message */}
        {message.text && (
          <div
            style={{
              padding: '1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.95rem',
              fontWeight: '500',
              backgroundColor: message.type === 'success' ? '#f0fdf4' : '#fef2f2',
              color: message.type === 'success' ? '#166534' : '#991b1b',
              border: `1px solid ${message.type === 'success' ? '#bbf7d0' : '#fecaca'}`,
            }}
          >
            {message.text}
          </div>
        )}

        <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
          {event.title}
        </h1>

        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
          About This Event
        </h3>
        <p style={{ color: '#475569', lineHeight: '1.6', marginBottom: '1.5rem' }}>
          {event.description}
        </p>

        {/* Stats Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              DATE & TIME
            </span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: '600', color: '#1e293b' }}>
              🗓️ {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              TOTAL CAPACITY
            </span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: '600', color: '#1e293b' }}>
              👥 {event.capacity || 100} Seats
            </p>
          </div>

          <div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', textTransform: 'uppercase' }}>
              SEAT STATUS
            </span>
            <p style={{ margin: '0.25rem 0 0', fontWeight: '700', color: event.availableSeats > 0 ? '#15803d' : '#dc2626' }}>
              🎟️ {event.availableSeats ?? 0} Remaining
            </p>
          </div>
        </div>

        {/* Active Ticket Banner */}
        {userBooking && (
          <div style={{ backgroundColor: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: '8px', padding: '1rem', marginBottom: '1.5rem' }}>
            <span style={{ fontSize: '0.875rem', color: '#1e40af', fontWeight: '600' }}>Your Ticket Code:</span>
            <p style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#1e3a8a', margin: '0.25rem 0 0', letterSpacing: '0.05em' }}>
              {userBooking.ticketCode}
            </p>
          </div>
        )}

        {/* Action Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
            {userBooking
              ? 'You have a ticket for this event.'
              : isSoldOut
              ? 'Event is full. Join the priority waitlist.'
              : 'Ready to attend? Reserve your spot below.'}
          </span>

          {userBooking ? (
            <button
              onClick={handleCancelBooking}
              disabled={actionLoading}
              style={{
                padding: '0.75rem 1.5rem',
                backgroundColor: '#dc2626',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              {actionLoading ? 'Cancelling...' : 'Cancel Reservation'}
            </button>
          ) : (
            <button
              onClick={handleBookSeat}
              disabled={actionLoading}
              style={{
                padding: '0.75rem 1.75rem',
                backgroundColor: isSoldOut ? '#d97706' : '#2563eb',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: actionLoading ? 'not-allowed' : 'pointer',
                opacity: actionLoading ? 0.7 : 1,
              }}
            >
              {actionLoading
                ? 'Processing...'
                : isSoldOut
                ? 'Join Waitlist'
                : 'Book Seat Now'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}