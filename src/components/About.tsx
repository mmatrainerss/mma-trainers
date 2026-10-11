import React from 'react';
import { motion } from 'motion/react';
import { Compass, ShieldCheck, HeartHandshake, TrendingUp } from 'lucide-react';
import { MediaPlaceholder } from './MediaPlaceholder';

export const About: React.FC = () => {
  const features = [
    {
      title: 'Clear Instruction',
      desc: 'Learn each skill step by step before increasing speed or intensity.',
      icon: Compass
    },
    {
      title: 'Safe Training',
      desc: 'Classes use structured drills, appropriate equipment and coach supervision.',
      icon: ShieldCheck
    },
    {
      title: 'Beginner Friendly',
      desc: 'You do not need previous martial arts experience to join.',
      icon: HeartHandshake
    },
    {
      title: 'Consistent Progress',
      desc: 'Train with a clear program that helps you improve over time.',
      icon: TrendingUp
    }
  ];

  return (
    <section id="about" className="py-24 bg-[#0D0D0D] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Text Copy & 2x2 Feature Grid */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7"
          >
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              ABOUT RAI
            </div>

            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white mb-6 leading-tight">
              A Place to Train and Improve
            </h2>

            <div className="space-y-4 text-neutral-300 text-sm sm:text-base leading-relaxed mb-10">
              <p>
                Rai Martial Arts is a modern training center for families, beginners and experienced athletes. Our classes are structured, practical and taught in a respectful environment.
              </p>
              <p>
                Whether you want to help your child build confidence, improve your fitness or learn a new martial art, our coaches will help you start at the right level.
              </p>
            </div>

            {/* 2x2 Feature Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-6 border-t border-white/10">
              {features.map((feat, idx) => {
                const Icon = feat.icon;
                return (
                  <div key={idx} className="flex items-start gap-3.5 group">
                    <div className="w-10 h-10 rounded-xl bg-neutral-900 border border-white/10 flex items-center justify-center text-[#E63B30] group-hover:bg-[#E63B30]/10 group-hover:border-[#E63B30]/40 transition-colors shrink-0">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide group-hover:text-[#E63B30] transition-colors">
                        {feat.title}
                      </h4>
                      <p className="text-xs text-neutral-400 mt-1 leading-relaxed">
                        {feat.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </motion.div>

          {/* Right Column: Media Showcase with Overlapping Badge */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <MediaPlaceholder
                aspectRatio="aspect-[4/5]"
                className="w-full shadow-2xl rounded-2xl"
                badge="FACILITY & COMMUNITY"
                label="Austin Mats & Training Center"
                sublabel="Olympic-grade tatami mats & sanitization system"
                icon="shield"
              />

              {/* Overlapping Pill Badge */}
              <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 z-20 whitespace-nowrap">
                <div className="px-5 py-2.5 rounded-full bg-[#E63B30] text-white text-xs font-bold uppercase tracking-widest shadow-xl shadow-[#E63B30]/40 border border-white/20 flex items-center gap-2">
                  <span>COACHING</span>
                  <span>•</span>
                  <span>TRAINING</span>
                  <span>•</span>
                  <span>COMMUNITY</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
