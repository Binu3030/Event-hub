'use client';

import React, { useContext, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import { AuthContext } from '../context/AuthContext';

export default function Home() {
  const { user } = useContext(AuthContext);
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    }
  }, [user, router]);

  return (
    <div style={{ textAlign: 'center', padding: '4rem 1rem' }}>
      <h1 style={{ fontSize: '2.5rem', color: '#0f172a', marginBottom: '1rem' }}>
        Welcome to EventHub 🎉
      </h1>
      <p style={{ fontSize: '1.1rem', color: '#64748b', maxWidth: '600px', margin: '0 auto 2rem' }}>
        Discover, book, and organize live events seamlessly in one platform.
      </p>

      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <Link 
          href="/login" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#2563eb', 
            color: '#fff', 
            borderRadius: '6px', 
            textDecoration: 'none',
            fontWeight: '600' 
          }}
        >
          Sign In
        </Link>
        <Link 
          href="/register" 
          style={{ 
            padding: '0.75rem 1.5rem', 
            backgroundColor: '#0f172a', 
            color: '#fff', 
            borderRadius: '6px', 
            textDecoration: 'none',
            fontWeight: '600' 
          }}
        >
          Create Account
        </Link>
      </div>
    </div>
  );
}