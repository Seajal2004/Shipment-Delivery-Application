import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  Smartphone, 
  CreditCard, 
  BarChart3, 
  Shield, 
  Clock, 
  Users,
  MapPin,
  Bell
} from 'lucide-react';

const Features = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });

  const features = [
    {
      icon: Smartphone,
      title: 'Mobile Optimized',
      description: 'Track shipments on any device with our responsive design',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: CreditCard,
      title: 'UPI Payments',
      description: 'Secure UPI payments with QR code generation',
      color: 'from-green-500 to-green-600'
    },
    {
      icon: BarChart3,
      title: 'Analytics Dashboard',
      description: 'Track revenue, shipment stats and performance metrics',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Shield,
      title: 'Admin Controls',
      description: 'Role-based access with admin panel for status management',
      color: 'from-red-500 to-red-600'
    },
    {
      icon: Clock,
      title: 'Status Tracking',
      description: 'Real-time shipment status updates and tracking',
      color: 'from-yellow-500 to-orange-500'
    },
    {
      icon: Users,
      title: 'User Management',
      description: 'Secure authentication with Firebase integration',
      color: 'from-indigo-500 to-indigo-600'
    }
  ];

  return (
    <section className="py-20 bg-gray-50" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Professional Features
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Built for modern logistics with enterprise-grade features and intuitive design
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.1 }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">
                  {feature.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;