import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus } from 'lucide-react';
import { FAQS } from '../data/martialArtsData';

export const FAQ: React.FC = () => {
  // Allow multiple or single open items
  const [openIds, setOpenIds] = useState<string[]>(['faq-1', 'faq-2']);

  const toggleFAQ = (id: string) => {
    setOpenIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  return (
    <section id="faq" className="py-24 bg-white relative border-t border-black/5">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16">
        {/* Header */}
        <div className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              COMMON QUESTIONS
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-neutral-950 leading-tight">
              Frequently Asked Questions
            </h2>
          </motion.div>
        </div>

        {/* 2-Column Expandable Accordion Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-start">
          {FAQS.map((faq, index) => {
            const isOpen = openIds.includes(faq.id);

            return (
              <motion.div
                key={faq.id}
                layout
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{
                  layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
                  duration: 0.5,
                  delay: index * 0.05,
                }}
                className={`border rounded-2xl overflow-hidden transition-all duration-200 ${
                  isOpen
                    ? 'border-[#E63B30]/60 bg-neutral-50 shadow-md shadow-[#E63B30]/5'
                    : 'border-black/10 bg-white hover:border-black/20 hover:bg-neutral-50/50'
                }`}
              >
                <button
                  type="button"
                  onClick={() => toggleFAQ(faq.id)}
                  aria-expanded={isOpen}
                  className="w-full p-5 sm:p-6 text-left flex items-start justify-between gap-4 select-none focus:outline-none focus-visible:ring-2 focus-visible:ring-[#E63B30] cursor-pointer"
                >
                  <span className="font-['Plus_Jakarta_Sans'] text-base sm:text-lg font-bold text-neutral-900 leading-snug">
                    {faq.question}
                  </span>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                      isOpen
                        ? 'bg-[#E63B30] text-white'
                        : 'bg-neutral-100 text-neutral-700'
                    }`}
                  >
                    {isOpen ? (
                      <Minus className="w-4 h-4 stroke-[2.5]" />
                    ) : (
                      <Plus className="w-4 h-4 stroke-[2.5]" />
                    )}
                  </div>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      key="content"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 sm:px-6 sm:pb-6 text-xs sm:text-sm text-neutral-600 leading-relaxed pt-2 border-t border-black/5 font-normal">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
