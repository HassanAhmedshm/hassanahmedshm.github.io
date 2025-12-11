import React from 'react';
import { motion } from 'framer-motion';

const timelineData = [
  {
    id: 1,
    year: "2024",
    title: "NASA Space Apps Challenge",
    description: "Participated and achieved recognition in the global hackathon, developing innovative solutions for space exploration challenges."
  },
  {
    id: 2,
    year: "2023",
    title: "International Delegation",
    description: "Selected to represent the country in educational delegations to Japan and Germany, fostering global technological exchange."
  },
  {
    id: 3,
    year: "2023",
    title: "Joined WE School",
    description: "Enrolled in the Applied Technology school, specializing in advanced software development and computer systems."
  }
];

const Timeline = () => {
  return (
    <section id="timeline" className="py-24 bg-dark relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        <motion.div 
            initial={{ opacity: 0 }} 
            whileInView={{ opacity: 1 }} 
            viewport={{ once: true }}
            className="mb-16 text-center"
        >
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Timeline</h2>
            <div className="h-1 w-20 bg-primary rounded-full mx-auto" />
        </motion.div>

        <div className="relative border-l-2 border-border ml-4 md:ml-0 space-y-12">
          {timelineData.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.2 }}
              className="relative pl-8 md:pl-12"
            >
              {/* Dot on the line */}
              <div className="absolute -left-[9px] top-0 p-1 bg-dark border-2 border-primary rounded-full">
                <div className="w-2 h-2 bg-primary rounded-full" />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                <span className="text-primary font-mono text-xl font-bold">{item.year}</span>
                <h3 className="text-xl font-bold text-white">{item.title}</h3>
              </div>
              
              <p className="text-gray-400 max-w-xl">
                {item.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Timeline;