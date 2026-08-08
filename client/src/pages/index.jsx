import React, { useState, useEffect, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5001/api';

export default function HomePage() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const { user } = useContext(AuthContext);

  // Helper function to verify authentication status
  const checkAuthStatus = () => {
    let hasToken = false;
    if (typeof window !== 'undefined') {
      hasToken = Boolean(
        localStorage.getItem('token') || 
        localStorage.getItem('jwt') || 
        localStorage.getItem('authToken')
      );
    }
    return Boolean(user || hasToken);
  };

  // 1. Automatic page redirect if not logged in
  useEffect(() => {
    const isAuthenticated = checkAuthStatus();
    if (!isAuthenticated) {
      router.replace('/login?redirect=%2Fevents');
    }
  }, [user, router]);

  // 2. Fetch upcoming events
  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get(`${API_URL}/events`);
        const eventData = Array.isArray(res.data)
          ? res.data
          : res.data.events || [];
        setEvents(eventData.slice(0, 6));
      } catch (err) {
        console.error('Failed to load upcoming events:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchUpcomingEvents();
  }, []);

  // Button click handler
  const handleNavigation = (e, destinationPath) => {
    e.preventDefault();
    const isAuthenticated = checkAuthStatus();

    if (!isAuthenticated) {
      router.push(`/login?redirect=${encodeURIComponent(destinationPath)}`);
    } else {
      router.push(destinationPath);
    }
  };

  return (
    <div style={{ fontFamily: 'system-ui, -apple-system, sans-serif', color: '#0f172a', backgroundColor: '#ffffff' }}>
      
      {/* 1. HERO SECTION */}
      <section
        style={{
          background: 'radial-gradient(circle at top right, #1e293b, #0f172a)',
          color: '#ffffff',
          padding: '6rem 1.5rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden'
        }}
      >
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '3.25rem', fontWeight: '800', lineHeight: '1.15', marginBottom: '1.25rem', letterSpacing: '-0.025em' }}>
            Welcome to EventHub
          </h1>

          <p style={{ fontSize: '1.25rem', color: '#94a3b8', lineHeight: '1.6', marginBottom: '2.5rem', maxWidth: '750px', margin: '0 auto 2.5rem' }}>
            Ready for your next big tech experience? Find top-rated conferences on EventHub, secure your spot in seconds, and manage all your tickets effortlessly.
          </p>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <button
              onClick={(e) => handleNavigation(e, '/events')}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.9rem 2.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Explore Live Events
            </button>
          </div>
        </div>
      </section>

      {/* 2. FEATURED EVENTS SECTION */}
      <section style={{ backgroundColor: '#ffffff', padding: '5rem 1.5rem' }}>
        <div style={{ maxWidth: '1150px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <span style={{ color: '#2563eb', fontWeight: '700', fontSize: '0.875rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Upcoming Schedule
              </span>
              <h2 style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.25rem 0 0', color: '#0f172a' }}>
                Explore Featured Events
              </h2>
            </div>
            <button
              onClick={(e) => handleNavigation(e, '/events')}
              style={{
                background: 'none',
                border: 'none',
                color: '#2563eb',
                fontWeight: '600',
                fontSize: '0.95rem',
                cursor: 'pointer',
                padding: 0
              }}
            >
              Browse All Events →
            </button>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '4rem', color: '#64748b' }}>Loading available events...</div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#f8fafc', borderRadius: '12px', color: '#64748b', border: '1px solid #e2e8f0' }}>
              No upcoming events found. Check back later!
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
              {events.map((event) => {
                const isSoldOut = event.availableSeats <= 0;
                const targetPath = `/events/${event._id}`;

                return (
                  <div
                    key={event._id}
                    style={{
                      backgroundColor: '#ffffff',
                      border: '1px solid #e2e8f0',
                      borderRadius: '12px',
                      padding: '1.5rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span
                          style={{
                            backgroundColor: isSoldOut ? '#fef3c7' : '#dcfce7',
                            color: isSoldOut ? '#b45309' : '#15803d',
                            fontSize: '0.75rem',
                            fontWeight: '700',
                            padding: '0.25rem 0.6rem',
                            borderRadius: '6px'
                          }}
                        >
                          {isSoldOut ? 'Priority Waitlist Active' : `${event.availableSeats ?? 0} Seats Remaining`}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.25rem', fontWeight: 'bold', margin: '0 0 0.5rem', color: '#0f172a' }}>
                        {event.title}
                      </h3>

                      <p
                        style={{
                          color: '#64748b',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          marginBottom: '1rem',
                          display: '-webkit-box',
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: 'vertical',
                          overflow: 'hidden'
                        }}
                      >
                        {event.description || 'Join us for a technical event filled with networking and key takeaway insights.'}
                      </p>
                    </div>

                    <div>
                      <div style={{ fontSize: '0.85rem', color: '#475569', marginBottom: '1.25rem', borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem' }}>
                        <p style={{ margin: '0 0 0.25rem' }}>📍 {event.location || 'Online / Hybrid'}</p>
                        <p style={{ margin: 0 }}>🗓️ {event.date ? new Date(event.date).toLocaleDateString() : 'TBA'}</p>
                      </div>

                      <button
                        onClick={(e) => handleNavigation(e, targetPath)}
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          backgroundColor: isSoldOut ? '#d97706' : '#2563eb',
                          color: '#ffffff',
                          padding: '0.65rem 1rem',
                          borderRadius: '6px',
                          fontWeight: '600',
                          border: 'none',
                          cursor: 'pointer',
                          fontSize: '0.875rem'
                        }}
                      >
                        {isSoldOut ? 'Join Waitlist Queue' : 'Reserve Ticket'}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 3. PROMOTIONAL BOTTOM SECTION */}
      <section style={{ backgroundColor: '#0f172a', color: '#ffffff', padding: '4.5rem 1.5rem', textAlign: 'center' }}>
        <div style={{ maxWidth: '750px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.25rem', fontWeight: '800', marginBottom: '1rem', letterSpacing: '-0.025em' }}>
            Don’t Miss Out on Upcoming Tech Events
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.6', marginBottom: '2rem' }}>
            Explore trending tech sessions, track live seat availability, and secure your spot before events sell out. Check the latest schedule and claim your ticket today!
          </p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button
              onClick={(e) => handleNavigation(e, '/events')}
              style={{
                backgroundColor: '#2563eb',
                color: '#ffffff',
                padding: '0.9rem 2.25rem',
                borderRadius: '8px',
                fontWeight: '600',
                border: 'none',
                cursor: 'pointer',
                fontSize: '1rem',
                boxShadow: '0 4px 14px rgba(37, 99, 235, 0.35)'
              }}
            >
              Explore Featured Events
            </button>
          </div>
        </div>
      </section>

    </div>
  );
}
