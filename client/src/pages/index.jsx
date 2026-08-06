import React, { useState, useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

export default function CreateEventPage() {
  const { user, loading: authLoading } = useContext(AuthContext);
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'General',
    location: '',
    date: '',
    capacity: '',
    tags: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Handle client-side redirect for unauthorized users
  useEffect(() => {
    if (!authLoading && (!user || user.role !== 'admin')) {
      // Optional: Auto-redirect or handle access inline
    }
  }, [user, authLoading]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Format payload: Parse capacity to Number and tags to a clean string array
      const payload = {
        ...formData,
        capacity: Number(formData.capacity),
        tags: formData.tags
          ? formData.tags.split(',').map((tag) => tag.trim()).filter(Boolean)
          : []
      };

      await axios.post('/api/events', payload);
      router.push('/events'); // Redirect to events catalog
    } catch (err) {
      console.error('Create Event Error:', err);
      setError(
        err.response?.data?.error || 'System error compiling event data schema initialization.'
      );
    } finally {
      setLoading(false);
    }
  };

  // Render loading indicator while auth status resolves
  if (authLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b', fontSize: '0.95rem' }}>
        Verifying administrator permissions...
      </div>
    );
  }

  // Restrict access strictly to logged-in Admin users
  if (!user || user.role !== 'admin') {
    return (
      <div
        style={{
          maxWidth: '550px',
          margin: '4rem auto',
          textAlign: 'center',
          padding: '2.5rem 2rem',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '10px',
          boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
        }}
      >
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🚫</div>
        <h2 style={{ color: '#dc2626', marginBottom: '0.5rem', fontSize: '1.5rem', fontWeight: '700' }}>
          Access Restricted
        </h2>
        <p style={{ color: '#991b1b', marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: '1.5' }}>
          You must be authenticated as an administrator to access event creation tooling.
        </p>
        <Link
          href="/events"
          style={{
            display: 'inline-block',
            backgroundColor: '#dc2626',
            color: '#ffffff',
            padding: '0.6rem 1.25rem',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.875rem',
            textDecoration: 'none'
          }}
        >
          ← Return to Events Catalog
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '650px', margin: '2rem auto', padding: '0 1rem' }}>
      <Link
        href="/events"
        style={{
          color: '#64748b',
          fontSize: '0.875rem',
          fontWeight: '600',
          textDecoration: 'none',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          marginBottom: '1.25rem'
        }}
      >
        ← Back to Events
      </Link>

      <div
        style={{
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '2rem',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.03)'
        }}
      >
        <h1 style={{ fontSize: '1.65rem', fontWeight: '800', color: '#0f172a', marginBottom: '0.25rem' }}>
          Create New Event
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1.75rem' }}>
          Submit a new event entry into the system catalog.
        </p>

        {error && (
          <div
            style={{
              backgroundColor: '#fef2f2',
              color: '#dc2626',
              border: '1px solid #fecaca',
              padding: '0.875rem 1rem',
              borderRadius: '8px',
              marginBottom: '1.5rem',
              fontSize: '0.875rem',
              lineHeight: '1.4'
            }}
          >
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
              Event Title *
            </label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. React & Next.js Workshop"
              value={formData.title}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
              Description
            </label>
            <textarea
              name="description"
              rows={4}
              placeholder="Provide event details, agenda, or prerequisites..."
              value={formData.description}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                resize: 'vertical',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  backgroundColor: '#ffffff',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              >
                {['General', 'Tech', 'Workshop', 'Music', 'Conference', 'Sports'].map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Total Capacity *
              </label>
              <input
                type="number"
                name="capacity"
                min="1"
                required
                placeholder="e.g. 50"
                value={formData.capacity}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Location
              </label>
              <input
                type="text"
                name="location"
                placeholder="e.g. Kathmandu or Online"
                value={formData.location}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
                Event Date
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                style={{
                  width: '100%',
                  padding: '0.65rem 0.875rem',
                  borderRadius: '6px',
                  border: '1px solid #cbd5e1',
                  fontSize: '0.9rem',
                  outline: 'none',
                  boxSizing: 'border-box'
                }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: '600', fontSize: '0.85rem', color: '#334155', marginBottom: '0.4rem' }}>
              Tags (comma-separated)
            </label>
            <input
              type="text"
              name="tags"
              placeholder="react, express, webdev"
              value={formData.tags}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '0.65rem 0.875rem',
                borderRadius: '6px',
                border: '1px solid #cbd5e1',
                fontSize: '0.9rem',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.75rem',
              padding: '0.75rem',
              backgroundColor: loading ? '#94a3b8' : '#2563eb',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              fontWeight: '600',
              fontSize: '0.95rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'background-color 0.2s ease'
            }}
          >
            {loading ? 'Submitting Event...' : 'Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
}