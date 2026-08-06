import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function Dashboard() {
  const { user, token, loading: authLoading } = useContext(AuthContext);

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (authLoading) return;

    if (!token) {
      setLoading(false);
      return;
    }

    const fetchMyBookings = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await axios.get(`${API_URL}/bookings/my-bookings`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        // Backend returns an array formatted as: [{ ...booking, event: booking.eventId }]
        const data = Array.isArray(res.data) ? res.data : [];
        setBookings(data);
      } catch (err) {
        console.error('Error fetching dashboard bookings:', err);
        setError('Failed to load your reservations.');
      } finally {
        setLoading(false);
      }
    };

    fetchMyBookings();
  }, [token, authLoading]);

  // Metric Calculations
  const confirmedBookings = bookings.filter((b) => b.ticketCode);
  const waitlists = bookings.filter((b) => !b.ticketCode);

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Welcome Header */}
      <div
        style={{
          backgroundColor: '#0f172a',
          color: '#ffffff',
          borderRadius: '12px',
          padding: '2rem',
          marginBottom: '2rem'
        }}
      >
        <h1 style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
          Welcome back, {user?.name || 'Attendee'}! 👋
        </h1>
        <p style={{ margin: '0.5rem 0 0', color: '#94a3b8', fontSize: '0.9rem' }}>
          Role: <strong style={{ color: '#38bdf8' }}>{user?.role || 'Attendee'}</strong> | Email: {user?.email || 'N/A'}
        </p>
      </div>

      {/* Metrics Cards */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2.5rem'
        }}
      >
        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Confirmed Bookings</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#16a34a', margin: '0.5rem 0 0' }}>
            {confirmedBookings.length}
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Active Waitlists</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#d97706', margin: '0.5rem 0 0' }}>
            {waitlists.length}
          </h2>
        </div>

        <div style={{ backgroundColor: '#ffffff', padding: '1.5rem', borderRadius: '10px', border: '1px solid #e2e8f0', boxShadow: '0 2px 4px rgba(0,0,0,0.02)' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: '600', color: '#64748b' }}>Total Reservations</span>
          <h2 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#2563eb', margin: '0.5rem 0 0' }}>
            {bookings.length}
          </h2>
        </div>
      </div>

      {/* Active Registrations Section */}
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
            Your Active Registrations
          </h2>
          <Link href="/events" style={{ fontSize: '0.875rem', color: '#2563eb', fontWeight: '600', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {error && (
          <div style={{ padding: '1rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#991b1b', borderRadius: '8px', marginBottom: '1rem' }}>
            {error}
          </div>
        )}

        {loading || authLoading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: '#64748b' }}>Loading your bookings...</div>
        ) : bookings.length === 0 ? (
          <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', borderRadius: '8px', padding: '3rem', textAlign: 'center', color: '#64748b' }}>
            You haven't registered for any events yet.{' '}
            <Link href="/events" style={{ color: '#2563eb', fontWeight: '600', textDecoration: 'underline' }}>
              Browse events
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {bookings.map((item) => {
              const eventData = item.event || item.eventId || {};
              const eventIdStr = eventData._id || item.eventId;

              return (
                <div
                  key={item._id}
                  style={{
                    backgroundColor: '#ffffff',
                    border: '1px solid #e2e8f0',
                    borderRadius: '8px',
                    padding: '1.25rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 'bold', color: '#0f172a' }}>
                      {eventData.title || 'Event Title'}
                    </h3>
                    <p style={{ margin: '0.25rem 0 0', color: '#64748b', fontSize: '0.875rem' }}>
                      📍 {eventData.location || 'TBA'} | 🗓️ {eventData.date ? new Date(eventData.date).toLocaleDateString() : 'TBA'}
                    </p>
                    {item.ticketCode && (
                      <span style={{ display: 'inline-block', marginTop: '0.5rem', backgroundColor: '#eff6ff', color: '#1e40af', padding: '0.25rem 0.5rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700' }}>
                        Ticket: {item.ticketCode}
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/events/${eventIdStr}`}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f1f5f9',
                      color: '#334155',
                      borderRadius: '6px',
                      textDecoration: 'none',
                      fontWeight: '600',
                      fontSize: '0.875rem'
                    }}
                  >
                    View Details
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}