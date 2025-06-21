import React, { useState, useEffect } from 'react';
import { Copy, CheckCircle } from 'lucide-react';
import QRCode from 'qrcode';

const UPIPayment = ({ amount, onSuccess, onClose }) => {
  const [paymentProof, setPaymentProof] = useState('');
  const [copied, setCopied] = useState(false);
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const upiId = import.meta.env.VITE_UPI_ID || '9034733880@pthdfc';
  const upiLink = `upi://pay?pa=${upiId}&pn=ShipTrack&am=${amount}&cu=INR&tn=Shipment Payment`;

  useEffect(() => {
    QRCode.toDataURL(upiLink)
      .then(url => setQrCodeUrl(url))
      .catch(err => console.error(err));
  }, [upiLink]);
  
  const copyUPI = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSubmitProof = () => {
    if (paymentProof.trim()) {
      onSuccess(paymentProof);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold mb-4">UPI Payment</h3>
        <p className="text-gray-600 mb-4">Amount: ₹{amount}</p>
        
        <div className="space-y-4">
          <div className="text-center">
            {qrCodeUrl ? (
              <img src={qrCodeUrl} alt="UPI QR Code" className="h-32 w-32 mx-auto mb-2" />
            ) : (
              <div className="h-32 w-32 mx-auto mb-2 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">Loading QR...</span>
              </div>
            )}
            <p className="text-sm text-gray-500">Scan QR or use UPI ID below</p>
          </div>
          
          <div className="flex items-center space-x-2 p-3 bg-gray-50 rounded">
            <span className="flex-1 text-sm">{upiId}</span>
            <button
              onClick={copyUPI}
              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700"
            >
              {copied ? <CheckCircle className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
              <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
            </button>
          </div>
          
          <a
            href={upiLink}
            className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700"
          >
            Pay with UPI App
          </a>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Payment Reference/Transaction ID:
            </label>
            <input
              type="text"
              placeholder="Enter transaction ID after payment"
              className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={paymentProof}
              onChange={(e) => setPaymentProof(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-4">
            <button
              onClick={handleSubmitProof}
              disabled={!paymentProof.trim()}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              Confirm Payment
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
    </div>
  );
};

export default UPIPayment;