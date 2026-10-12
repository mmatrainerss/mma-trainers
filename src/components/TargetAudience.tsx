import React from 'react';
import { motion } from 'motion/react';
import { Briefcase, Clock, ShieldCheck } from 'lucide-react';

export const TargetAudience: React.FC = () => {
  return (
    <section className="py-20 bg-[#E63B30] relative overflow-hidden text-white select-none">
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

      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="lg:max-w-xl"
          >
            <span className="text-[11px] font-mono tracking-widest uppercase bg-black/20 px-3 py-1 rounded-full text-white inline-block mb-4 font-semibold">
              FITNESS ON YOUR TERMS
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white">
              Built For Busy Professionals.
            </h2>
            <p className="text-white/90 text-sm sm:text-base leading-relaxed font-normal">
              Zero commute wasted in traffic. Choose continuous hourly slots from 6:30 AM to 10:30 PM with doorstep training across Chandigarh, Mohali and Panchkula.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="w-full lg:w-auto grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-3 shrink-0"
          >
            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
              <Clock className="w-6 h-6 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base">Hourly Flexibility</h4>
                <p className="text-xs text-white/80">6:30 AM – 10:30 PM slots</p>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
              <Briefcase className="w-6 h-6 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base">Doorstep Visits</h4>
                <p className="text-xs text-white/80">Train at home or local dojo</p>
              </div>
            </div>

            <div className="bg-black/20 backdrop-blur-sm border border-white/20 p-4 sm:p-5 rounded-2xl flex items-center gap-4">
              <ShieldCheck className="w-6 h-6 text-white shrink-0" />
              <div>
                <h4 className="font-bold font-['Plus_Jakarta_Sans'] text-sm sm:text-base">16 Sessions / Month</h4>
                <p className="text-xs text-white/80">Alternate days recovery</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
