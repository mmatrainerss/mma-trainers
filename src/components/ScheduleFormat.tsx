import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Clock, Calendar, ShieldCheck, Flame, MessageCircle, MapPin, CheckCircle2 } from 'lucide-react';
import { TRICITY_LOCATIONS } from '../data/martialArtsData';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

const SAMPLE_SLOTS = [
  { time: '06:30 AM – 07:30 AM', period: 'Morning Slot 1', buffer: 'Rest till 08:00 AM', tag: 'Fast Burn', popular: true },
  { time: '08:00 AM – 09:00 AM', period: 'Morning Slot 2', buffer: 'Rest till 09:30 AM', tag: 'High Energy', popular: false },
  { time: '09:30 AM – 10:30 AM', period: 'Morning Slot 3', buffer: 'Rest till 11:00 AM', tag: 'Senior / Gentle', popular: false },
  { time: '11:00 AM – 12:00 PM', period: 'Midday Slot 4', buffer: 'Rest till 12:30 PM', tag: 'Self Defence', popular: false },
  { time: '04:00 PM – 05:00 PM', period: 'Afternoon Slot 5', buffer: 'Rest till 05:30 PM', tag: 'Teens / Youth', popular: false },
  { time: '05:30 PM – 06:30 PM', period: 'Evening Slot 6', buffer: 'Rest till 07:00 PM', tag: 'Kickboxing', popular: false },
  { time: '07:00 PM – 08:00 PM', period: 'Prime Slot 7', buffer: 'Rest till 08:30 PM', tag: 'MMA / Boxing', popular: true },
  { time: '08:30 PM – 09:30 PM', period: 'Night Slot 8', buffer: 'Rest till 10:00 PM', tag: 'Professionals', popular: true },
  { time: '09:30 PM – 10:30 PM', period: 'Night Slot 9', buffer: 'Facility Wrap-up', tag: 'Late Night Pro', popular: false },
];

export const ScheduleFormat: React.FC = () => {
  const [selectedSlot, setSelectedSlot] = useState<string>('07:00 PM – 08:00 PM');
  const [selectedLocation, setSelectedLocation] = useState<string>('Chandigarh');

  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const handleBookSlotWhatsApp = () => {
    const message = `Hello MMA Trainers! I would like to reserve the timing slot [${selectedSlot}] in [${selectedLocation}]. Please confirm trainer availability.`;
    window.open(formatWhatsAppLink(phone, message), '_blank');
  };

  return (
    <section id="schedule" className="py-24 bg-[#0F0F10] text-white relative border-t border-white/5 select-none">
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
              SCHEDULE
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              16 Sessions Monthly
            </h2>
            <p className="text-sm text-neutral-400 font-normal">
              Alternate days training for optimal recovery. Continuous slots from 6:30 AM to 10:30 PM.
            </p>
          </motion.div>
        </div>

        {/* 3 Core Pillars of Training Schedule */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative group hover:border-[#E63B30]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E63B30]/15 flex items-center justify-center text-[#E63B30] mb-4">
              <Calendar className="w-5 h-5" />
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white mb-1.5">
              Alternate Days
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              16 sessions monthly on alternate days ensures deep muscular recovery and continuous adaptation.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative group hover:border-[#E63B30]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E63B30]/15 flex items-center justify-center text-[#E63B30] mb-4">
              <Clock className="w-5 h-5" />
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white mb-1.5">
              6:30 AM – 10:30 PM
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Continuous hourly slots from dawn to night. Choose timings that align with your lifestyle.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.16 }}
            className="bg-[#121212] border border-white/10 rounded-2xl p-6 relative group hover:border-[#E63B30]/40 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-[#E63B30]/15 flex items-center justify-center text-[#E63B30] mb-4">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white mb-1.5">
              30-Min Rest Buffer
            </h3>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Dedicated 30-minute buffer after each session for sanitization and undivided coaching attention.
            </p>
          </motion.div>
        </div>

        {/* Interactive Hourly Slot Selector */}
        <div className="bg-[#111111] border border-white/10 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-6 border-b border-white/10">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#E63B30] font-bold block mb-1">
                SLOT BROWSER
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white">
                Select Timing Slot
              </h3>
            </div>

            {/* Location Filter Chips */}
            <div className="flex flex-wrap items-center gap-1.5">
              {TRICITY_LOCATIONS.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => setSelectedLocation(loc.name)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider transition-all cursor-pointer ${
                    selectedLocation === loc.name
                      ? 'bg-[#E63B30] text-white shadow-sm'
                      : 'bg-white/5 text-neutral-400 hover:text-white hover:bg-white/10 border border-white/5'
                  }`}
                >
                  {loc.name}
                </button>
              ))}
            </div>
          </div>

          {/* Slots Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-6 mb-6">
            {SAMPLE_SLOTS.map((slot) => {
              const isSelected = selectedSlot === slot.time;

              return (
                <div
                  key={slot.time}
                  onClick={() => setSelectedSlot(slot.time)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                    isSelected
                      ? 'bg-[#E63B30]/15 border-[#E63B30]'
                      : 'bg-white/5 border-white/5 hover:border-white/15 hover:bg-white/[0.08]'
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-white">
                        {slot.time}
                      </span>
                      {slot.popular && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-[#E63B30] text-white uppercase">
                          Popular
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-0.5">
                      {slot.period}
                    </p>
                  </div>

                  <div className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                    isSelected
                      ? 'bg-[#E63B30] border-[#E63B30] text-white'
                      : 'border-white/20'
                  }`}>
                    {isSelected && <CheckCircle2 className="w-3 h-3" />}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Booking Action Strip */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 rounded-xl bg-black/50 border border-white/5">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#E63B30] shrink-0" />
              <p className="text-xs text-neutral-300">
                <span className="font-semibold text-white">{selectedLocation}</span> · {selectedSlot}
              </p>
            </div>

            <button
              onClick={handleBookSlotWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#E63B30]/20 cursor-pointer w-full sm:w-auto"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-white" />
              <span>Reserve Slot on WhatsApp</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
