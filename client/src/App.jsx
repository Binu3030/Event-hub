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






// import React from 'react';
// import Navbar from './components/Navbar';
// import Dashboard from './pages/Dashboard';

// function App() {
//   return (
//     <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
//       <Navbar />
//       <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
//         <Dashboard />
//       </main>
//     </div>
//   );
// }

// export default App;






// import React from 'react';
// import Navbar from './components/Navbar';
// import CreateEvent from './pages/CreateEvent';

// function App() {
//   return (
//     <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
//       <Navbar />
//       <main style={{ padding: '2rem' }}>
//         <CreateEvent />
//       </main>
//     </div>
//   );
// }

// export default App;





// import React from 'react';
// import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Login from './pages/Login';
// import Dashboard from './pages/Dashboard';
// import CreateEvent from './pages/CreateEvent';

// function App() {
//   return (
//     <Router>
//       <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
//         <Navbar />
//         <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
//           <Routes>
//             {/* Direct guest users straight to login by default */}
//             <Route path="/" element={<Navigate to="/login" replace />} />
            
//             {/* Core Application Routes */}
//             <Route path="/login" element={<Login />} />
//             <Route path="/dashboard" element={<Dashboard />} />
//             <Route path="/create-event" element={<CreateEvent />} />
            
//             {/* Fallback route for unknown URLs */}
//             <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '2rem' }}><h3>404: Page Not Found</h3></div>} />
//           </Routes>
//         </main>
//       </div>
//     </Router>
//   );
// }

// export default App;












import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateEvent from './pages/CreateEvent';
import MyBookings from './pages/MyBookings';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <Router>
      <div style={{ backgroundColor: '#f8fafc', minHeight: '100vh', fontFamily: 'sans-serif' }}>
        <Navbar />
        <main style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
          <Routes>
            {/* Redirect root path to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            
            {/* Public Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Route: Accessible by any logged-in user */}
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Route: Booking tracker for logged-in attendees/organizers */}
            <Route 
              path="/my-bookings" 
              element={
                <ProtectedRoute>
                  <MyBookings />
                </ProtectedRoute>
              } 
            />
            
            {/* Protected Route: Restricted strictly to organizers */}
            <Route 
              path="/create-event" 
              element={
                <ProtectedRoute allowedRoles={['organizer']}>
                  <CreateEvent />
                </ProtectedRoute>
              } 
            />
            
            {/* Fallback 404 Route */}
            <Route path="*" element={<div style={{ textAlign: 'center', marginTop: '2rem' }}><h3>404: Page Not Found</h3></div>} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;