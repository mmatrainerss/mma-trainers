import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Navigation, ArrowUpRight, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { TRICITY_LOCATIONS } from '../data/martialArtsData';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

export const TricityLocations: React.FC = () => {
  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const handleLocationInquiry = (locationName: string, tier: string, price: string) => {
    const text = `Hello MMA Trainers! I want to inquire about training in ${locationName} (${tier} - ${price}). Please let me know how doorstep trainer visits work and available timing slots.`;
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <section id="locations" className="py-24 bg-[#0A0A0A] text-white relative border-t border-white/5 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              LOCATIONS
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Tricity Training Hubs
            </h2>
            <p className="text-sm text-neutral-400 font-normal">
              Doorstep and dedicated training available across all prime sectors and belts.
            </p>
          </motion.div>
        </div>

        {/* 6 Grid Cards for Locations */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {TRICITY_LOCATIONS.map((loc, index) => {
            const isZone1 = loc.tier === 'Zone 1';

            return (
              <motion.div
                key={loc.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.06 }}
                onClick={() => handleLocationInquiry(loc.name, loc.tier, loc.price)}
                className="bg-[#111111] border border-white/10 hover:border-[#E63B30]/50 rounded-2xl p-6 transition-all duration-200 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span
                      className={`px-2.5 py-1 rounded-md text-[10px] font-mono font-bold uppercase tracking-wider ${
                        isZone1
                          ? 'bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30'
                          : 'bg-white/10 text-neutral-300 border border-white/10'
                      }`}
                    >
                      {loc.tier} · {loc.price}
                    </span>
                    <Navigation className="w-3.5 h-3.5 text-neutral-500 group-hover:text-[#E63B30] transition-colors" />
                  </div>

                  <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white mb-1.5 group-hover:text-[#E63B30] transition-colors">
                    {loc.name}
                  </h3>

                  <p className="text-xs text-neutral-400 mb-4 leading-relaxed font-normal">
                    {loc.description}
                  </p>

                  <div className="inline-flex items-center gap-1.5 text-[11px] font-medium text-neutral-300 bg-white/5 px-2.5 py-1 rounded-lg border border-white/5">
                    <CheckCircle2 className="w-3 h-3 text-[#E63B30]" />
                    <span>{loc.highlight}</span>
                  </div>
                </div>

                <div className="pt-4 mt-5 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold text-neutral-400 group-hover:text-white transition-colors">
                    Book in {loc.name}
                  </span>
                  <div className="w-7 h-7 rounded-lg bg-white/5 group-hover:bg-[#E63B30] text-white flex items-center justify-center transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
