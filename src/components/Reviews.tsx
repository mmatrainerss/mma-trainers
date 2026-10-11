import React from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { MediaPlaceholder } from './MediaPlaceholder';

export const Reviews: React.FC = () => {
  return (
    <section id="reviews" className="py-24 bg-[#0A0A0A] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              MEMBER REVIEWS
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              What Members Say
            </h2>
          </motion.div>
        </div>

        {/* 3-Column Masonry Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
          {/* Column 1 */}
          <div className="space-y-6">
            {/* Review 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all"
            >
              <Quote className="w-6 h-6 text-[#E63B30] mb-4 stroke-1 fill-[#E63B30]/20" />
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-6 font-normal">
                "I lost 15lbs in my first month! The custom diet plan and online workouts fit perfectly into my busy 9-to-5 schedule."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide">
                  Amanda R.
                </h4>
                <p className="text-xs text-neutral-400">Marketing Director</p>
              </div>
            </motion.div>

            {/* Media Card 1 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <MediaPlaceholder
                aspectRatio="aspect-[4/5]"
                className="w-full"
                badge="YOUTH MATS"
                label="Kids Class Practice"
                sublabel="Discipline, focus & smiling faces"
                icon="award"
              />
            </motion.div>

            {/* Media Card 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              <MediaPlaceholder
                aspectRatio="aspect-video"
                className="w-full"
                badge="STRIKING DRILLS"
                label="Partner Pad Work"
                sublabel="Controlled technique & conditioning"
                icon="flame"
              />
            </motion.div>
          </div>

          {/* Column 2 */}
          <div className="space-y-6">
            {/* Media Card 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <MediaPlaceholder
                aspectRatio="aspect-video"
                className="w-full"
                badge="COMMUNITY"
                label="Austin Mats Gathering"
                sublabel="Ego-free training environment"
                icon="shield"
              />
            </motion.div>

            {/* Featured Red Review Card: Sarah M. */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#E63B30] text-white rounded-2xl p-6 sm:p-8 shadow-xl shadow-[#E63B30]/25 relative overflow-hidden"
            >
              <Quote className="w-8 h-8 text-white mb-4 stroke-1 fill-white/20" />
              <p className="text-lg sm:text-xl font-medium leading-relaxed mb-6 font-['Plus_Jakarta_Sans']">
                "Being able to train MMA from my living room with a real certified coach has been a game changer for my weight loss and daily routine."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-lg font-bold text-white uppercase tracking-wide">
                  Sarah M.
                </h4>
                <p className="text-xs text-white/80">Software Engineer</p>
              </div>
            </motion.div>

            {/* Media Card 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              <MediaPlaceholder
                aspectRatio="aspect-[4/3]"
                className="w-full"
                badge="GRAPPLING"
                label="Positional Mechanics"
                sublabel="BJJ Fundamentals class"
                icon="shield"
              />
            </motion.div>
          </div>

          {/* Column 3 */}
          <div className="space-y-6">
            {/* Review 2 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all"
            >
              <Quote className="w-6 h-6 text-[#E63B30] mb-4 stroke-1 fill-[#E63B30]/20" />
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-6 font-normal">
                "I travel often for work. The online training flexibility means I never miss a workout and stay on track with my nutrition."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide">
                  Nathan R.
                </h4>
                <p className="text-xs text-neutral-400">Sales Consultant</p>
              </div>
            </motion.div>

            {/* Review 3 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all"
            >
              <Quote className="w-6 h-6 text-[#E63B30] mb-4 stroke-1 fill-[#E63B30]/20" />
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-6 font-normal">
                "The offline personal training sessions are intense. I lost weight and learned proper boxing technique without wasting any time."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide">
                  Daniel T.
                </h4>
                <p className="text-xs text-neutral-400">Entrepreneur</p>
              </div>
            </motion.div>

            {/* Review 4 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all"
            >
              <Quote className="w-6 h-6 text-[#E63B30] mb-4 stroke-1 fill-[#E63B30]/20" />
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-6 font-normal">
                "With my busy schedule, I couldn't commit to a gym. This hybrid model keeps me accountable and shredding fat."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide">
                  Chris M.
                </h4>
                <p className="text-xs text-neutral-400">Financial Analyst</p>
              </div>
            </motion.div>

            {/* Review 5 */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.35, ease: [0.16, 1, 0.3, 1] }}
              className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-7 hover:border-white/20 transition-all"
            >
              <Quote className="w-6 h-6 text-[#E63B30] mb-4 stroke-1 fill-[#E63B30]/20" />
              <p className="text-sm sm:text-base text-neutral-200 leading-relaxed mb-6 font-normal">
                "Best investment in my health. The coaches customized a diet plan that actually works for a busy professional."
              </p>
              <div>
                <h4 className="font-['Oswald'] text-base font-bold text-white uppercase tracking-wide">
                  Michael K.
                </h4>
                <p className="text-xs text-neutral-400">Operations Manager</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
