import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import axios from 'axios';

export default function ExploreEventsPage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const categories = ['All', 'Music', 'Tech', 'Workshop', 'Conference', 'Sports'];

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('/api/events');
        setEvents(response.data || []);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError('Failed to load events. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Filter events based on search input and category selection
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      event.location?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === 'All' ||
      event.category?.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ maxWidth: '1100px', margin: '2rem auto', padding: '0 1rem' }}>
      {/* Header Section */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 'bold', color: '#0f172a', marginBottom: '0.5rem' }}>
          Explore Events
        </h1>
        <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
          Discover tech meetups, music festivals, workshops, and conferences happening near you.
        </p>
      </div>

      {/* Search Bar & Category Filters */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {/* Search Input */}
        <input
          type="text"
          placeholder="🔍 Search events by title, description, or location..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            width: '100%',
            padding: '0.875rem 1rem',
            borderRadius: '8px',
            border: '1px solid #cbd5e1',
            fontSize: '0.95rem',
            outline: 'none',
            boxSizing: 'border-box'
          }}
        />

        {/* Category Pills */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: '0.5rem 1rem',
                borderRadius: '9999px',
                border: '1px solid',
                borderColor: selectedCategory === cat ? '#0f172a' : '#cbd5e1',
                backgroundColor: selectedCategory === cat ? '#0f172a' : '#ffffff',
                color: selectedCategory === cat ? '#ffffff' : '#334155',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content Area */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0', color: '#64748b' }}>
          Loading events...
        </div>
      ) : error ? (
        <div style={{ color: '#dc2626', backgroundColor: '#fef2f2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', textAlign: 'center' }}>
          {error}
        </div>
      ) : filteredEvents.length === 0 ? (
        /* Empty State */
        <div style={{ backgroundColor: '#f8fafc', border: '1px dashed #cbd5e1', padding: '3.5rem 1.5rem', borderRadius: '8px', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔎</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#334155', marginBottom: '0.5rem' }}>
            No Events Found
          </h3>
          <p style={{ color: '#64748b', fontSize: '0.875rem', margin: 0 }}>
            Try adjusting your search criteria or clearing selected category filters.
          </p>
        </div>
      ) : (
        /* Event Grid */
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
          {filteredEvents.map((event) => (
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
                justify: 'space-between'
              }}
            >
              {/* Event Header Banner / Image Placeholder */}
              <div style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '1.5rem', position: 'relative' }}>
                <span style={{ backgroundColor: '#2563eb', padding: '0.25rem 0.625rem', borderRadius: '4px', fontSize: '0.75rem', fontWeight: '700', uppercase: 'true' }}>
                  {event.category || 'General'}
                </span>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginTop: '0.75rem', marginBottom: '0' }}>
                  {event.title}
                </h3>
              </div>

              {/* Event Info Details */}
              <div style={{ padding: '1.25rem', flexGrow: 1, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <p style={{ color: '#475569', fontSize: '0.875rem', lineClamp: 2, WebkitLineClamp: 2, display: '-webkit-box', WebkitBoxOrient: 'vertical', overflow: 'hidden', margin: 0 }}>
                  {event.description}
                </p>

                <div style={{ marginTop: '0.75rem', fontSize: '0.875rem', color: '#64748b', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                  <div>📅 <strong>Date:</strong> {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</div>
                  <div>📍 <strong>Location:</strong> {event.location || 'Online'}</div>
                  <div>🎟️ <strong>Available Seats:</strong> {event.availableSeats ?? 'N/A'}</div>
                </div>
              </div>

              {/* Action Button */}
              <div style={{ padding: '1rem 1.25rem', borderTop: '1px solid #f1f5f9', backgroundColor: '#fafafa' }}>
                <Link
                  href={`/events/${event._id}`}
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    padding: '0.625rem',
                    backgroundColor: '#0f172a',
                    color: '#ffffff',
                    borderRadius: '6px',
                    fontWeight: '600',
                    fontSize: '0.875rem',
                    textDecoration: 'none'
                  }}
                >
                  View Details & Book
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}