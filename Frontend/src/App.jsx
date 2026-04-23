import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AnalyticsPage from './pages/Analytics'; // The wrapper we discussed

function App() {
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Helper for protected routes
  const ProtectedRoute = ({ children }) => {
    return token ? children : <Navigate to="/" />;
  };

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={
          token ? <Navigate to="/dashboard" /> : <LandingPage onGetStarted={() => window.location.href='/login'} />
        } />
        
        <Route path="/login" element={
          <Login setToken={(t) => { setToken(t); localStorage.setItem('token', t); }} />
        } />

        {/* Protected Private Routes */}
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard onLogout={() => { setToken(null); localStorage.removeItem('token'); }} />
          </ProtectedRoute>
        } />

        <Route path="/analytics" element={
          <ProtectedRoute>
            <AnalyticsPage />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;