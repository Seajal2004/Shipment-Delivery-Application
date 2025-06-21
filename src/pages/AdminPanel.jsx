import React, { useState, useEffect } from 'react';
import { db } from '../firebase';
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock, Shield } from 'lucide-react';
import { useAdmin } from '../hooks/useAdmin';
import toast from 'react-hot-toast';

const AdminPanel = () => {
  const { isAdmin } = useAdmin();
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-red-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Access Denied</h3>
          <p className="mt-1 text-sm text-gray-500">You don't have admin privileges.</p>
        </div>
      </div>
    );
  }

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'shipments'), (snapshot) => {
      const shipmentsData = [];
      snapshot.forEach((doc) => {
        shipmentsData.push({ id: doc.id, ...doc.data() });
      });
      setShipments(shipmentsData);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const updateStatus = async (shipmentId, newStatus) => {
    try {
      await updateDoc(doc(db, 'shipments', shipmentId), {
        status: newStatus,
        updatedAt: new Date()
      });
      toast.success(`Status updated to ${newStatus.replace('-', ' ')}`);
    } catch (error) {
      toast.error('Failed to update status');
      console.error('Error updating status:', error);
    }
  };

  const verifyPayment = async (shipmentId) => {
    try {
      await updateDoc(doc(db, 'shipments', shipmentId), {
        paymentStatus: 'verified',
        updatedAt: new Date()
      });
      toast.success('Payment verified successfully');
    } catch (error) {
      toast.error('Failed to verify payment');
      console.error('Error verifying payment:', error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'in-transit': return <Truck className="h-5 w-5 text-blue-500" />;
      case 'delivered': return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'not-delivered': return <Package className="h-5 w-5 text-red-500" />;
      case 'returned': return <Package className="h-5 w-5 text-orange-500" />;
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-red-50 to-orange-100 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-12 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-red-600 to-orange-600 bg-clip-text text-transparent flex items-center">
              <Shield className="h-10 w-10 mr-4 text-red-600" />
              Admin Panel
            </h1>
            <p className="text-gray-600 mt-2 text-lg">Manage all shipments and verify payments</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-lg">
            🔒 Admin Access Only
          </div>
        </div>
        
        <div className="bg-white/90 backdrop-blur-xl shadow-2xl rounded-3xl overflow-hidden border border-white/20">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200/50">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Tracking #</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Sender</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Receiver</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Status</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Payment</th>
                <th className="px-8 py-4 text-left text-sm font-bold text-gray-700 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white/50 divide-y divide-gray-200/30">
              {shipments.map((shipment, index) => (
                <tr key={shipment.id} className="hover:bg-white/80 transition-all duration-200">
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-bold text-gray-900">
                    {shipment.trackingNumber}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-700">
                    {shipment.senderName}
                  </td>
                  <td className="px-8 py-6 whitespace-nowrap text-sm font-medium text-gray-700">
                    {shipment.receiverName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(shipment.status)}
                      <span className="ml-2 text-sm text-gray-900 capitalize">
                        {shipment.status?.replace('-', ' ')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        shipment.paymentStatus === 'verified' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {shipment.paymentStatus === 'verified' ? 'Verified' : 'Pending'}
                      </span>
                      {shipment.amount && (
                        <span className="text-xs text-gray-500 mt-1">₹{shipment.amount}</span>
                      )}
                      {shipment.transactionId && (
                        <span className="text-xs text-gray-400 mt-1">
                          TXN: {shipment.transactionId.slice(0, 8)}...
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex flex-col space-y-2">
                      <select
                        value={shipment.status}
                        onChange={(e) => updateStatus(shipment.id, e.target.value)}
                        className="border-2 border-gray-300 rounded-xl px-3 py-2 text-sm font-medium focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white shadow-sm hover:shadow-md transition-all duration-200"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                        <option value="not-delivered">Not Delivered</option>
                        <option value="returned">Returned</option>
                      </select>
                      {shipment.paymentStatus === 'pending-verification' && (
                        <button
                          onClick={() => verifyPayment(shipment.id)}
                          className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:-translate-y-0.5"
                        >
                          ✓ Verify Payment
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;