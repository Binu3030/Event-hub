import React from 'react';
import Head from 'next/head';
import { AuthProvider } from '../context/AuthContext';
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <Head>
        <title>EventHub</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      <div
        style={{
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          fontFamily: 'Inter, system-ui, -apple-system, sans-serif',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Navbar />

        <main
          style={{
            flex: '1',
            width: '100%',
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '2rem 1rem',
            boxSizing: 'border-box',
          }}
        >
          <Component {...pageProps} />
        </main>

        <ToastContainer
          position="top-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          pauseOnHover
          theme="colored"
        />
      </div>
    </AuthProvider>
  );
}