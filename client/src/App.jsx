import React from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';

function App() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ padding: '2rem' }}>
        <Login />
      </main>
    </div>
  );
}

export default App;