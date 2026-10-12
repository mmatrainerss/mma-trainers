import React, { useRef, useState } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { ArrowUpRight, ArrowRight } from 'lucide-react';

export interface ProgramData {
  id: string;
  title: string;
  tag1: string;
  tag2: string;
  image: string;
  imageAlt: string;
  description: string;
  bullets: string[];
  price: string;
  buttonType: 'arrow' | 'full';
  bordered?: boolean;
}

interface ProgramCardProps {
  prog: ProgramData;
  index: number;
  onBookTrial: (title: string) => void;
  onBookMonthly: (title: string) => void;
}

export const ProgramCard: React.FC<ProgramCardProps> = ({ prog, index, onBookTrial, onBookMonthly }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  // Scroll-driven expansion: expands from a compact form as user scrolls down
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ['start end', 'center center'],
  });

  // Scale expands from compact 0.91 to 1.0
  const scale = useTransform(scrollYProgress, [0, 0.7, 1], [0.91, 0.97, 1]);
  // Vertical smooth lift
  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  // Opacity fade in
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.4, 0.85, 1]);
  // Image un-zooms from compact inset zoom
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.12, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={{ scale, y, opacity }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative rounded-[26px] bg-white transition-shadow duration-500 group select-none shadow-md hover:shadow-2xl"
    >
      {/* Static Base Border */}
      <div
        className={`absolute inset-0 rounded-[26px] pointer-events-none transition-colors duration-300 z-10 ${
          prog.bordered
            ? 'border-[3px] border-[#E63B30]/40 group-hover:border-[#E63B30]'
            : 'border border-neutral-200/90 group-hover:border-[#E63B30]/40'
        }`}
      />

      {/* Running Red Line Around the Border on Hover */}
      <svg
        className={`absolute inset-0 w-full h-full pointer-events-none z-20 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      >
        {/* Glow blur layer */}
        <motion.rect
          x="1.75"
          y="1.75"
          width="calc(100% - 3.5px)"
          height="calc(100% - 3.5px)"
          rx="25"
          fill="none"
          stroke="#E63B30"
          strokeWidth="6"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.18 0.82"
          animate={isHovered ? { strokeDashoffset: [0, -1] } : { strokeDashoffset: 0 }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'linear',
          }}
          className="opacity-60 blur-[3px]"
        />

        {/* Sharp core running red line */}
        <motion.rect
          x="1.75"
          y="1.75"
          width="calc(100% - 3.5px)"
          height="calc(100% - 3.5px)"
          rx="25"
          fill="none"
          stroke="#E63B30"
          strokeWidth="3.5"
          strokeLinecap="round"
          pathLength={1}
          strokeDasharray="0.18 0.82"
          animate={isHovered ? { strokeDashoffset: [0, -1] } : { strokeDashoffset: 0 }}
          transition={{
            duration: 2.8,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </svg>

      {/* Card Content Grid */}
      <div className="rounded-[26px] overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch min-h-[380px]">
        {/* Left Column: Expanding Image */}
        <div className="lg:col-span-6 relative overflow-hidden bg-neutral-100 min-h-[280px] sm:min-h-[360px] lg:min-h-[440px]">
          <motion.img
            style={{ scale: imageScale }}
            src={prog.image}
            alt={prog.imageAlt}
            className="w-full h-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        </div>

        {/* Right Column: Program Details & Description */}
        <div className="lg:col-span-6 p-6 sm:p-8 lg:p-10 xl:p-12 flex flex-col justify-between bg-white relative z-10">
          <div>
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#FCEEED] text-[#E63B30] transition-colors group-hover:bg-[#E63B30] group-hover:text-white">
                {prog.tag1}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase bg-[#FCEEED] text-[#E63B30]">
                {prog.tag2}
              </span>
            </div>

            {/* Title */}
            <h3 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold text-neutral-900 mb-3 tracking-tight group-hover:text-[#E63B30] transition-colors duration-200">
              {prog.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-neutral-600 leading-relaxed mb-6 font-normal">
              {prog.description}
            </p>

            {/* Bullets with Red Round Dots */}
            <ul className="space-y-2.5 mb-6">
              {prog.bullets.map((bullet, bIdx) => (
                <li
                  key={bIdx}
                  className="flex items-center gap-3 text-xs sm:text-sm font-medium text-neutral-800"
                >
                  <span className="w-1.5 h-1.5 rounded-full bg-[#E63B30] shrink-0 group-hover:scale-125 transition-transform" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Bottom Area: Both Trial and Monthly Booking Options */}
          <div className="pt-5 border-t border-neutral-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                onClick={() => onBookTrial(prog.title)}
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-[#E63B30] hover:bg-[#D32F2F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#E63B30]/25 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                <span>Book Trial — ₹999</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>

              <button
                onClick={() => onBookMonthly(prog.title)}
                className="inline-flex items-center justify-center gap-1.5 px-4 sm:px-5 py-3 bg-neutral-900 hover:bg-black text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95 cursor-pointer"
              >
                <span>Book Monthly</span>
                <ArrowRight className="w-3.5 h-3.5 text-neutral-400" />
              </button>
            </div>

            <div className="font-['Plus_Jakarta_Sans'] font-extrabold text-xs sm:text-sm text-neutral-900 sm:text-right">
              <span className="text-[#E63B30] block text-[10px] font-mono uppercase tracking-wider font-bold">16 SESSIONS / MONTH</span>
              {prog.price}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
