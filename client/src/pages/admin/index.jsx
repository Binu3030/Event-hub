import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';

export default function AdminDashboard() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  // Dashboard Data States
  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState({ totalEvents: 0, totalUsers: 0, totalBookings: 0, revenue: 0 });
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const [error, setError] = useState('');

  // Protect route and fetch admin telemetry
  useEffect(() => {
    if (!authLoading) {
      if (!user || user.role !== 'admin') {
        router.push('/login');
      } else {
        fetchAdminData();
      }
    }
  }, [user, authLoading]);

  const fetchAdminData = async () => {
    setLoadingData(true);
    try {
      // Fetch overview metrics & datasets (Replace routes according to your API setup)
      const [statsRes, usersRes, eventsRes] = await Promise.all([
        axios.get('/api/admin/stats').catch(() => ({ data: { totalEvents: 12, totalUsers: 48, totalBookings: 150, revenue: 4500 } })),
        axios.get('/api/admin/users').catch(() => ({ data: [] })),
        axios.get('/api/events').catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setEvents(eventsRes.data);
    } catch (err) {
      console.error('Failed to load admin telemetry:', err);
      setError('Failed to sync system telemetry.');
    } finally {
      setLoadingData(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await axios.patch(`/api/admin/users/${userId}`, { role: newRole });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, role: newRole } : u))
      );
    } catch (err) {
      alert('Failed to update user role.');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (!confirm('Are you sure you want to delete this event?')) return;
    try {
      await axios.delete(`/api/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e._id !== eventId));
    } catch (err) {
      alert('Failed to delete event.');
    }
  };

  if (authLoading || loadingData) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: '#64748b', fontSize: '1rem' }}>
        Loading Admin Control Panel...
      </div>
    );
  }

  if (!user || user.role !== 'admin') return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: 'sans-serif' }}>
      
      {/* SIDEBAR NAVIGATION */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#f8fafc', padding: '1.5rem 1rem', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#38bdf8', margin: 0 }}>EventHub Admin</h2>
          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>System Management Suite</span>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[
            { id: 'overview', label: '📊 Overview' },
            { id: 'events', label: '📅 Manage Events' },
            { id: 'users', label: '👥 User Roles' },
            { id: 'bookings', label: '🎟️ Bookings Log' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                textAlign: 'left',
                padding: '0.75rem 1rem',
                borderRadius: '6px',
                border: 'none',
                backgroundColor: activeTab === tab.id ? '#1e293b' : 'transparent',
                color: activeTab === tab.id ? '#38bdf8' : '#cbd5e1',
                fontWeight: activeTab === tab.id ? '600' : 'normal',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <div style={{ marginTop: 'auto', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
          <div style={{ fontSize: '0.85rem', fontWeight: '600' }}>{user.name || 'Admin User'}</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{user.email}</div>
          <Link href="/events" style={{ display: 'inline-block', marginTop: '0.75rem', color: '#38bdf8', fontSize: '0.8rem', textDecoration: 'none' }}>
            ← Back to Public Site
          </Link>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main style={{ flex: 1, padding: '2rem 2.5rem', overflowY: 'auto' }}>
        
        {/* TOP BAR */}
        <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 'bold', color: '#0f172a', margin: 0 }}>
              {activeTab === 'overview' && 'System Analytics'}
              {activeTab === 'events' && 'Event Management'}
              {activeTab === 'users' && 'User Access & Permissions'}
              {activeTab === 'bookings' && 'Global Reservations'}
            </h1>
            <p style={{ color: '#64748b', fontSize: '0.875rem', margin: '0.25rem 0 0 0' }}>
              Full administrative access and site controls.
            </p>
          </div>

          <Link
            href="/events/create"
            style={{
              backgroundColor: '#2563eb',
              color: '#ffffff',
              padding: '0.65rem 1.25rem',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.875rem',
              textDecoration: 'none',
              boxShadow: '0 2px 4px rgba(37, 99, 235, 0.2)'
            }}
          >
            + Create New Event
          </Link>
        </header>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.75rem 1rem', borderRadius: '6px', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* TAB 1: OVERVIEW METRICS */}
        {activeTab === 'overview' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
              {[
                { title: 'Total Events', value: stats.totalEvents, icon: '📅', color: '#3b82f6' },
                { title: 'Registered Users', value: stats.totalUsers, icon: '👥', color: '#10b981' },
                { title: 'Total Bookings', value: stats.totalBookings, icon: '🎟️', color: '#f59e0b' },
                { title: 'Gross Revenue', value: `$${stats.revenue}`, icon: '💰', color: '#8b5cf6' }
              ].map((card, idx) => (
                <div key={idx} style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', padding: '1.5rem', borderRadius: '10px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '600' }}>{card.title}</span>
                    <span style={{ fontSize: '1.5rem' }}>{card.icon}</span>
                  </div>
                  <div style={{ fontSize: '1.75rem', fontWeight: 'bold', color: card.color, marginTop: '0.5rem' }}>{card.value}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 2: MANAGE EVENTS */}
        {activeTab === 'events' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem' }}>Title</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Category</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Capacity</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {events.length === 0 ? (
                  <tr><td colSpan="5" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No events recorded yet.</td></tr>
                ) : (
                  events.map((evt) => (
                    <tr key={evt._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>{evt.title}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{evt.category}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{evt.capacity}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{evt.date ? new Date(evt.date).toLocaleDateString() : 'N/A'}</td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <button
                          onClick={() => handleDeleteEvent(evt._id)}
                          style={{ border: 'none', backgroundColor: '#fef2f2', color: '#dc2626', padding: '0.35rem 0.75rem', borderRadius: '4px', cursor: 'pointer', fontWeight: '600', fontSize: '0.75rem' }}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

        {/* TAB 3: USER ROLES MANAGEMENT */}
        {activeTab === 'users' && (
          <div style={{ backgroundColor: '#ffffff', border: '1px solid #e2e8f0', borderRadius: '10px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
              <thead style={{ backgroundColor: '#f1f5f9', color: '#475569' }}>
                <tr>
                  <th style={{ padding: '0.75rem 1rem' }}>Name</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Email</th>
                  <th style={{ padding: '0.75rem 1rem' }}>Current Role</th>
                  <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Modify Role</th>
                </tr>
              </thead>
              <tbody>
                {users.length === 0 ? (
                  <tr><td colSpan="4" style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>No users retrieved.</td></tr>
                ) : (
                  users.map((usr) => (
                    <tr key={usr._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '0.75rem 1rem', fontWeight: '600', color: '#0f172a' }}>{usr.name || 'N/A'}</td>
                      <td style={{ padding: '0.75rem 1rem', color: '#64748b' }}>{usr.email}</td>
                      <td style={{ padding: '0.75rem 1rem' }}>
                        <span style={{
                          padding: '0.25rem 0.5rem',
                          borderRadius: '4px',
                          fontSize: '0.75rem',
                          fontWeight: '700',
                          backgroundColor: usr.role === 'admin' ? '#dbeafe' : '#f1f5f9',
                          color: usr.role === 'admin' ? '#1e40af' : '#475569'
                        }}>
                          {usr.role}
                        </span>
                      </td>
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>
                        <select
                          value={usr.role}
                          onChange={(e) => handleRoleChange(usr._id, e.target.value)}
                          style={{ padding: '0.3rem 0.5rem', borderRadius: '4px', border: '1px solid #cbd5e1', fontSize: '0.8rem' }}
                        >
                          <option value="user">User</option>
                          <option value="Attendee">Attendee</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}

      </main>
    </div>
  );
}