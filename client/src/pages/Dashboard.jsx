import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function DashboardPage() {
  const { user } = useContext(AuthContext);
  const [myBookings, setMyBookings] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [actionMessage, setActionMessage] = useState({ type: '', text: '' });
  const [cancelingId, setCancelingId] = useState(null);

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/events');
      const allEvents = res.data || [];

      if (user) {
        // Filter events user is attending or waitlisted for
        const booked = allEvents.filter((e) =>
          e.attendees?.some((id) => (id._id || id).toString() === user.id) ||
          e.waitlist?.some((id) => (id._id || id).toString() === user.id)
        );
        setMyBookings(booked);

        // Extract categories user registered for to generate recommendations
        const bookedCategories = new Set(booked.map((b) => b.category));

        // Recommend upcoming events in same categories user hasn't booked yet
        const recommended = allEvents.filter((e) => {
          const isNotBooked = !booked.some((b) => b._id === e._id);
          const matchesInterest = bookedCategories.size > 0 
            ? bookedCategories.has(e.category) 
            : true;
          return isNotBooked && matchesInterest;
        }).slice(0, 3);

        setRecommendations(recommended);
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
      setError('Failed to load dashboard metrics.');
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
      fetchDashboardData(); // Refresh metrics and recommendations
    } catch (err) {
      console.error('Cancel error:', err);
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
        Loading your dashboard...
      </div>
    );
  }

  // Calculate user metrics
  const confirmedCount = myBookings.filter((e) =>
    e.attendees?.some((id) => (id._id || id).toString() === user?.id)
  ).length;

  const waitlistCount = myBookings.filter((e) =>
    e.waitlist?.some((id) => (id._id || id).toString() === user?.id)
  ).length;

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* User Welcome Banner */}
      <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '2rem', borderRadius: '12px', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 'bold', margin: '0 0 0.5rem 0' }}>
            Welcome back, {user?.name || 'User'}! 👋
          </h1>
          <p style={{ color: '#94a3b8', margin: 0, fontSize: '0.95rem' }}>
            Role: <span style={{ color: '#38bdf8', fontWeight: '600', textTransform: 'capitalize' }}>{user?.role || 'Member'}</span> | Email: {user?.email}
          </p>
        </div>

        {user?.role === 'admin' && (
          <Link
            href="/events/create"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.625rem 1.25rem',
              borderRadius: '6px',
              textDecoration: 'none',
              fontWeight: '600',
              fontSize: '0.875rem'
            }}
          >
            + Create New Event
          </Link>
        )}
      </div>

      {/* Global Action Banner */}
      {actionMessage.text && (
        <div style={{
          padding: '0.875rem 1rem',
          borderRadius: '6px',
          marginBottom: '1.5rem',
          fontSize: '0.875rem',
          fontWeight: '500',
          backgroundColor: actionMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: actionMessage.type === 'error' ? '#dc2626' : '#166534',
          border: `1px solid ${actionMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`
        }}>
          {actionMessage.text}
        </div>
      )}

      {/* Stats Summary Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Confirmed Bookings</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#166534', marginTop: '0.25rem' }}>{confirmedCount}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Active Waitlists</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#d97706', marginTop: '0.25rem' }}>{waitlistCount}</div>
        </div>

        <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '1.25rem', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>Total Reservations</div>
          <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#2563eb', marginTop: '0.25rem' }}>{myBookings.length}</div>
        </div>
      </div>

      {/* Recent Reservations Section */}
      <div style={{ marginBottom: '3rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
            Your Active Registrations
          </h2>
          <Link href="/my-bookings" style={{ color: '#2563eb', fontSize: '0.875rem', fontWeight: '600', textDecoration: 'none' }}>
            View All →
          </Link>
        </div>

        {myBookings.length === 0 ? (
          <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '2rem', borderRadius: '8px', textAlign: 'center', color: '#64748b' }}>
            You haven't registered for any events yet. <Link href="/events" style={{ color: '#2563eb', fontWeight: '600' }}>Browse events</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {myBookings.slice(0, 3).map((event) => {
              const isConfirmed = event.attendees?.some((id) => (id._id || id).toString() === user?.id);
              return (
                <div key={event._id} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', backgroundColor: '#f1f5f9', color: '#475569', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                        {event.category || 'General'}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: '700', color: isConfirmed ? '#166534' : '#d97706' }}>
                        {isConfirmed ? '✓ Confirmed' : '⏳ Waitlisted'}
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.25rem 0 0.5rem 0' }}>{event.title}</h3>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 0.25rem 0' }}>📅 {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
                    <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>📍 {event.location || 'Online'}</p>
                  </div>

                  <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem' }}>
                    <Link href={`/events/${event._id}`} style={{ flex: 1, textAlign: 'center', padding: '0.4rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', color: '#334155', textDecoration: 'none' }}>
                      Details
                    </Link>
                    <button
                      onClick={() => handleCancelBooking(event._id)}
                      disabled={cancelingId === event._id}
                      style={{ flex: 1, padding: '0.4rem', backgroundColor: '#dc2626', color: '#ffffff', border: 'none', borderRadius: '6px', fontSize: '0.8rem', fontWeight: '600', cursor: 'pointer' }}
                    >
                      {cancelingId === event._id ? 'Canceling...' : 'Cancel'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Recommendations Section */}
      <div>
        <h2 style={{ fontSize: '1.35rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '1rem' }}>
          Recommended For You 💡
        </h2>

        {recommendations.length === 0 ? (
          <p style={{ color: '#64748b', fontSize: '0.875rem' }}>No new recommendations available right now.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.25rem' }}>
            {recommendations.map((event) => (
              <div key={event._id} style={{ backgroundColor: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '1.25rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', backgroundColor: '#e2e8f0', color: '#334155', padding: '0.2rem 0.5rem', borderRadius: '4px', fontWeight: '600' }}>
                    {event.category || 'General'}
                  </span>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 'bold', margin: '0.5rem 0 0.25rem 0' }}>{event.title}</h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', margin: '0 0 0.5rem 0', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                    {event.description}
                  </p>
                </div>

                <Link
                  href={`/events/${event._id}`}
                  style={{ marginTop: '0.75rem', textAlign: 'center', padding: '0.5rem', backgroundColor: '#0f172a', color: '#ffffff', borderRadius: '6px', textDecoration: 'none', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  View & Book
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}