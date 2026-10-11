import React from 'react';
import { motion } from 'motion/react';
import { Laptop, MapPin, CheckCircle2 } from 'lucide-react';

export const TrainingModes: React.FC = () => {
  return (
    <section className="py-24 bg-[#141414] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              FLEXIBLE OPTIONS
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              Train On Your Terms
            </h2>
            <p className="mt-4 text-neutral-400 text-sm sm:text-base max-w-2xl mx-auto">
              Choose the training mode that fits your schedule, or combine both for maximum results.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Online Training Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0D0D0D] border border-white/10 rounded-3xl p-8 sm:p-10 hover:border-[#E63B30]/50 transition-colors flex flex-col"
          >
            <div className="w-14 h-14 bg-[#E63B30]/10 rounded-2xl flex items-center justify-center mb-6 border border-[#E63B30]/20">
              <Laptop className="w-7 h-7 text-[#E63B30]" />
            </div>
            <h3 className="text-2xl font-['Oswald'] font-bold text-white uppercase tracking-tight mb-3">
              At-Home Online Training
            </h3>
            <p className="text-neutral-400 text-sm mb-8 flex-1">
              Interactive live video sessions with certified coaches designed for professionals with tight schedules. Train from your living room with no commute.
            </p>
            <ul className="space-y-4">
              {['Live 1-on-1 coaching', 'No equipment needed to start', 'Perfect for busy schedules', 'Form correction in real-time'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#E63B30] shrink-0" />
                  <span className="text-sm text-neutral-200">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Offline Training Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#0D0D0D] border border-white/10 rounded-3xl p-8 sm:p-10 hover:border-white/30 transition-colors flex flex-col"
          >
            <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10">
              <MapPin className="w-7 h-7 text-white" />
            </div>
            <h3 className="text-2xl font-['Oswald'] font-bold text-white uppercase tracking-tight mb-3">
              Offline Personal Training
            </h3>
            <p className="text-neutral-400 text-sm mb-8 flex-1">
              Direct 1-on-1 hands-on coaching sessions. Perfect for deep technical work, heavy pad sessions, and intense physical conditioning.
            </p>
            <ul className="space-y-4">
              {['Hands-on technique correction', 'Pad work and sparring drills', 'Access to professional gear', 'High-intensity pacing'].map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-neutral-400 shrink-0" />
                  <span className="text-sm text-neutral-200">{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
