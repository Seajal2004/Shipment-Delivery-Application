import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { Package, Truck, CheckCircle, Clock, MapPin } from 'lucide-react';

const TrackShipment = () => {
  const { trackingNumber } = useParams();
  const [shipment, setShipment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const q = query(
          collection(db, 'shipments'),
          where('trackingNumber', '==', trackingNumber)
        );
        const querySnapshot = await getDocs(q);
        
        if (!querySnapshot.empty) {
          const doc = querySnapshot.docs[0];
          setShipment({ id: doc.id, ...doc.data() });
        } else {
          setError('Shipment not found');
        }
      } catch (error) {
        setError('Error fetching shipment details');
      }
      setLoading(false);
    };

    if (trackingNumber) {
      fetchShipment();
    }
  }, [trackingNumber]);

  const getStatusSteps = () => {
    const steps = [
      { key: 'pending', label: 'Order Placed', icon: Package },
      { key: 'in-transit', label: 'In Transit', icon: Truck },
      { key: 'delivered', label: 'Delivered', icon: CheckCircle }
    ];

    const currentIndex = steps.findIndex(step => step.key === shipment?.status);
    
    return steps.map((step, index) => ({
      ...step,
      completed: index <= currentIndex,
      current: index === currentIndex
    }));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Package className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">{error}</h3>
          <p className="mt-1 text-sm text-gray-500">Please check your tracking number and try again.</p>
        </div>
      </div>
    );
  }

  const statusSteps = getStatusSteps();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white shadow rounded-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Track Shipment: {trackingNumber}
            </h1>
          </div>

          <div className="p-6">
            <div className="mb-8">
              <div className="flex items-center justify-between">
                {statusSteps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div className={`flex items-center justify-center w-12 h-12 rounded-full ${
                        step.completed ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'
                      }`}>
                        <Icon className="h-6 w-6" />
                      </div>
                      <div className="mt-2 text-center">
                        <p className={`text-sm font-medium ${
                          step.completed ? 'text-blue-600' : 'text-gray-500'
                        }`}>
                          {step.label}
                        </p>
                      </div>
                      {index < statusSteps.length - 1 && (
                        <div className={`absolute top-6 left-1/2 w-full h-0.5 ${
                          step.completed ? 'bg-blue-600' : 'bg-gray-200'
                        }`} style={{ transform: 'translateX(50%)', width: 'calc(100% - 3rem)' }} />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Sender Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{shipment.senderName}</p>
                  <p className="text-sm text-gray-600 mt-1">{shipment.senderAddress}</p>
                  <p className="text-sm text-gray-600">{shipment.senderPhone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-medium text-gray-900">Receiver Details</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="font-medium">{shipment.receiverName}</p>
                  <p className="text-sm text-gray-600 mt-1">{shipment.receiverAddress}</p>
                  <p className="text-sm text-gray-600">{shipment.receiverPhone}</p>
                </div>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Package Size</h4>
                <p className="text-sm text-gray-600 capitalize">{shipment.packageSize}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Weight</h4>
                <p className="text-sm text-gray-600">{shipment.packageWeight} kg</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="font-medium text-gray-900">Description</h4>
                <p className="text-sm text-gray-600">{shipment.packageDescription}</p>
              </div>
            </div>

            <div className="mt-6 bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-5 w-5 text-blue-600 mr-2" />
                <div>
                  <p className="font-medium text-blue-900">Current Status</p>
                  <p className="text-sm text-blue-700 capitalize">
                    {shipment.status.replace('-', ' ')} - Last updated: {
                      shipment.updatedAt?.toDate?.()?.toLocaleDateString() || 'N/A'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackShipment;