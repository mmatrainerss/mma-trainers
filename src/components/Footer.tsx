import React from 'react';
import { ArrowUpRight, MessageCircle, MapPin, Clock, ShieldCheck } from 'lucide-react';
import { RaiLogo } from './RaiLogo';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

interface FooterProps {
  onOpenAdmin?: () => void;
  onBookTrial?: (programName?: string, planId?: string, amount?: number) => void;
  onBookMonthly?: (programName?: string, planId?: string, amount?: number) => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onBookTrial, onBookMonthly }) => {
  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const handleWhatsApp = () => {
    const text = 'Hello MMA Trainers! I would like to inquire about training programs, fees, and slot availability in Tricity.';
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <footer className="relative bg-[#080808] border-t border-white/10 pt-16 pb-12 overflow-hidden select-none text-white">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <RaiLogo theme="dark" />
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Elite martial arts and personal conditioning across Chandigarh, Mohali, Kharar, Zirakpur, Panchkula and New Chandigarh.
            </p>
            <div className="space-y-1.5 text-xs text-neutral-400 pt-1">
              <p className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-[#E63B30] shrink-0" />
                <span>Timings: 6:30 AM – 10:30 PM (Continuous Hourly Format)</span>
              </p>
              <p className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#E63B30] shrink-0" />
                <span>16 Sessions / Mo · Alternate Days · 30m Rest Gap</span>
              </p>
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#E63B30] shrink-0" />
                <span>Doorstep Trainer Visits & Dojos Across All 6 Territories</span>
              </p>
            </div>
            {/* Direct WhatsApp Callout */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 rounded-xl text-xs font-bold transition-all cursor-pointer"
              >
                <MessageCircle className="w-4 h-4 fill-current" />
                <span>Direct WhatsApp Support: +91 79868 51137</span>
              </button>
            </div>
          </div>

          {/* Quick Links Column 1: Navigation & Hubs */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-3 font-semibold">
                TRICITY HUBS
              </span>
              <ul className="space-y-2 text-xs">
                {['Chandigarh (Zone 1)', 'Mohali (Zone 1)', 'Kharar (Zone 1)', 'Zirakpur (Zone 2)', 'Panchkula (Zone 2)', 'New Chandigarh (Zone 2)'].map((hub, idx) => (
                  <li key={idx}>
                    <a href="#pricing" className="text-neutral-400 hover:text-white transition-colors">
                      {hub}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-3 font-semibold">
                OUR SERVICES
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Mixed Martial Arts (MMA)
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Boxing Fundamentals
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Cardio Kickboxing
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Practical Self Defence
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Elder Age Fitness Training
                  </a>
                </li>
                <li>
                  <a href="#pricing" className="text-[#E63B30] font-semibold hover:text-white transition-colors">
                    Family Group Plan (4 Pax)
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Join / Trial CTA */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-1 font-semibold">
              EXCLUSIVE TRIAL SESSION
            </span>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Entry-level testing and personalized consultation with our Head Coach across all Tricity locations.
            </p>
            <div className="pt-2 flex flex-col sm:flex-row gap-2.5">
              <button
                type="button"
                onClick={() => onBookTrial?.('Trial Session', 'trial', 999)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-[#E63B30]/25"
              >
                <span>Book Trial @ ₹999</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={handleWhatsApp}
                className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#25D366] hover:bg-[#20ba59] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer shadow-lg shadow-[#25D366]/20"
              >
                <MessageCircle className="w-3.5 h-3.5 fill-white" />
                <span>WhatsApp</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} MMA Trainers Academy. Chandigarh · Mohali · Panchkula. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#pricing" className="hover:text-neutral-300 transition-colors">
              Packages & Areas
            </a>
            <a href="#modes" className="hover:text-neutral-300 transition-colors">
              Training Modes
            </a>
            <a href="#faq" className="hover:text-neutral-300 transition-colors">
              FAQ
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-neutral-400 hover:text-[#E63B30] transition-colors cursor-pointer font-mono font-medium"
              >
                Admin Portal
              </button>
            )}
          </div>
        </div>

        {/* Giant subtle background branding text */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-['Oswald'] text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white/[0.06] select-none pointer-events-none text-center sm:text-left leading-none">
            TRICITY MARTIAL ARTS & CONDITIONING ACADEMY
          </div>
          <div className="opacity-15 shrink-0 hidden sm:block">
            <div className="px-3 py-1.5 rounded-xl border border-white flex items-center justify-center font-['Oswald'] font-black text-xs text-white">
              CHANDIGARH • MOHALI • PANCHKULA
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
