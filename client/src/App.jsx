// import React from 'react';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';

// function App() {
//   return (
//     <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
//       <Navbar />
//       <main style={{ padding: '2rem' }}>
//         <Login />
//       </main>
//     </div>
//   );
// }

// export default App;






import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';

function App() {
  return (
    <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
      <Navbar />
      <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
        <Dashboard />
      </main>
    </div>
  );
}

export default App;