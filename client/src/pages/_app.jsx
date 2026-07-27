import React from 'react';
import { AuthProvider } from '../context/AuthContext'; // Adjust path if needed
import Navbar from '../components/Navbar';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function MyApp({ Component, pageProps }) {
  return (
    <AuthProvider>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
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