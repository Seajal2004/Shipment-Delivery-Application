import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { BarChart3, TrendingUp, DollarSign, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { format, subDays, isAfter } from 'date-fns';

const Analytics = () => {
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

  const getRecentShipments = (days) => {
    const cutoffDate = subDays(new Date(), days);
    return shipments.filter(shipment => 
      shipment.createdAt?.toDate && isAfter(shipment.createdAt.toDate(), cutoffDate)
    );
  };

  const getTotalRevenue = () => {
    return shipments.reduce((total, shipment) => total + (shipment.amount || 0), 0);
  };

  const getStatusDistribution = () => {
    const distribution = { pending: 0, 'in-transit': 0, delivered: 0 };
    shipments.forEach(shipment => {
      distribution[shipment.status] = (distribution[shipment.status] || 0) + 1;
    });
    return distribution;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  const recentShipments = getRecentShipments(7);
  const totalRevenue = getTotalRevenue();
  const statusDistribution = getStatusDistribution();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <BarChart3 className="h-8 w-8 mr-3 text-purple-600" />
            Analytics Dashboard
          </h1>
          <p className="text-gray-600 mt-2">Track your shipment performance and insights</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">Total Revenue</p>
                <p className="text-2xl font-bold">₹{totalRevenue}</p>
              </div>
              <DollarSign className="h-10 w-10 text-blue-200" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">This Week</p>
                <p className="text-2xl font-bold">{recentShipments.length}</p>
              </div>
              <Calendar className="h-10 w-10 text-green-200" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">Success Rate</p>
                <p className="text-2xl font-bold">
                  {shipments.length > 0 ? Math.round((statusDistribution.delivered / shipments.length) * 100) : 0}%
                </p>
              </div>
              <TrendingUp className="h-10 w-10 text-purple-200" />
            </div>
          </motion.div>

          <motion.div
            className="bg-gradient-to-r from-orange-500 to-red-500 p-6 rounded-xl shadow-lg text-white"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">Avg. Cost</p>
                <p className="text-2xl font-bold">
                  ₹{shipments.length > 0 ? Math.round(totalRevenue / shipments.length) : 0}
                </p>
              </div>
              <BarChart3 className="h-10 w-10 text-orange-200" />
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold mb-4">Status Distribution</h3>
            <div className="space-y-4">
              {Object.entries(statusDistribution).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <span className="capitalize text-gray-700">{status.replace('-', ' ')}</span>
                  <div className="flex items-center space-x-2">
                    <div className="w-32 bg-gray-200 rounded-full h-2">
                      <div
                        className={`h-2 rounded-full ${
                          status === 'pending' ? 'bg-yellow-500' :
                          status === 'in-transit' ? 'bg-blue-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${shipments.length > 0 ? (count / shipments.length) * 100 : 0}%` }}
                      ></div>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            className="bg-white p-6 rounded-xl shadow-lg"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
            <div className="space-y-3">
              {recentShipments.slice(0, 5).map((shipment) => (
                <div key={shipment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm font-medium">{shipment.trackingNumber}</p>
                    <p className="text-xs text-gray-500">
                      {shipment.createdAt?.toDate ? format(shipment.createdAt.toDate(), 'MMM dd, HH:mm') : 'N/A'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    shipment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                    shipment.status === 'in-transit' ? 'bg-blue-100 text-blue-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {shipment.status}
                  </span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;