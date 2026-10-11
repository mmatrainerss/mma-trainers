import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Shield, Users, Award, Dumbbell } from 'lucide-react';
import heroImage from '../assets/images/hero_martial_arts_1791119589159.jpg';

interface HeroProps {
  onBookTrial: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onBookTrial }) => {
  const featureList = [
    {
      title: 'ONLINE & OFFLINE',
      desc: 'Train from anywhere',
      icon: Users,
    },
    {
      title: 'BUSY PROFESSIONALS',
      desc: 'Flexible scheduling',
      icon: Shield,
    },
    {
      title: 'CERTIFIED TRAINERS',
      desc: 'Real combat experience',
      icon: Award,
    },
    {
      title: 'CUSTOM DIET PLANS',
      desc: 'Tailored for weight loss',
      icon: Dumbbell,
    },
  ];

  return (
    <section className="relative w-full min-h-[100svh] flex flex-col justify-between bg-[#0D0D0D] overflow-hidden select-none">
      {/* Background Martial Arts Photograph - Full screen bleed */}
      <div className="absolute inset-0 z-0">
        <img
          src={heroImage}
          alt="Female martial artist training Muay Thai kickboxing with coach"
          className="w-full h-full object-cover object-[center_32%] lg:object-[center_28%]"
        />

        {/* Main bottom-up gradient for text legibility, leaving top of image completely clear */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/80 to-transparent lg:via-[#0D0D0D]/70" />

        {/* Extra bottom gradient to blend seamlessly into the feature strip */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0D0D0D] via-[#0D0D0D]/50 to-transparent h-1/2 mt-auto" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 pt-24 sm:pt-36 md:pt-40 pb-8 sm:pb-12 lg:pb-12 flex-1 flex flex-col justify-end">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-end">
          {/* Left Column: Pill Tag & Giant Title */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {/* Category Pill Tag */}
            <div className="inline-flex items-center px-3 py-1.5 rounded-full bg-[#E63B30] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider mb-4 shadow-lg shadow-[#E63B30]/30">
              BOXING · KICKBOXING · MMA · DIET PLANS
            </div>

            {/* Bold Headline */}
            <h1 className="font-['Plus_Jakarta_Sans'] font-extrabold text-3xl sm:text-4xl lg:text-5xl xl:text-6xl text-white leading-[1.1] tracking-tight mb-3 text-balance">
              Train like a fighter <br className="hidden sm:block" />
              anywhere, anytime
            </h1>
          </motion.div>

          {/* Right Column: Description & Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-end"
          >
            <p className="text-neutral-200 text-xs sm:text-sm leading-relaxed mb-6 font-normal max-w-md">
              Tailored specifically for busy professionals short on time. Flexible at-home training and custom nutrition to fit your schedule.
            </p>

            <div className="flex flex-wrap items-center gap-3">
              {/* Red Primary Button */}
              <button
                onClick={onBookTrial}
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E63B30]/30 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>BOOK A CONSULTATION</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>

              {/* Dark Outline Secondary Button */}
              <a
                href="#programs"
                className="inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 bg-black/60 hover:bg-black/85 text-white font-bold text-[11px] sm:text-xs uppercase tracking-wider rounded-xl border border-white/30 hover:border-white/60 transition-all backdrop-blur-md"
              >
                <span>EXPLORE PROGRAMS</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-neutral-300" />
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Bottom Feature Strip - Infinite Continuous Marquee */}
      <div className="relative z-10 w-full bg-black/85 backdrop-blur-md border-t border-white/10 py-3.5 sm:py-4 overflow-hidden select-none">
        {/* Soft edge gradient masks */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-r from-black via-black/80 to-transparent z-20 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-20 bg-gradient-to-l from-black via-black/80 to-transparent z-20 pointer-events-none" />

        {/* Continuous looping ticker */}
        <div className="flex w-max">
          <motion.div
            className="flex shrink-0 items-center"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 25,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {/* First Set */}
            <div className="flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
              {featureList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={`set1-${idx}`} className="flex items-center gap-3 shrink-0 py-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E63B30] bg-[#E63B30]/10 flex items-center justify-center text-[#E63B30] shrink-0 shadow-sm shadow-[#E63B30]/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-neutral-400 whitespace-nowrap">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Second Set (identical clone for seamless loop) */}
            <div className="flex items-center gap-10 sm:gap-14 pr-10 sm:pr-14">
              {featureList.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <div key={`set2-${idx}`} className="flex items-center gap-3 shrink-0 py-1">
                    <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full border border-[#E63B30] bg-[#E63B30]/10 flex items-center justify-center text-[#E63B30] shrink-0 shadow-sm shadow-[#E63B30]/20">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white whitespace-nowrap">
                        {item.title}
                      </h4>
                      <p className="text-[10px] sm:text-[11px] text-neutral-400 whitespace-nowrap">
                        {item.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
