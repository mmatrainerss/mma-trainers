import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageCircle, X, ArrowUpRight } from 'lucide-react';
import { formStorage } from '../services/formStorage';
import { formatWhatsAppLink } from '../lib/phoneUtils';

export const FloatingWhatsApp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const quickPrompts = [
    {
      label: 'Trial Session (₹999)',
      msg: 'Hello MMA Trainers, I would like to book a Trial Session (₹999).',
    },
    {
      label: 'Monthly Plans & Fees',
      msg: 'Hello MMA Trainers, I would like to know more about the monthly training packages.',
    },
    {
      label: 'Timing Slots (6:30 AM – 10:30 PM)',
      msg: 'Hello MMA Trainers, what hourly slots are currently available?',
    },
  ];

  const handleOpenChat = (customMsg?: string) => {
    const text =
      customMsg ||
      'Hello MMA Trainers, I have an inquiry regarding training plans and timings.';
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <>
      {/* Floating Action Button */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-13 h-13 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white flex items-center justify-center shadow-2xl shadow-[#25D366]/30 cursor-pointer border border-white/20 transition-colors"
          aria-label="WhatsApp Support"
        >
          {isOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-6 h-6 fill-white" />}
        </motion.button>
      </div>

      {/* Minimalist Pop-up Card */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 15, scale: 0.96 }}
            transition={{ duration: 0.18 }}
            className="fixed bottom-22 right-6 z-50 w-[290px] sm:w-[310px] bg-[#111111] border border-white/15 rounded-2xl shadow-2xl text-white overflow-hidden flex flex-col"
          >
            {/* Minimalist Header */}
            <div className="px-4 py-3.5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
                <span className="font-['Plus_Jakarta_Sans'] text-xs font-bold text-white tracking-wide">
                  WhatsApp Support
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-neutral-400 hover:text-white p-1 rounded-md transition-colors cursor-pointer"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Chips with Minimal Text */}
            <div className="p-2.5 space-y-1.5">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => handleOpenChat(q.msg)}
                  className="w-full text-left px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/20 transition-all flex items-center justify-between text-xs text-neutral-200 hover:text-white cursor-pointer group"
                >
                  <span className="font-medium text-[11px] sm:text-xs">{q.label}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 text-neutral-500 group-hover:text-white transition-colors shrink-0" />
                </button>
              ))}
            </div>

            {/* Bottom Direct CTA */}
            <div className="p-2.5 border-t border-white/10 bg-[#161616]">
              <button
                onClick={() => handleOpenChat()}
                className="w-full py-2.5 px-4 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-white" />
                <span>Chat on WhatsApp</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
