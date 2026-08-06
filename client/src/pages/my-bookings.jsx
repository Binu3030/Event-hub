import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function MyBookingsPage() {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const fetchMyBookings = async () => {
    try {
      setLoading(true);
      // Fetches all events from backend and filters where user is an attendee or on waitlist
      const res = await axios.get('/api/events');
      const allEvents = res.data || [];

      if (user) {
        const userEvents = allEvents.filter((event) => {
          const isAttendee = event.attendees?.some(
            (id) => (id._id || id).toString() === user.id
          );
          const isWaitlisted = event.waitlist?.some(
            (id) => (id._id || id).toString() === user.id
          );
          return isAttendee || isWaitlisted;
        });
        setBookings(userEvents);
      }
    } catch (err) {
      console.error('Error loading bookings:', err);
      setError('Failed to fetch your reserved bookings. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (eventId) => {
    if (!window.confirm('Are you sure you want to cancel this reservation?')) return;

    setCancelingId(eventId);
    setActionMessage({ type: '', text: '' });

    try {
      const res = await axios.post(`/api/events/${eventId}/cancel`);

      setActionMessage({
        type: 'success',
        text: res.data?.message || 'Reservation canceled successfully.'
      });

      // Remove or update the event in local state
      setBookings((prevBookings) =>
        prevBookings.filter((event) => event._id !== eventId)
      );
    } catch (err) {
      console.error('Cancellation error:', err);
      setActionMessage({
        type: 'error',
        text: err.response?.data?.error || 'Failed to cancel reservation.'
      });
    } finally {
      setCancelingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
        Loading your reserved events...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1000px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
          My Bookings & Reservations
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', margin: 0 }}>
          Manage your upcoming event registrations and waitlist entries.
        </p>
      </div>

      {/* Global Status Message Alert */}
      {actionMessage.text && (
        <div
          style={{
            padding: '0.875rem 1rem',
            borderRadius: '6px',
            marginBottom: '1.5rem',
            fontSize: '0.875rem',
            fontWeight: '500',
            backgroundColor: actionMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
            color: actionMessage.type === 'error' ? '#dc2626' : '#166534',
            border: `1px solid ${actionMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`
          }}
        >
          {actionMessage.text}
        </div>
      )}

      {error ? (
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      ) : bookings.length === 0 ? (
        /* Empty State */
        <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '3.5rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎟️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
            No Booked Events Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            You haven't registered for any events yet.
          </p>
          <Link
            href="/events"
            style={{
              padding: '0.625rem 1.25rem',
              backgroundColor: '#2563eb',
              color: '#ffffff',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            Explore Events
          </Link>
        </div>
      ) : (
        /* Bookings Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(310px, 1fr))', gap: '1.5rem' }}>
          {bookings.map((event) => {
            const isConfirmed = event.attendees?.some(
              (id) => (id._id || id).toString() === user?.id
            );
            const isWaitlisted = event.waitlist?.some(
              (id) => (id._id || id).toString() === user?.id
            );

            return (
              <div
                key={event._id}
                style={{
                  backgroundColor: '#ffffff',
                  border: '1px solid #e2e8f0',
                  borderRadius: '10px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between'
                }}
              >
                {/* Header Banner */}
                <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ backgroundColor: '#2563eb', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', fontWeight: '700', textTransform: 'uppercase' }}>
                      {event.category || 'General'}
                    </span>
                    <span
                      style={{
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        padding: '0.2rem 0.6rem',
                        borderRadius: '9999px',
                        backgroundColor: isConfirmed ? '#dcfce7' : '#fef3c7',
                        color: isConfirmed ? '#166534' : '#92400e'
                      }}
                    >
                      {isConfirmed ? '✓ Confirmed' : '⏳ Waitlisted'}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.2rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: 0 }}>
                    {event.title}
                  </h3>
                </div>

                {/* Details Body */}
                <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ color: '#475569', fontSize: '0.875rem', margin: 0, lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>

                  <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                    <div>📅 <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</div>
                    <div>📍 <strong>Location:</strong> {event.location || 'Online'}</div>
                  </div>
                </div>

                {/* Action Footer */}
                <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa', display: 'flex', gap: '0.5rem' }}>
                  <Link
                    href={`/events/${event._id}`}
                    style={{
                      flex: 1,
                      textAlign: 'center',
                      padding: '0.5rem',
                      border: '1px solid #cbd5e1',
                      color: '#334155',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      textDecoration: 'none'
                    }}
                  >
                    View Details
                  </Link>

                  <button
                    onClick={() => handleCancelBooking(event._id)}
                    disabled={cancelingId === event._id}
                    style={{
                      flex: 1,
                      padding: '0.5rem',
                      backgroundColor: cancelingId === event._id ? '#fca5a5' : '#dc2626',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '6px',
                      fontWeight: '600',
                      fontSize: '0.85rem',
                      cursor: cancelingId === event._id ? 'not-allowed' : 'pointer'
                    }}
                  >
                    {cancelingId === event._id ? 'Canceling...' : 'Cancel Reservation'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}