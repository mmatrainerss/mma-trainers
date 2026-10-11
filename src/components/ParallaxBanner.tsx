import React from 'react';
import { motion } from 'motion/react';
import { RaiLogo } from './RaiLogo';
import bannerImg from '../assets/images/training_age_level_1791122570205.jpg';

export const ParallaxBanner: React.FC = () => {
  return (
    <div className="relative w-full overflow-hidden bg-black select-none">
      {/* Full-screen Visual Banner matching reference image */}
      <div className="relative w-full min-h-[560px] sm:min-h-[640px] lg:min-h-[720px] flex items-center justify-center overflow-hidden">
        {/* Full-bleed Martial Arts Photography */}
        <div className="absolute inset-0 z-0">
          <img
            src={bannerImg}
            alt="Young martial artist in white gi training in dōjō"
            className="w-full h-full object-cover object-[center_28%] lg:object-[center_24%]"
          />
          {/* Subtle cinematic gradient overlays for high text contrast */}
          <div className="absolute inset-0 bg-gradient-to-r from-black/75 via-black/35 to-black/65" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/50" />
        </div>

        {/* Content Container: Left headline + Right RAI logo lockup */}
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-10 lg:px-16 py-20 flex flex-col md:flex-row md:items-center justify-between gap-10">
          {/* Left: Headline */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-2xl"
          >
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-6xl lg:text-[72px] font-extrabold text-white leading-[1.08] tracking-tight">
              Training for every <br />
              Age and Level
            </h2>
          </motion.div>

          {/* Right: RAI Logo Lockup matching reference */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="flex items-center md:justify-end"
          >
            <div className="bg-white p-2.5 sm:p-3 rounded-xl shadow-2xl border-2 border-black/10 hover:scale-105 transition-transform duration-300">
              <RaiLogo theme="light" className="scale-125 sm:scale-150 transform origin-center p-2" />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Infinite Red Marquee Ticker */}
      <div className="relative py-3.5 bg-[#E63B30] text-white overflow-hidden shadow-inner border-y border-[#FF5B4F]">
        <div className="flex w-max">
          <motion.div
            className="flex shrink-0 items-center whitespace-nowrap"
            animate={{ x: ['0%', '-50%'] }}
            transition={{
              duration: 22,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            {[...Array(6)].map((_, i) => (
              <span
                key={i}
                className="font-['Oswald'] text-sm sm:text-base font-bold tracking-widest uppercase px-4 inline-flex items-center gap-4 text-white"
              >
                <span>CERTIFIED TRAINERS</span>
                <span className="text-black/40">★</span>
                <span>AT-HOME ONLINE TRAINING</span>
                <span className="text-black/40">★</span>
                <span>PERSONAL OFFLINE SESSIONS</span>
                <span className="text-black/40">★</span>
                <span>CUSTOM NUTRITION</span>
                <span className="text-black/40">★</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
