import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function EventDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, token, loading: authLoading } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [error, setError] = useState('');
  const [bookingSuccess, setBookingSuccess] = useState('');

  // Booking Form State
  const [seats, setSeats] = useState(1);

  useEffect(() => {
    if (!id) return;

    const fetchEventDetails = async () => {
      try {
        const response = await axios.get(`/api/events/${id}`);
        setEvent(response.data);
      } catch (err) {
        console.error('Error fetching event detail:', err);
        setError('Failed to load event details. The event may not exist.');
      } finally {
        setLoading(false);
      }
    };

    fetchEventDetails();
  }, [id]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError('');
    setBookingSuccess('');

    // Protection check: Redirect to login if user attempts to book unauthenticated
    if (!user || !token) {
      router.push(`/login?redirect=/events/${id}`);
      return;
    }

    if (seats < 1) {
      setError('Please select at least 1 seat.');
      return;
    }

    if (event.availableSeats !== undefined && seats > event.availableSeats) {
      setError(`Only ${event.availableSeats} seats available.`);
      return;
    }

    setBookingLoading(true);

    try {
      const response = await axios.post(
        '/api/bookings',
        {
          eventId: id,
          seats: Number(seats),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 201 || response.status === 200) {
        setBookingSuccess('Booking confirmed! Redirecting to your bookings...');
        
        // Redirect to /bookings after a brief pause
        setTimeout(() => {
          router.push('/bookings');
        }, 1500);
      }
    } catch (err) {
      console.error('Booking submission error:', err);
      setError(
        err.response?.data?.message || 'Failed to complete booking. Please try again.'
      );
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
        Loading event details...
      </div>
    );
  }

  if (error && !event) {
    return (
      <div style={{ maxWidth: '600px', margin: '3rem auto', textAlign: 'center', padding: '0 1rem' }}>
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', marginBottom: '1.5rem' }}>
          {error}
        </div>
        <Link href="/events" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
          ← Back to Explore Events
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '850px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Breadcrumb Navigation */}
      <div style={{ marginBottom: '1.5rem' }}>
        <Link href="/events" style={{ color: '#64748b', fontSize: '0.875rem', textDecoration: 'none' }}>
          ← Back to All Events
        </Link>
      </div>

      {/* Main Event Details Card */}
      <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
        
        {/* Banner Header */}
        <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '2rem 2.5rem' }}>
          <span style={{ backgroundColor: '#2563eb', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '700', uppercase: 'true' }}>
            {event?.category || 'General Event'}
          </span>
          <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginTop: '1rem', marginBottom: '0.5rem' }}>
            {event?.title}
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Organized by {event?.organizer || 'EventHub Community'}
          </p>
        </div>

        {/* Content Body */}
        <div style={{ padding: '2rem 2.5rem', display: 'grid', gridTemplateColumns: '1fr', gap: '2rem' }}>
          
          {/* Metadata Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', backgroundColor: '#f8fafc', padding: '1.25rem', borderRadius: '8px', border: '1px solid #f1f5f9' }}>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'block' }}>DATE & TIME</span>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>
                {event?.date ? new Date(event.date).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'TBA'}
              </strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'block' }}>LOCATION</span>
              <strong style={{ color: '#0f172a', fontSize: '0.95rem' }}>{event?.location || 'Online'}</strong>
            </div>
            <div>
              <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: '600', display: 'block' }}>AVAILABILITY</span>
              <strong style={{ color: event?.availableSeats > 0 ? '#166534' : '#dc2626', fontSize: '0.95rem' }}>
                {event?.availableSeats !== undefined ? `${event.availableSeats} Seats Left` : 'Seats Available'}
              </strong>
            </div>
          </div>

          {/* Event Description */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '0.75rem' }}>
              About This Event
            </h3>
            <p style={{ color: '#334155', lineHeight: '1.6', fontSize: '1rem', whiteSpace: 'pre-line', margin: 0 }}>
              {event?.description || 'No detailed description provided for this event.'}
            </p>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #e2e8f0', margin: '0' }} />

          {/* Seat Booking Form Section */}
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#0f172a', marginBottom: '1rem' }}>
              Reserve Your Tickets
            </h3>

            {error && (
              <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {error}
              </div>
            )}

            {bookingSuccess && (
              <div style={{ color: '#166534', backgroundColor: '#f0fdf4', border: '1px solid #bbf7d0', padding: '0.75rem', borderRadius: '6px', fontSize: '0.875rem', marginBottom: '1rem' }}>
                {bookingSuccess}
              </div>
            )}

            {!user ? (
              /* Prompt for logged-out users */
              <div style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <p style={{ color: '#475569', fontSize: '0.95rem', marginBottom: '1rem' }}>
                  You need to be logged in to reserve seats for this event.
                </p>
                <Link
                  href={`/login?redirect=/events/${id}`}
                  style={{ display: 'inline-block', padding: '0.75rem 1.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}
                >
                  Sign In to Book
                </Link>
              </div>
            ) : event?.availableSeats === 0 ? (
              /* Sold Out State */
              <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1.25rem', borderRadius: '8px', textAlign: 'center', color: '#991b1b', fontWeight: '600' }}>
                🚫 This event is currently sold out.
              </div>
            ) : (
              /* Active Booking Form */
              <form onSubmit={handleBooking} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '400px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '600', color: '#334155', marginBottom: '0.375rem' }}>
                    Number of Seats *
                  </label>
                  <input
                    type="number"
                    min="1"
                    max={event?.availableSeats || 10}
                    value={seats}
                    onChange={(e) => setSeats(e.target.value)}
                    required
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '1rem', boxSizing: 'border-box' }}
                  />
                </div>

                <button
                  type="submit"
                  disabled={bookingLoading}
                  style={{
                    padding: '0.875rem 1.5rem',
                    backgroundColor: '#2563eb',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '1rem',
                    cursor: 'pointer',
                    opacity: bookingLoading ? 0.7 : 1,
                    transition: 'background-color 0.2s'
                  }}
                >
                  {bookingLoading ? 'Processing Booking...' : 'Confirm Reservation'}
                </button>
              </form>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}