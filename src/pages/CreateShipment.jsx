import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Package, User, MapPin, Calculator } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import UPIPayment from '../components/UPIPayment';

const CreateShipment = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPayment, setShowPayment] = useState(false);
  const [shipmentCost, setShipmentCost] = useState(0);
  const [formData, setFormData] = useState({
    senderName: '',
    senderAddress: '',
    senderPhone: '',
    receiverName: '',
    receiverAddress: '',
    receiverPhone: '',
    packageSize: 'small',
    packageWeight: '',
    packageDescription: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const generateTrackingNumber = () => {
    return 'ST' + Date.now().toString().slice(-8) + Math.random().toString(36).substr(2, 4).toUpperCase();
  };

  const calculateCost = () => {
    const baseCost = { small: 100, medium: 200, large: 300, 'extra-large': 500 };
    return baseCost[formData.packageSize] + (parseFloat(formData.packageWeight) * 10);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const cost = calculateCost();
    setShipmentCost(cost);
    setShowPayment(true);
  };

  const handlePaymentSuccess = async (transactionId) => {
    setLoading(true);
    try {
      const trackingNumber = generateTrackingNumber();
      await addDoc(collection(db, 'shipments'), {
        ...formData,
        trackingNumber,
        userId: currentUser.uid,
        status: 'pending',
        transactionId,
        amount: shipmentCost,
        paymentStatus: 'pending-verification',
        createdAt: new Date(),
        updatedAt: new Date()
      });
      toast.success(`Shipment created! Tracking: ${trackingNumber}`);
      navigate('/dashboard');
    } catch (error) {
      toast.error('Failed to create shipment');
      console.error('Error creating shipment:', error);
    }
    setLoading(false);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <motion.div 
          className="bg-white shadow-xl rounded-2xl overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Package className="h-6 w-6 mr-2" />
              Create New Shipment
            </h1>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <User className="h-5 w-5 mr-2" />
                  Sender Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="senderName"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.senderName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="senderAddress"
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.senderAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="senderPhone"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.senderPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900 flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Receiver Information
                </h3>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Name</label>
                  <input
                    type="text"
                    name="receiverName"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.receiverName}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <textarea
                    name="receiverAddress"
                    required
                    rows={3}
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.receiverAddress}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="tel"
                    name="receiverPhone"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.receiverPhone}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Calculator className="h-5 w-5 mr-2" />
                Package Details & Pricing
              </h3>
              
              {formData.packageSize && formData.packageWeight && (
                <div className="mb-4 p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    Estimated Cost: ₹{calculateCost()}
                  </p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Size</label>
                  <select
                    name="packageSize"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.packageSize}
                    onChange={handleChange}
                  >
                    <option value="small">Small</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="extra-large">Extra Large</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Weight (kg)</label>
                  <input
                    type="number"
                    name="packageWeight"
                    required
                    step="0.1"
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.packageWeight}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <input
                    type="text"
                    name="packageDescription"
                    required
                    className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.packageDescription}
                    onChange={handleChange}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={() => navigate('/dashboard')}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Shipment'}
              </button>
            </div>
          </form>
        </motion.div>
        
        {showPayment && (
          <UPIPayment
            amount={shipmentCost}
            onSuccess={handlePaymentSuccess}
            onClose={() => setShowPayment(false)}
          />
        )}
      </div>
    </div>
  );
};

export default CreateShipment;