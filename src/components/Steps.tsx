import React from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2 } from 'lucide-react';
import { MediaPlaceholder } from './MediaPlaceholder';

interface StepsProps {
  onBookTrial: () => void;
}

export const Steps: React.FC<StepsProps> = ({ onBookTrial }) => {
  const steps = [
    {
      num: '01',
      title: 'Choose Training Mode',
      desc: "Select whether you want to train online from home, or offline in-person."
    },
    {
      num: '02',
      title: 'Get Matched with a Trainer',
      desc: 'We will pair you with a certified coach whose combat background fits your exact goals.'
    },
    {
      num: '03',
      title: 'Receive Custom Diet Plan',
      desc: 'Get a tailored macro-tracking meal plan designed specifically for your weight loss and fitness goals.'
    },
    {
      num: '04',
      title: 'Begin Workouts',
      desc: 'Start your flexible sessions that fit directly into your busy professional schedule.'
    }
  ];

  return (
    <section className="py-24 bg-[#0D0D0D] relative border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="max-w-xl mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              GET STARTED
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-white leading-tight">
              Your First Class <br /> In 4 Simple Steps
            </h2>
          </motion.div>
        </div>

        {/* Layout Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Row 1, Col 1: Media Preview */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="h-full min-h-[220px]"
          >
            <MediaPlaceholder
              aspectRatio="aspect-[4/3] lg:aspect-auto"
              className="w-full h-full"
              badge="STEP ON THE MATS"
              label="Beginner Onboarding"
              sublabel="Private walk-through & friendly orientation"
              icon="shield"
            />
          </motion.div>

          {/* Step 01 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-end mb-4">
              <span className="font-['Oswald'] text-4xl sm:text-5xl font-bold text-[#E63B30] leading-none group-hover:scale-110 transition-transform">
                {steps[0].num}
              </span>
            </div>
            <div>
              <h3 className="font-['Oswald'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
                {steps[0].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {steps[0].desc}
              </p>
            </div>
          </motion.div>

          {/* Step 02 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-end mb-4">
              <span className="font-['Oswald'] text-4xl sm:text-5xl font-bold text-[#E63B30] leading-none group-hover:scale-110 transition-transform">
                {steps[1].num}
              </span>
            </div>
            <div>
              <h3 className="font-['Oswald'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
                {steps[1].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {steps[1].desc}
              </p>
            </div>
          </motion.div>

          {/* Step 03 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-end mb-4">
              <span className="font-['Oswald'] text-4xl sm:text-5xl font-bold text-[#E63B30] leading-none group-hover:scale-110 transition-transform">
                {steps[2].num}
              </span>
            </div>
            <div>
              <h3 className="font-['Oswald'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
                {steps[2].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {steps[2].desc}
              </p>
            </div>
          </motion.div>

          {/* Step 04 */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
            className="bg-[#141414] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between hover:border-white/20 transition-colors group"
          >
            <div className="flex justify-end mb-4">
              <span className="font-['Oswald'] text-4xl sm:text-5xl font-bold text-[#E63B30] leading-none group-hover:scale-110 transition-transform">
                {steps[3].num}
              </span>
            </div>
            <div>
              <h3 className="font-['Oswald'] text-xl sm:text-2xl font-bold uppercase tracking-tight text-white mb-2">
                {steps[3].title}
              </h3>
              <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed">
                {steps[3].desc}
              </p>
            </div>
          </motion.div>

          {/* CTA Highlight Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="bg-neutral-900 border border-[#E63B30]/30 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-lg shadow-[#E63B30]/10"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#E63B30] shrink-0" />
                <span>No previous martial arts experience is required.</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-neutral-300">
                <CheckCircle2 className="w-4 h-4 text-[#E63B30] shrink-0" />
                <span>Your first class is 100% free before you decide to join.</span>
              </div>
            </div>

            <button
              onClick={onBookTrial}
              className="mt-6 w-full py-3.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#E63B30]/30 flex items-center justify-center gap-2 group"
            >
              <span>BOOK A FREE TRIAL</span>
              <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
