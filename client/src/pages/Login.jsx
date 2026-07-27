'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import ProtectedRoute from '../components/ProtectedRoute'; // Adjust relative path if needed
import API from '../api'; // Adjust path if your api file is at src/api

const CreateEventForm = () => {
  const router = useRouter();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    date: '',
    price: '',
    availableSeats: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        price: formData.price ? Number(formData.price) : 0,
        availableSeats: Number(formData.availableSeats)
      };

      const response = await API.post('/events', payload);
      toast.success(response.data.message || '🎉 Event created successfully!');
      
      // Redirect to dashboard to view the newly created event
      router.push('/Dashboard');
    } catch (err) {
      console.error('Error creating event:', err);
      toast.error(err.response?.data?.error || err.response?.data?.message || 'Failed to create event.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      display: 'flex',
      justifyContent: 'center',
      padding: '2rem 1rem'
    },
    card: {
      backgroundColor: '#ffffff',
      padding: '2.5rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      width: '100%',
      maxWidth: '550px'
    },
    title: {
      fontSize: '1.75rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '0.5rem'
    },
    subtitle: {
      color: '#64748b',
      marginBottom: '1.5rem',
      fontSize: '0.95rem'
    },
    group: {
      marginBottom: '1.25rem'
    },
    row: {
      display: 'flex',
      gap: '1rem'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#334155',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
      boxSizing: 'border-box'
    },
    textarea: {
      width: '100%',
      padding: '0.75rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
      minHeight: '100px',
      resize: 'vertical',
      boxSizing: 'border-box'
    },
    btn: {
      width: '100%',
      padding: '0.75rem',
      backgroundColor: '#2563eb',
      color: '#ffffff',
      border: 'none',
      borderRadius: '6px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: '1rem'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Host a New Event</h2>
        <p style={styles.subtitle}>Fill in the event details below to publish it to EventHub.</p>

        <form onSubmit={handleSubmit}>
          <div style={styles.group}>
            <label style={styles.label}>Event Title *</label>
            <input
              type="text"
              name="title"
              required
              placeholder="e.g. Kathmandu Tech Summit 2026"
              style={styles.input}
              value={formData.title}
              onChange={handleChange}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Location / Venue *</label>
            <input
              type="text"
              name="location"
              required
              placeholder="e.g. Pokhara City Hall"
              style={styles.input}
              value={formData.location}
              onChange={handleChange}
            />
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Event Date & Time *</label>
            <input
              type="datetime-local"
              name="date"
              required
              style={styles.input}
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <div style={styles.row}>
            <div style={{ ...styles.group, flex: 1 }}>
              <label style={styles.label}>Ticket Price (NPR)</label>
              <input
                type="number"
                name="price"
                min="0"
                placeholder="0 for Free"
                style={styles.input}
                value={formData.price}
                onChange={handleChange}
              />
            </div>

            <div style={{ ...styles.group, flex: 1 }}>
              <label style={styles.label}>Available Seats *</label>
              <input
                type="number"
                name="availableSeats"
                required
                min="1"
                placeholder="e.g. 100"
                style={styles.input}
                value={formData.availableSeats}
                onChange={handleChange}
              />
            </div>
          </div>

          <div style={styles.group}>
            <label style={styles.label}>Event Description *</label>
            <textarea
              name="description"
              required
              placeholder="Provide a brief overview, agenda, or highlights..."
              style={styles.textarea}
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Publishing Event...' : '🚀 Publish Event'}
          </button>
        </form>
      </div>
    </div>
  );
};

// Export wrapped with ProtectedRoute (Admin / Organizer restricted)
export default function CreateEventPage() {
  return (
    <ProtectedRoute allowedRoles={['admin', 'organizer']}>
      <CreateEventForm />
    </ProtectedRoute>
  );
}