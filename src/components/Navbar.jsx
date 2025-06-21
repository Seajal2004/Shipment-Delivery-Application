import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useAdmin } from '../hooks/useAdmin';
import { Package, LogOut } from 'lucide-react';

const Navbar = () => {
  const { currentUser, logout } = useAuth();
  const { isAdmin } = useAdmin();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Failed to log out', error);
    }
  };

  return (
    <nav className="bg-blue-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <Package className="h-8 w-8" />
            <span className="font-bold text-xl">ShipTrack</span>
          </Link>
          
          {currentUser ? (
            <div className="flex items-center space-x-4">
              <Link to="/dashboard" className="hover:text-blue-200">Dashboard</Link>
              <Link to="/create-shipment" className="hover:text-blue-200">New Shipment</Link>
              <Link to="/analytics" className="hover:text-blue-200">Analytics</Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-blue-200 bg-blue-700 px-2 py-1 rounded">
                  Admin
                </Link>
              )}
              <button onClick={handleLogout} className="flex items-center space-x-1 hover:text-blue-200">
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="space-x-4">
              <Link to="/login" className="hover:text-blue-200">Login</Link>
              <Link to="/register" className="bg-blue-700 px-4 py-2 rounded hover:bg-blue-800">Register</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;