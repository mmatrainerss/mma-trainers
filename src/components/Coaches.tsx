import React from 'react';
import { motion } from 'motion/react';
import { Play, ArrowUpRight, Instagram } from 'lucide-react';
import mmaImg from '../assets/images/mma_action_1791120212927.jpg';
import boxingImg from '../assets/images/muay_thai_boxing_1791120201436.jpg';
import kickboxingImg from '../assets/images/kickboxing_action.jpg';
import selfDefenceImg from '../assets/images/self_defence_training.jpg';
import elderImg from '../assets/images/elder_age_fitness.jpg';
import bjjImg from '../assets/images/bjj_grappling_1791120189062.jpg';

interface TrainingClip {
  id: string;
  title: string;
  discipline: string;
  coach: string;
  image: string;
  instagramUrl: string;
}

const TRAINING_CLIPS: TrainingClip[] = [
  {
    id: 'DZN6mp6TaOq',
    title: 'MMA Cage Drills & Transitions',
    discipline: 'Mixed Martial Arts',
    coach: 'Coach Gurpreet',
    image: mmaImg,
    instagramUrl: 'https://www.instagram.com/reel/DZN6mp6TaOq/',
  },
  {
    id: 'DZN4wX6T7wf',
    title: 'High-Velocity Focus Pad Combos',
    discipline: 'Boxing',
    coach: 'Coach Vikram',
    image: boxingImg,
    instagramUrl: 'https://www.instagram.com/reel/DZN4wX6T7wf/',
  },
  {
    id: 'DZN3qRCTQYH',
    title: 'Heavy Low Kick & Knee Conditioning',
    discipline: 'Kickboxing',
    coach: 'Coach Amar',
    image: kickboxingImg,
    instagramUrl: 'https://www.instagram.com/reel/DZN3qRCTQYH/',
  },
  {
    id: 'DZN0n8XTZLs',
    title: 'Real-World Grab Escapes & Counters',
    discipline: 'Practical Self Defence',
    coach: 'Coach Harleen',
    image: selfDefenceImg,
    instagramUrl: 'https://www.instagram.com/reel/DZN0n8XTZLs/',
  },
  {
    id: 'DPVwtEOkWjP',
    title: 'Gentle Mobility & Balance Recovery',
    discipline: 'Elder Age Fitness',
    coach: 'Coach Sunita',
    image: elderImg,
    instagramUrl: 'https://www.instagram.com/reel/DPVwtEOkWjP/',
  },
  {
    id: 'DLIrxSSz6ZQ',
    title: 'Ground Grappling & Guard Control',
    discipline: 'BJJ Groundwork',
    coach: 'Coach Karan',
    image: bjjImg,
    instagramUrl: 'https://www.instagram.com/reel/DLIrxSSz6ZQ/',
  },
];

export const Coaches: React.FC = () => {
  return (
    <section id="coaches" className="py-20 sm:py-24 bg-white text-neutral-900 relative border-t border-black/5 select-none overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 mb-12">
        {/* Section Header */}
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              TRAINING REELS & ACTION
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">
              Training in Action
            </h2>
            <p className="text-sm text-neutral-600 font-normal">
              High-intensity drills, sparring, and pad work led by certified coaches across Tricity.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Infinite Action Reel Marquee */}
      <div className="relative w-full overflow-hidden flex">
        {/* Subtle Edge Vignettes */}
        <div className="absolute left-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-12 sm:w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="flex w-max animate-marquee gap-5 py-2 hover:[animation-play-state:paused]">
          {[...TRAINING_CLIPS, ...TRAINING_CLIPS].map((clip, index) => (
            <a
              key={`${clip.id}-${index}`}
              href={clip.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-[280px] sm:w-[320px] h-[460px] sm:h-[500px] rounded-2xl overflow-hidden bg-[#141414] border border-white/10 hover:border-[#E63B30]/60 transition-all duration-300 relative group shrink-0 flex flex-col justify-between shadow-2xl"
            >
              {/* Action Background Image */}
              <div className="absolute inset-0 z-0 overflow-hidden">
                <img
                  src={clip.image}
                  alt={clip.title}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-black/30" />
              </div>

              {/* Top Tag & Instagram Icon */}
              <div className="relative z-10 p-5 flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md border border-white/15 text-[10px] font-mono font-bold uppercase tracking-wider text-white">
                  {clip.discipline}
                </span>

                <div className="w-8 h-8 rounded-full bg-black/60 backdrop-blur-md border border-white/15 flex items-center justify-center text-white group-hover:text-[#E63B30] transition-colors">
                  <Instagram className="w-4 h-4" />
                </div>
              </div>

              {/* Center Play Button Overlay */}
              <div className="relative z-10 self-center">
                <div className="w-14 h-14 rounded-full bg-[#E63B30]/90 text-white flex items-center justify-center shadow-xl shadow-[#E63B30]/30 group-hover:scale-110 group-hover:bg-[#E63B30] transition-all">
                  <Play className="w-6 h-6 fill-white ml-0.5" />
                </div>
              </div>

              {/* Bottom Details Bar */}
              <div className="relative z-10 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                <p className="text-[11px] font-mono text-[#E63B30] uppercase font-bold tracking-wider mb-1">
                  {clip.coach}
                </p>
                <h3 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white mb-3 line-clamp-1 group-hover:text-neutral-100">
                  {clip.title}
                </h3>

                <div className="flex items-center justify-between text-xs text-neutral-300 pt-2.5 border-t border-white/10 group-hover:text-white">
                  <span className="font-medium">Watch Reel</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform text-[#E63B30]" />
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
