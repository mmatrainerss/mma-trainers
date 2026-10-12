import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageCircle } from 'lucide-react';
import heroImage from '../assets/images/hero_martial_arts_1791119589159.jpg';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

interface HeroProps {
  onBookTrial: () => void;
  onBookMonthly?: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookTrial, onBookMonthly }) => {
  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const tickerItems = [
    '16 Sessions / Month',
    'Alternate Days Format',
    '6:30 AM – 10:30 PM Hourly Slots',
    '30-Min Rest Gap',
    'Chandigarh · Mohali · Kharar',
    'Zirakpur · Panchkula · New Chandigarh',
    'MMA · Boxing · Kickboxing',
    'Practical Self Defence',
    'Elder Age Fitness Training',
  ];

  const handleWhatsApp = () => {
    const text = 'Hello MMA Trainers, I would like to inquire about training plans and trial sessions.';
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  const handleMonthlyClick = () => {
    if (onBookMonthly) {
      onBookMonthly();
    } else {
      const el = document.getElementById('pricing');
      el?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section className="relative w-full min-h-[92svh] sm:min-h-[96svh] flex flex-col justify-between bg-[#0B0B0B] overflow-hidden select-none">
      {/* Background Photograph */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Martial arts training session"
          className="w-full h-full object-cover object-[center_28%]"
        />
        {/* Refined gradient mask for minimalist legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0B] via-[#0B0B0B]/75 to-black/30" />
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-[1800px] mx-auto px-5 sm:px-8 md:px-12 lg:px-16 pt-32 sm:pt-40 pb-12 flex-1 flex flex-col justify-end">
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl"
        >
          {/* Minimalist Sub-header Tag */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-neutral-300 text-[11px] font-mono tracking-widest uppercase mb-5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E63B30]" />
            <span>Tricity · 16 Sessions / Mo</span>
          </div>

          {/* Clean, Bold Headline */}
          <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-4xl sm:text-6xl lg:text-7xl text-white leading-[1.05] tracking-tight mb-4 text-balance">
            Elite Martial Arts & Conditioning.
          </h1>

          {/* Minimalist 1-sentence description */}
          <p className="text-neutral-300 text-sm sm:text-base leading-relaxed mb-8 max-w-lg font-normal">
            Personal combat training across Chandigarh, Mohali & Panchkula. Alternate days format.
          </p>

          {/* Clean Action Buttons: Both Trial & Monthly options */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onBookTrial}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E63B30]/25 cursor-pointer"
            >
              <span>Book Trial — ₹999</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            <button
              onClick={handleMonthlyClick}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white text-neutral-950 hover:bg-neutral-100 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-white/10 cursor-pointer"
            >
              <span>Book Monthly</span>
              <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500" />
            </button>

            <button
              onClick={handleWhatsApp}
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 bg-white/10 hover:bg-white/20 text-white font-semibold text-xs uppercase tracking-wider rounded-xl border border-white/20 transition-all backdrop-blur-md cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>WhatsApp</span>
            </button>
          </div>
        </motion.div>
      </div>

      {/* Minimalist Bottom Ticker */}
      <div className="relative z-10 w-full bg-black/60 backdrop-blur-md border-t border-white/10 py-3 overflow-hidden">
        <div className="flex w-max">
          <motion.div
            className="flex shrink-0 items-center whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 30,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span
                key={idx}
                className="font-mono text-xs text-neutral-400 tracking-wider uppercase px-6 inline-flex items-center gap-6"
              >
                <span>{item}</span>
                <span className="text-neutral-700">/</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
