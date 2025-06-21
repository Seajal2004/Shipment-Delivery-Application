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
      default: return <Package className="h-5 w-5 text-gray-500" />;
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
    </div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Shield className="h-8 w-8 mr-3 text-red-600" />
            Admin Panel
          </h1>
          <div className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
            Admin Access Only
          </div>
        </div>
        
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking #</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sender</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Receiver</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Payment</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {shipments.map((shipment) => (
                <tr key={shipment.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {shipment.trackingNumber}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {shipment.senderName}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
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
                        className="border border-gray-300 rounded px-2 py-1 text-xs"
                      >
                        <option value="pending">Pending</option>
                        <option value="in-transit">In Transit</option>
                        <option value="delivered">Delivered</option>
                      </select>
                      {shipment.paymentStatus === 'pending-verification' && (
                        <button
                          onClick={() => verifyPayment(shipment.id)}
                          className="bg-green-600 text-white px-2 py-1 rounded text-xs hover:bg-green-700"
                        >
                          Verify Payment
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
  );
};

export default AdminPanel;