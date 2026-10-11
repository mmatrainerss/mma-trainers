import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Clock, ShieldCheck } from 'lucide-react';

export const TargetAudience: React.FC = () => {
  return (
    <section className="py-20 bg-[#E63B30] relative overflow-hidden text-white">
      {/* Dynamic Background Pattern */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M0 40L40 0H20L0 20M40 40V20L20 40" fill="currentColor" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid-pattern)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:max-w-xl"
          >
            <h2 className="font-['Oswald'] text-4xl sm:text-5xl font-extrabold uppercase tracking-tight leading-tight mb-6 text-white drop-shadow-md">
              Tailored For The <br />
              <span className="text-black bg-white px-2 mt-1 inline-block">Busy Professional</span>
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed mb-8 font-medium">
              We know you don't have 2 hours to commute and wait for equipment. Our flexible training model is built around demanding schedules. Get an elite workout, learn real skills, and drop fat without sacrificing your career time.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4 shrink-0"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-5 rounded-2xl flex items-center gap-4">
              <Clock className="w-8 h-8 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Oswald'] tracking-wide text-lg">Time Efficient</h4>
                <p className="text-xs text-white/80">45-minute intense sessions</p>
              </div>
            </div>
            
            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-5 rounded-2xl flex items-center gap-4">
              <Briefcase className="w-8 h-8 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Oswald'] tracking-wide text-lg">Location Free</h4>
                <p className="text-xs text-white/80">Train from home or hotel</p>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-5 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-8 h-8 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Oswald'] tracking-wide text-lg">Accountability</h4>
                <p className="text-xs text-white/80">Coaches keep you on track</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
