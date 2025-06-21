import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { db } from '../firebase';
import { collection, onSnapshot } from 'firebase/firestore';
import AnimatedCounter from './AnimatedCounter';

const Stats = () => {
  const [ref, inView] = useInView({ triggerOnce: true, threshold: 0.1 });
  const [shipments, setShipments] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const totalShipments = shipments.length;
  const deliveredShipments = shipments.filter(s => s.status === 'delivered').length;
  const successRate = totalShipments > 0 ? Math.round((deliveredShipments / totalShipments) * 100) : 0;
  const totalUsers = new Set(shipments.map(s => s.userId)).size;

  const stats = [
    { number: totalShipments, suffix: '', label: 'Total Shipments', color: 'text-blue-600' },
    { number: deliveredShipments, suffix: '', label: 'Successfully Delivered', color: 'text-green-600' },
    { number: successRate, suffix: '%', label: 'Delivery Success Rate', color: 'text-purple-600' },
    { number: totalUsers, suffix: '', label: 'Active Users', color: 'text-orange-600' }
  ];

  return (
    <section className="py-20 bg-gradient-to-r from-blue-900 to-purple-900" ref={ref}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
            Real-Time Statistics
          </h2>
          <p className="text-xl text-blue-200 max-w-3xl mx-auto">
            Live data from our platform showing actual shipment performance and user activity
          </p>
        </motion.div>

        {loading ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto mb-4"></div>
            <p className="text-blue-200">Loading real-time statistics...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                className="text-center"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={inView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.8, delay: index * 0.2 }}
              >
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 hover:bg-white/20 transition-all duration-300">
                  <div className={`text-4xl md:text-5xl font-bold text-white mb-2`}>
                    {inView && <AnimatedCounter end={stat.number} />}
                    {stat.suffix}
                  </div>
                  <div className="text-blue-200 font-medium text-lg">
                    {stat.label}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Stats;