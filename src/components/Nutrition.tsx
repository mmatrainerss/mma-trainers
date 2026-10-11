import React from 'react';
import { motion } from 'motion/react';
import { Utensils, Target, Activity } from 'lucide-react';
import nutritionImg from '../assets/images/kids_martial_arts_1791120154048.jpg'; // Using an existing image placeholder, though this should be replaced later

export const Nutrition: React.FC = () => {
  return (
    <section className="py-24 bg-[#F4F4F5] relative border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-4">
              DIET & WEIGHT LOSS
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 leading-tight mb-6">
              Personalized Nutrition For Real Results
            </h2>
            <p className="text-neutral-600 text-sm sm:text-base leading-relaxed mb-8">
              Training is only half the battle. To see real weight loss and body transformation, you need a diet plan that works for your body and fits your busy professional lifestyle.
            </p>

            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-black/10 shrink-0 shadow-sm">
                  <Utensils className="w-5 h-5 text-[#E63B30]" />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-['Oswald'] font-bold uppercase tracking-wide text-lg mb-1">Custom Meal Plans</h4>
                  <p className="text-neutral-600 text-sm">No generic diets. We build meal plans around your preferences, schedule, and caloric needs.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-black/10 shrink-0 shadow-sm">
                  <Target className="w-5 h-5 text-[#E63B30]" />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-['Oswald'] font-bold uppercase tracking-wide text-lg mb-1">Macro Tracking</h4>
                  <p className="text-neutral-600 text-sm">Learn exactly how much protein, carbs, and fats you need to drop fat while maintaining energy.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center border border-black/10 shrink-0 shadow-sm">
                  <Activity className="w-5 h-5 text-[#E63B30]" />
                </div>
                <div>
                  <h4 className="text-neutral-900 font-['Oswald'] font-bold uppercase tracking-wide text-lg mb-1">Weekly Check-ins</h4>
                  <p className="text-neutral-600 text-sm">Your coach will track your progress and adjust your diet every week so you never plateau.</p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border border-black/10 shadow-2xl"
          >
            <img
              src={nutritionImg}
              alt="Healthy nutrition and meal prep"
              className="w-full h-full object-cover object-center grayscale hover:grayscale-0 transition-all duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
            <div className="absolute bottom-6 left-6 right-6">
              <div className="bg-black/60 backdrop-blur-md border border-white/20 p-4 rounded-xl text-center">
                <p className="text-white font-['Oswald'] tracking-wide text-sm uppercase font-bold">Fuel your body. Drop the fat.</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
