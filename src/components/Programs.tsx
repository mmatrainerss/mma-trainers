import React from 'react';
import { motion } from 'motion/react';
import { ProgramCard, ProgramData } from './ProgramCard';
import mmaImg from '../assets/images/mma_action_1791120212927.jpg';
import boxingImg from '../assets/images/muay_thai_boxing_1791120201436.jpg';
import kickboxingImg from '../assets/images/kickboxing_action.jpg';
import selfDefenceImg from '../assets/images/self_defence_training.jpg';
import elderFitnessImg from '../assets/images/elder_age_fitness.jpg';

interface ProgramsProps {
  onBookTrial: (programName: string) => void;
  onBookMonthly: (programName: string) => void;
}

export const Programs: React.FC<ProgramsProps> = ({ onBookTrial, onBookMonthly }) => {
  const programsList: ProgramData[] = [
    {
      id: 'mma',
      title: 'Mixed Martial Arts',
      tag1: 'MMA',
      tag2: 'ALL LEVELS',
      image: mmaImg,
      imageAlt: 'MMA fighter training cage work with coach',
      description:
        'Striking, wrestling takedowns, and ground grappling integrated into an adaptable martial arts discipline.',
      bullets: [
        'Striking, clinch and ground transitions',
        'Functional fight endurance and stamina',
        '16 sessions monthly on alternate days',
        'Hourly slots from 6:30 AM to 10:30 PM',
      ],
      price: 'From ₹13,000/mo · Trial ₹999',
      buttonType: 'full',
      bordered: true,
    },
    {
      id: 'boxing',
      title: 'Boxing',
      tag1: 'STRIKING',
      tag2: 'ALL LEVELS',
      image: boxingImg,
      imageAlt: 'Boxer throwing fast combinations on focus pads',
      description:
        'Focus on hand speed, head movement, kinetic punch mechanics, and elite cardiovascular stamina.',
      bullets: [
        'Punching mechanics and slip defense',
        'Core toning and footwork agility',
        '1-on-1 dedicated pad rounds',
        'Hourly slots with 30-min rest buffers',
      ],
      price: 'From ₹13,000/mo · Trial ₹999',
      buttonType: 'full',
      bordered: false,
    },
    {
      id: 'kickboxing',
      title: 'Kickboxing',
      tag1: 'CONDITIONING',
      tag2: 'ALL LEVELS',
      image: kickboxingImg,
      imageAlt: 'Kickboxer landing clean roundhouse kick on pads',
      description:
        'Energetic striking combining punches, heavy low & high kicks, knee strikes, and metabolic conditioning.',
      bullets: [
        'Full-body conditioning and core power',
        'Hip mobility and striking velocity',
        'Partner pad work and technical drills',
        'Alternate days for complete recovery',
      ],
      price: 'From ₹13,000/mo · Trial ₹999',
      buttonType: 'full',
      bordered: true,
    },
    {
      id: 'self-defence',
      title: 'Practical Self Defence',
      tag1: 'DEFENCE',
      tag2: 'ALL AGES',
      image: selfDefenceImg,
      imageAlt: 'Self defence instructor demonstrating escape techniques',
      description:
        'Practical escape mechanics, threat awareness, and leverage techniques to protect yourself in real-world scenarios.',
      bullets: [
        'Escapes from grabs, holds and chokes',
        'Technique and leverage over raw size',
        'Situational awareness and composure',
        'Doorstep sessions across Tricity',
      ],
      price: 'From ₹13,000/mo · Trial ₹999',
      buttonType: 'full',
      bordered: false,
    },
    {
      id: 'elder-fitness',
      title: 'Elder Age Fitness Training',
      tag1: 'WELLNESS',
      tag2: 'SENIORS',
      image: elderFitnessImg,
      imageAlt: 'Senior woman performing guided balance exercises with coach',
      description:
        'Specialized senior wellness conditioning. Gentle functional training to restore mobility, balance, and core stability.',
      bullets: [
        'Low-impact functional joint mobility',
        'Fall prevention and balance drills',
        'Adapted cardiovascular conditioning',
        '30-minute rest buffers for safe pacing',
      ],
      price: 'Dedicated Package: ₹15,000/mo',
      buttonType: 'full',
      bordered: true,
    },
  ];

  return (
    <section id="programs" className="py-20 sm:py-24 bg-white text-neutral-900 relative border-t border-black/5">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="max-w-2xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              PROGRAMS
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 mb-3">
              Training Disciplines
            </h2>
            <p className="text-sm text-neutral-600 font-normal">
              16 sessions monthly on alternate days. Continuous hourly slots from 6:30 AM to 10:30 PM.
            </p>
          </motion.div>
        </div>

        {/* Vertical Stack of Expanding Program Cards */}
        <div className="space-y-8 sm:space-y-10">
          {programsList.map((prog, index) => (
            <ProgramCard
              key={prog.id}
              prog={prog}
              index={index}
              onBookTrial={onBookTrial}
              onBookMonthly={onBookMonthly}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
