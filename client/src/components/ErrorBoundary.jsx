import React, { Component } from 'react';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // You can log this error to an analytics service in production
    console.error("ErrorBoundary caught an uncaught exception:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          maxWidth: '500px',
          margin: '4rem auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
          border: '1px solid #fca5a5'
        }}>
          <h2 style={{ color: '#ef4444', marginBottom: '1rem' }}>Something went wrong.</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>
            We encountered an unexpected error loading this view. Try reloading the page.
          </p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.6rem 1.2rem',
              backgroundColor: '#2563eb',
              color: '#fff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            Reload Platform
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;