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
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'in-transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <Link
            to="/create-shipment"
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
          >
            <Plus className="h-5 w-5" />
            <span>New Shipment</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Shipments</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter end={shipments.length} />
                </p>
              </div>
              <Package className="h-12 w-12 text-blue-200" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-yellow-500 to-orange-500 p-6 rounded-lg shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-yellow-100">Pending</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter end={shipments.filter(s => s.status === 'pending').length} />
                </p>
              </div>
              <Clock className="h-12 w-12 text-yellow-200" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">In Transit</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter end={shipments.filter(s => s.status === 'in-transit').length} />
                </p>
              </div>
              <Truck className="h-12 w-12 text-purple-200" />
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg text-white"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">Delivered</p>
                <p className="text-3xl font-bold">
                  <AnimatedCounter end={shipments.filter(s => s.status === 'delivered').length} />
                </p>
              </div>
              <CheckCircle className="h-12 w-12 text-green-200" />
            </div>
          </motion.div>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Recent Shipments</h2>
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
        </div>
      </div>
    </div>
  );
};

export default Dashboard;