import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import NotificationSystem from './components/NotificationSystem';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreateShipment from './pages/CreateShipment';
import TrackShipment from './pages/TrackShipment';
import AdminPanel from './pages/AdminPanel';
import Analytics from './pages/Analytics';
import AdminRoute from './components/AdminRoute';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <NotificationSystem />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/track/:trackingNumber" element={<TrackShipment />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute>
                  <AdminRoute>
                    <AdminPanel />
                  </AdminRoute>
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/analytics" 
              element={
                <ProtectedRoute>
                  <Analytics />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/create-shipment" 
              element={
                <ProtectedRoute>
                  <CreateShipment />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
