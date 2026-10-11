import React from 'react';
import { motion } from 'motion/react';

import { MediaPlaceholder } from './MediaPlaceholder';

const REELS = [
  "DZN6mp6TaOq",
  "DZN4wX6T7wf",
  "DZN3qRCTQYH",
  "DZN0n8XTZLs",
  "DPVwtEOkWjP",
  "DLIrxSSz6ZQ",
  "DZVqOAYzzbV"
];

export const Coaches: React.FC = () => {
  return (
    <section id="coaches" className="py-24 bg-[#F4F4F5] relative border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              MEET THE TEAM
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 mb-4">
              Learn From Proven Coaches
            </h2>
            <p className="text-sm sm:text-base text-neutral-600">
              Our coaches bring real training, competition and teaching experience to every class.
            </p>
          </motion.div>
        </div>


          <div className="relative w-full overflow-hidden flex -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            {/* Gradient masks for fading edges */}
            <div className="absolute left-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-r from-[#F4F4F5] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-8 sm:w-16 md:w-32 bg-gradient-to-l from-[#F4F4F5] to-transparent z-10 pointer-events-none" />

            <div className="flex w-max animate-marquee gap-6 py-4 hover:[animation-play-state:paused]">
              {[...REELS, ...REELS].map((id, index) => (
                <div key={`${id}-${index}`} className="w-[320px] h-[550px] rounded-2xl overflow-hidden shadow-xl bg-white border border-black/10 shrink-0">
                  <iframe 
                    src={`https://www.instagram.com/reel/${id}/embed`}
                    className="w-full h-full"
                    frameBorder="0" 
                    scrolling="no" 
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
      </div>
    </section>
  );
};
