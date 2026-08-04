import React, { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';

export default function MyBookingsPage() {
  const { user, token, loading: authLoading } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    // Only fetch bookings if user is authenticated
    if (user && token) {
      const fetchBookings = async () => {
        try {
          const response = await axios.get('/api/bookings/my-bookings', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setBookings(response.data || []);
        } catch (err) {
          console.error(err);
          setError('Failed to fetch your bookings.');
        } finally {
          setLoading(false);
        }
      };

      fetchBookings();
    } else {
      setLoading(false);
    }
  }, [user, token]);

  // 1. Loading state while checking authentication
  if (authLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <p style={{ color: '#64748b' }}>Checking authentication status...</p>
      </div>
    );
  }

  // 2. Unauthenticated State (Prompt to Sign In)
  if (!user) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh', padding: '1rem' }}>
        <div style={{ backgroundColor: '#ffffff', padding: '2.5rem', borderRadius: '8px', maxWidth: '420px', width: '100%', textAlign: 'center', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>🔒</div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>Sign In Required</h2>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Please sign in to view your booked events and manage reservations.
          </p>
          <Link href="/login" style={{ display: 'inline-block', width: '100%', padding: '0.75rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none', boxSizing: 'border-box' }}>
            Sign In to View Bookings
          </Link>
        </div>
      </div>
    );
  }

  // 3. Authenticated State (Display Bookings or Empty Message)
  return (
    <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
      <h1 style={{ fontSize: '1.875rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1.5rem' }}>My Bookings</h1>

      {loading ? (
        <p style={{ color: '#64748b' }}>Loading your reservations...</p>
      ) : error ? (
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '0.75rem', borderRadius: '6px' }}>
          {error}
        </div>
      ) : bookings.length === 0 ? (
        /* State when logged in, but NO bookings exist */
        <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '3rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🎟️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>No Bookings Found</h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            You haven't reserved any events yet. Explore live events and make your first booking!
          </p>
          <Link href="/index.js" style={{ display: 'inline-block', padding: '0.625rem 1.25rem', backgroundColor: '#2563eb', color: '#ffffff', borderRadius: '6px', fontWeight: '600', textDecoration: 'none' }}>
            Explore Events
          </Link>
        </div>
      ) : (
        /* State when logged in and bookings exist */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {bookings.map((booking) => (
            <div key={booking._id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                  {booking.event?.title || 'Event Title'}
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
                  Date: {booking.event?.date ? new Date(booking.event.date).toLocaleDateString() : 'N/A'}
                </p>
                <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
                  Seats: {booking.seats || 1}
                </p>
              </div>
              <span style={{ backgroundColor: '#dcfce7', color: '#166534', padding: '0.25rem 0.75rem', borderRadius: '9999px', fontSize: '0.75rem', fontWeight: '600' }}>
                Confirmed
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}