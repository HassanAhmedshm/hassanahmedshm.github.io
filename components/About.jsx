import React from 'react';
import { motion } from 'framer-motion';

const About = () => {
  const beliefs = [
    "AI should empower, not replace",
    "Automation > Repetition",
    "Learning never stops",
    "Life is the best teacher",
    "Better to try and fail than wonder 'what if'"
  ];

  return (
    <section id="about" className="py-24 bg-dark relative">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="mb-16 text-center"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">What I Believe</h2>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
        </motion.div>

        <div className="max-w-3xl mx-auto">
          <div className="space-y-8">
            {beliefs.map((belief, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center"
              >
                <p className="text-xl md:text-2xl text-gray-300 font-light italic">
                  "{belief}"
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;