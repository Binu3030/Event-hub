import React from 'react';
import Navbar from './components/Navbar';

function App() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <h2>Welcome to the EventHub Workspace</h2>
        <p>Your responsive React client architecture is officially linked to the database engine.</p>
      </div>
    </div>
  );
}

export default App;