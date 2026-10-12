import React from 'react';
import { motion } from 'motion/react';
import { Home, MapPin, Check } from 'lucide-react';

export const TrainingModes: React.FC = () => {
  return (
    <section id="modes" className="py-20 sm:py-24 bg-[#0A0A0A] text-white relative border-t border-white/5 select-none">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        <div className="max-w-3xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              DELIVERY FORMAT
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Doorstep & Studio Training
            </h2>
            <p className="text-sm text-neutral-400 font-normal">
              Train in the comfort of your home or at our specialized combat dojos across Tricity.
            </p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Doorstep Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#111111] border border-white/10 rounded-2xl p-7 sm:p-8 hover:border-[#E63B30]/40 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-[#E63B30]/15 rounded-xl flex items-center justify-center mb-5 text-[#E63B30]">
                <Home className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-['Plus_Jakarta_Sans'] font-bold text-white mb-2">
                Doorstep Personal Training
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Certified trainers bring pads, boxing gloves, and conditioning equipment directly to your premises.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-white/5">
              {[
                'Full trainer mobility across Tricity',
                'Zero commute & maximum convenience',
                'Customized 1-on-1 pacing & focus',
                'All necessary pads & gear provided',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#E63B30] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          {/* Studio Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-[#111111] border border-white/10 rounded-2xl p-7 sm:p-8 hover:border-white/25 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center mb-5 text-neutral-300">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-['Plus_Jakarta_Sans'] font-bold text-white mb-2">
                Dojo & Studio Training
              </h3>
              <p className="text-neutral-400 text-xs sm:text-sm mb-6 leading-relaxed">
                Dedicated training mats, heavy bags, cage walls, and strength equipment at our regional hubs.
              </p>
            </div>
            <ul className="space-y-2.5 text-xs text-neutral-300 pt-4 border-t border-white/5">
              {[
                'Full dojo mats & combat cage area',
                'Heavy bag racks & technical gear',
                'Controlled sparring environment',
                'Central locations in Chandigarh & Mohali',
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2.5">
                  <Check className="w-3.5 h-3.5 text-[#E63B30] shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
