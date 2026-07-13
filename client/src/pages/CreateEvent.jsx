import React, { useState } from 'react';
import API from '../api';

const CreateEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    location: '',
    totalSeats: '',
    price: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Send data to your Day 5 event generation backend endpoint
      const response = await API.post('/events', {
        ...formData,
        totalSeats: parseInt(formData.totalSeats),
        price: parseFloat(formData.price)
      });
      
      alert('Event successfully published and listed live!');
      // Reset form fields
      setFormData({ title: '', description: '', date: '', location: '', totalSeats: '', price: '' });
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to initialize event hosting profile.');
    } finally {
      setLoading(false);
    }
  };

  const styles = {
    container: {
      maxWidth: '600px',
      margin: '0 auto',
      backgroundColor: '#ffffff',
      padding: '2rem',
      borderRadius: '8px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #e2e8f0'
    },
    title: {
      fontSize: '1.5rem',
      fontWeight: 'bold',
      color: '#0f172a',
      marginBottom: '1.5rem'
    },
    formGroup: {
      marginBottom: '1.25rem',
      textAlign: 'left'
    },
    label: {
      display: 'block',
      fontSize: '0.875rem',
      fontWeight: '600',
      color: '#475569',
      marginBottom: '0.5rem'
    },
    input: {
      width: '100%',
      padding: '0.65rem',
      borderRadius: '6px',
      border: '1px solid #cbd5e1',
      fontSize: '1rem',
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
      marginTop: '0.5rem'
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📣 Host a New Event</h2>
      <form onSubmit={handleSubmit}>
        <div style={styles.formGroup}>
          <label style={styles.label}>Event Title</label>
          <input type="text" name="title" required style={styles.input} value={formData.title} onChange={handleChange} placeholder="e.g., Tech Con 2026" />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Description</label>
          <textarea name="description" required style={{ ...styles.input, height: '80px', resize: 'vertical' }} value={formData.description} onChange={handleChange} placeholder="Describe your event details..." />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Date</label>
          <input type="date" name="date" required style={styles.input} value={formData.date} onChange={handleChange} />
        </div>

        <div style={styles.formGroup}>
          <label style={styles.label}>Venue Location</label>
          <input type="text" name="location" required style={styles.input} value={formData.location} onChange={handleChange} placeholder="e.g., Virtual or Kathmandu, Nepal" />
        </div>

        <div style={{ display: 'flex', gap: '1rem' }}>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Total Seat Capacity</label>
            <input type="number" name="totalSeats" required style={styles.input} value={formData.totalSeats} onChange={handleChange} placeholder="100" />
          </div>
          <div style={{ ...styles.formGroup, flex: 1 }}>
            <label style={styles.label}>Ticket Price (Rs.)</label>
            <input type="number" name="price" required style={styles.input} value={formData.price} onChange={handleChange} placeholder="1500" />
          </div>
        </div>

        <button type="submit" disabled={loading} style={styles.btn}>
          {loading ? 'Publishing Event Structure...' : 'Deploy Event Live'}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;