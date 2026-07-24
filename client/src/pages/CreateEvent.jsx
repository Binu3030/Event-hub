import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    price: 0,
    totalSeats: 10
  });

  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error as user types
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Client-side field validations
    if (!formData.title.trim() || !formData.location.trim()) {
      setError('Title and location are required fields.');
      return;
    }

    if (new Date(formData.date) < new Date()) {
      setError('Event date must be set in the future.');
      return;
    }

    if (formData.totalSeats <= 0) {
      setError('Total seats must be at least 1.');
      return;
    }

    if (formData.price < 0) {
      setError('Price cannot be negative.');
      return;
    }

    // 2. Submit payload if validation passes
    try {
      setIsSubmitting(true);
      await API.post('/events', {
        ...formData,
        availableSeats: formData.totalSeats
      });
      alert('🎉 Event created successfully!');
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create event.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ maxWidth: '500px', margin: '2rem auto', padding: '2rem', backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
      <h2>Create New Event</h2>
      <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Fill out the details below to host a new event.</p>

      {error && (
        <div style={{ backgroundColor: '#fef2f2', color: '#ef4444', padding: '0.75rem', borderRadius: '6px', marginBottom: '1rem', border: '1px solid #fee2e2' }}>
          ⚠️ {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Event Title *</label>
          <input 
            type="text" 
            name="title" 
            value={formData.title} 
            onChange={handleChange} 
            required 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div>
          <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Description</label>
          <textarea 
            name="description" 
            value={formData.description} 
            onChange={handleChange} 
            rows="3" 
            style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Date *</label>
            <input 
              type="date" 
              name="date" 
              value={formData.date} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Location *</label>
            <input 
              type="text" 
              name="location" 
              value={formData.location} 
              onChange={handleChange} 
              required 
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Price (NPR)</label>
            <input 
              type="number" 
              name="price" 
              value={formData.price} 
              onChange={handleChange} 
              min="0" 
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>

          <div style={{ flex: 1 }}>
            <label style={{ display: 'block', marginBottom: '0.25rem', fontWeight: 'bold' }}>Total Seats *</label>
            <input 
              type="number" 
              name="totalSeats" 
              value={formData.totalSeats} 
              onChange={handleChange} 
              min="1" 
              required 
              style={{ width: '100%', padding: '0.5rem', borderRadius: '4px', border: '1px solid #ccc' }} 
            />
          </div>
        </div>

        <button 
          type="submit" 
          disabled={isSubmitting}
          style={{ 
            padding: '0.75rem', 
            backgroundColor: '#2563eb', 
            color: '#fff', 
            border: 'none', 
            borderRadius: '6px', 
            fontWeight: 'bold', 
            cursor: 'pointer',
            marginTop: '1rem'
          }}
        >
          {isSubmitting ? 'Creating Event...' : 'Publish Event'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;