import React from 'react';
import { motion } from 'motion/react';
import { ProgramCard, ProgramData } from './ProgramCard';
import kidsImg from '../assets/images/kids_martial_arts_1791120154048.jpg';
import bjjImg from '../assets/images/bjj_grappling_1791120189062.jpg';
import muayThaiImg from '../assets/images/muay_thai_boxing_1791120201436.jpg';
import mmaImg from '../assets/images/mma_action_1791120212927.jpg';

interface ProgramsProps {
  onSelectProgram: (programName: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onSelectProgram }) => {
  const programsList: ProgramData[] = [
    {
      id: 'boxing',
      title: 'Boxing Fundamentals',
      tag1: 'STRIKING & FOOTWORK',
      tag2: 'ALL LEVELS',
      image: muayThaiImg,
      imageAlt: 'Boxers sparring with boxing gloves in ring',
      description:
        'Master the sweet science. Focus on hand speed, head movement, and power punching tailored for any fitness level.',
      bullets: [
        'Improve hand-eye coordination',
        'Learn defensive maneuvers',
        'Intense cardio workout',
      ],
      price: 'Personal & Online Options Available',
      buttonType: 'arrow',
      bordered: false,
    },
    {
      id: 'kickboxing',
      title: 'Cardio Kickboxing',
      tag1: 'STRIKING AND CONDITIONING',
      tag2: 'BEGINNER TO ADVANCED',
      image: bjjImg,
      imageAlt: 'Athletes training Kickboxing on mats',
      description:
        'High-energy kickboxing sessions designed to burn calories, relieve stress, and teach effective self-defense kicks and punches.',
      bullets: [
        'Full-body conditioning',
        'Stress relief',
        'Learn fundamental kicks',
      ],
      price: 'Personal & Online Options Available',
      buttonType: 'full',
      bordered: true,
    },
    {
      id: 'mma',
      title: 'Mixed Martial Arts',
      tag1: 'COMPLETE COMBAT',
      tag2: 'ALL FITNESS LEVELS',
      image: mmaImg,
      imageAlt: 'MMA training in action',
      description:
        'Combine striking, wrestling and ground techniques to build a complete and adaptable martial arts skill set for real-world application.',
      bullets: [
        'Complete all-round training',
        'Adapt at different ranges',
        'Improve strength and endurance',
      ],
      price: 'Personal & Online Options Available',
      buttonType: 'full',
      bordered: true,
    },
    {
      id: 'diet',
      title: 'Custom Diet Plans',
      tag1: 'NUTRITION & WEIGHT LOSS',
      tag2: 'PERSONALIZED',
      image: kidsImg,
      imageAlt: 'Healthy diet and nutrition planning',
      description:
        'Achieve your target weight with tailored macro-tracking, personalized meal plans, and ongoing nutritional support from our experts.',
      bullets: [
        'Custom macro calculation',
        'Weight loss tracking',
        'Sustainable eating habits',
      ],
      price: 'Add-on & Standalone Options',
      buttonType: 'full',
      bordered: true,
    },
  ];

  return (
    <section id="programs" className="py-24 sm:py-28 bg-[#F4F4F5] text-neutral-900 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-xl"
          >
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#E63B30] text-white shadow-sm mb-4">
              OUR PROGRAMS
            </div>
            <h2 className="font-['Plus_Jakarta_Sans'] text-4xl sm:text-5xl font-extrabold tracking-tight text-neutral-950 leading-tight">
              Choose Your Program
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed font-normal"
          >
            Find flexible training programs designed for busy professionals. Train online from home or in-person with certified coaches.
          </motion.p>
        </div>

        {/* Vertical Stack of Expanding Program Cards */}
        <div className="space-y-8 sm:space-y-12">
          {programsList.map((prog, index) => (
            <ProgramCard
              key={prog.id}
              prog={prog}
              index={index}
              onSelect={onSelectProgram}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
