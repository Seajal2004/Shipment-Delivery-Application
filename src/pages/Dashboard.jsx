import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { Package, Plus, Truck, Clock, CheckCircle, TrendingUp, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import AnimatedCounter from '../components/AnimatedCounter';

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, 'shipments'),
        where('userId', '==', currentUser.uid)
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const shipmentsData = [];
        querySnapshot.forEach((doc) => {
          shipmentsData.push({ id: doc.id, ...doc.data() });
        });
        setShipments(shipmentsData);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-transit': return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'not-delivered': return <Package className="h-5 w-5 text-red-500" />;
      case 'returned': return <Package className="h-5 w-5 text-gray-500" />;
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'not-delivered': return 'bg-red-100 text-red-800';
      case 'returned': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <motion.div 
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Dashboard
            </h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your shipment overview</p>
          </div>
          <Link
            to="/create-shipment"
            className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-8 py-4 rounded-2xl hover:from-blue-700 hover:to-blue-800 flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Plus className="h-5 w-5" />
            <span className="font-semibold">New Shipment</span>
          </Link>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12">
          <motion.div 
            className="bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="text-center">
              <Package className="h-10 w-10 text-blue-200 mx-auto mb-2" />
              <p className="text-blue-100 text-sm">Total</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.length} />
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-yellow-500 via-orange-500 to-red-500 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="text-center">
              <Clock className="h-10 w-10 text-yellow-200 mx-auto mb-2" />
              <p className="text-yellow-100 text-sm">Pending</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.filter(s => s.status === 'pending').length} />
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <Truck className="h-10 w-10 text-purple-200 mx-auto mb-2" />
              <p className="text-purple-100 text-sm">In Transit</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.filter(s => s.status === 'in-transit').length} />
              </p>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-br from-green-500 via-green-600 to-emerald-600 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="text-center">
              <CheckCircle className="h-10 w-10 text-green-200 mx-auto mb-2" />
              <p className="text-green-100 text-sm">Delivered</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.filter(s => s.status === 'delivered').length} />
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-red-500 via-red-600 to-pink-600 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="text-center">
              <Package className="h-10 w-10 text-red-200 mx-auto mb-2" />
              <p className="text-red-100 text-sm">Not Delivered</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.filter(s => s.status === 'not-delivered').length} />
              </p>
            </div>
          </motion.div>

          <motion.div 
            className="bg-gradient-to-br from-gray-500 via-gray-600 to-slate-600 p-6 rounded-3xl shadow-2xl text-white transform hover:scale-105 transition-all duration-300"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <div className="text-center">
              <Package className="h-10 w-10 text-gray-200 mx-auto mb-2" />
              <p className="text-gray-100 text-sm">Returned</p>
              <p className="text-2xl font-bold">
                <AnimatedCounter end={shipments.filter(s => s.status === 'returned').length} />
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div 
          className="bg-white/80 backdrop-blur-lg shadow-2xl rounded-3xl overflow-hidden border border-white/20"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="px-8 py-6 border-b border-gray-200/50 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">Recent Shipments</h2>
            <p className="text-gray-600 text-sm mt-1">Track and manage your recent orders</p>
          </div>
          <div className="divide-y divide-gray-200">
            {shipments.length === 0 ? (
              <div className="px-6 py-8 text-center">
                <Package className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-sm font-medium text-gray-900">No shipments</h3>
                <p className="mt-1 text-sm text-gray-500">Get started by creating a new shipment.</p>
                <div className="mt-6">
                  <Link
                    to="/create-shipment"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
                  >
                    <Plus className="h-5 w-5 mr-2" />
                    New Shipment
                  </Link>
                </div>
              </div>
            ) : (
              shipments.map((shipment, index) => (
                <motion.div 
                  key={shipment.id} 
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      {getStatusIcon(shipment.status)}
                      <div className="ml-4">
                        <p className="text-sm font-medium text-gray-900">
                          {shipment.trackingNumber}
                        </p>
                        <p className="text-sm text-gray-500">
                          {shipment.senderName} → {shipment.receiverName}
                        </p>
                        <p className="text-xs text-gray-400 flex items-center mt-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          {shipment.createdAt?.toDate ? format(shipment.createdAt.toDate(), 'MMM dd, yyyy') : 'N/A'}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full ${getStatusColor(shipment.status)}`}>
                        {shipment.status?.replace('-', ' ')}
                      </span>
                      {shipment.amount && (
                        <span className="text-xs text-gray-500">₹{shipment.amount}</span>
                      )}
                      <Link
                        to={`/track/${shipment.trackingNumber}`}
                        className="bg-blue-600 text-white px-3 py-1 rounded text-xs hover:bg-blue-700 transition-colors"
                      >
                        Track
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;