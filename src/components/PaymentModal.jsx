import React from 'react';

const PaymentModal = ({ amount, onSuccess, onClose }) => {
  const handlePayment = () => {
    const options = {
      key: 'rzp_test_your_key_here', // Replace with your Razorpay key
      amount: amount * 100, // Amount in paise
      currency: 'INR',
      name: 'ShipTrack',
      description: 'Shipment Payment',
      handler: function (response) {
        onSuccess(response.razorpay_payment_id);
      },
      prefill: {
        name: 'Customer Name',
        email: 'customer@example.com',
      },
      theme: {
        color: '#2563eb'
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">Payment Required</h3>
        <p className="text-gray-600 mb-4">Amount to pay: ₹{amount}</p>
        <div className="flex space-x-4">
          <button
            onClick={handlePayment}
            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            Pay Now
          </button>
          <button
            onClick={onClose}
            className="flex-1 border border-gray-300 py-2 px-4 rounded hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;