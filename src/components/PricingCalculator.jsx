import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Calculator, Package, Truck, Zap } from 'lucide-react';

const PricingCalculator = ({ onPriceChange }) => {
  const [formData, setFormData] = useState({
    packageSize: 'small',
    packageWeight: '',
    distance: 'local',
    priority: 'standard'
  });

  const [price, setPrice] = useState(0);

  const pricing = {
    size: { small: 100, medium: 200, large: 300, 'extra-large': 500 },
    distance: { local: 1, regional: 1.5, national: 2.5, international: 4 },
    priority: { standard: 1, express: 1.5, overnight: 2.5 }
  };

  useEffect(() => {
    const basePrice = pricing.size[formData.packageSize] || 100;
    const weightPrice = parseFloat(formData.packageWeight) * 10 || 0;
    const distanceMultiplier = pricing.distance[formData.distance] || 1;
    const priorityMultiplier = pricing.priority[formData.priority] || 1;
    
    const calculatedPrice = Math.round((basePrice + weightPrice) * distanceMultiplier * priorityMultiplier);
    setPrice(calculatedPrice);
    onPriceChange?.(calculatedPrice);
  }, [formData, onPriceChange]);

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <motion.div
      className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center mb-4">
        <Calculator className="h-6 w-6 text-blue-600 mr-2" />
        <h3 className="text-lg font-bold text-gray-900">Pricing Calculator</h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Package Size</label>
          <select
            value={formData.packageSize}
            onChange={(e) => handleChange('packageSize', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="small">Small (₹100)</option>
            <option value="medium">Medium (₹200)</option>
            <option value="large">Large (₹300)</option>
            <option value="extra-large">Extra Large (₹500)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Weight (kg)</label>
          <input
            type="number"
            step="0.1"
            placeholder="0.0"
            value={formData.packageWeight}
            onChange={(e) => handleChange('packageWeight', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Distance</label>
          <select
            value={formData.distance}
            onChange={(e) => handleChange('distance', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="local">Local (Same City)</option>
            <option value="regional">Regional (+50%)</option>
            <option value="national">National (+150%)</option>
            <option value="international">International (+300%)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Priority</label>
          <select
            value={formData.priority}
            onChange={(e) => handleChange('priority', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="standard">Standard</option>
            <option value="express">Express (+50%)</option>
            <option value="overnight">Overnight (+150%)</option>
          </select>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border-2 border-blue-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Package className="h-5 w-5 text-blue-600 mr-2" />
            <span className="text-gray-700 font-medium">Estimated Cost:</span>
          </div>
          <div className="text-2xl font-bold text-blue-600">
            ₹{price}
          </div>
        </div>
        
        <div className="mt-3 flex items-center text-sm text-gray-600">
          <Truck className="h-4 w-4 mr-1" />
          <span>Includes tracking & insurance</span>
        </div>
      </div>
    </motion.div>
  );
};

export default PricingCalculator;