import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { RaiLogo } from './RaiLogo';

interface FooterProps {
  onOpenAdmin?: () => void;
  onBookTrial?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenAdmin, onBookTrial }) => {
  return (
    <footer className="relative bg-[#080808] border-t border-white/10 pt-16 pb-12 overflow-hidden select-none">
      {/* Giant subtle background branding text */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-16 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-4 space-y-4">
            <RaiLogo theme="dark" />
            <p className="text-xs text-neutral-400 max-w-sm leading-relaxed">
              Modern martial arts classes for kids and adults in Austin, Texas. Practical Brazilian Jiu-Jitsu, Muay Thai, Kickboxing and Mixed Martial Arts.
            </p>
            {/* Social Icons */}
            <div className="flex items-center gap-3 pt-2">
              <a
                href="#facebook"
                aria-label="Facebook"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E63B30] transition-colors text-xs font-bold"
              >
                f
              </a>
              <a
                href="#instagram"
                aria-label="Instagram"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E63B30] transition-colors text-xs font-bold"
              >
                ig
              </a>
              <a
                href="#x"
                aria-label="X"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E63B30] transition-colors text-xs font-bold"
              >
                𝕏
              </a>
              <a
                href="#youtube"
                aria-label="YouTube"
                className="w-8 h-8 rounded-lg bg-neutral-900 border border-white/10 flex items-center justify-center text-neutral-400 hover:text-white hover:border-[#E63B30] transition-colors text-xs font-bold"
              >
                yt
              </a>
            </div>
          </div>

          {/* Quick Links Column 1 */}
          <div className="md:col-span-4 grid grid-cols-2 gap-4">
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-3 font-semibold">
                EXPLORE
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Programs
                  </a>
                </li>
                <li>
                  <a href="#about" className="text-neutral-400 hover:text-white transition-colors">
                    About Rai
                  </a>
                </li>
                <li>
                  <a href="#coaches" className="text-neutral-400 hover:text-white transition-colors">
                    Coaches
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="text-neutral-400 hover:text-white transition-colors">
                    Weekly Schedule
                  </a>
                </li>
                <li>
                  <a href="#reviews" className="text-neutral-400 hover:text-white transition-colors">
                    Member Reviews
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-neutral-400 hover:text-white transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-3 font-semibold">
                PROGRAMS
              </span>
              <ul className="space-y-2 text-xs">
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Kids Martial Arts
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Brazilian Jiu-Jitsu
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Muay Thai & Boxing
                  </a>
                </li>
                <li>
                  <a href="#programs" className="text-neutral-400 hover:text-white transition-colors">
                    Mixed Martial Arts
                  </a>
                </li>
                <li>
                  <a href="#schedule" className="text-neutral-400 hover:text-white transition-colors">
                    Open Mat Sessions
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Location & Contact */}
          <div className="md:col-span-4 space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] block mb-1 font-semibold">
              ACADEMY LOCATION
            </span>
            <p className="text-sm font-semibold text-white">
              +1 (512) 555-1234
            </p>
            <p className="text-xs text-neutral-300">
              contact@rai-ma.com
            </p>
            <p className="text-xs text-neutral-400">
              000 East 6th Street • Austin, TX 78701 • United States
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={onBookTrial}
                className="inline-flex items-center gap-1.5 text-xs font-bold text-[#E63B30] hover:text-white uppercase tracking-wider group cursor-pointer"
              >
                <span>Book a Free Trial Today</span>
                <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Legal Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-neutral-500 gap-4">
          <p>© {new Date().getFullYear()} MMA Trainers. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-neutral-300 transition-colors">
              Terms of Use
            </a>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-neutral-400 hover:text-[#E63B30] transition-colors cursor-pointer font-mono font-medium"
              >
                Admin Portal ⚙️
              </button>
            )}
            <span>Austin, Texas, USA</span>
          </div>
        </div>

        {/* Giant subtle background branding text */}
        <div className="mt-14 pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="font-['Oswald'] text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tight text-white/[0.06] select-none pointer-events-none text-center sm:text-left leading-none">
            MODERN MARTIAL ARTS TRAINING CENTER
          </div>
          <div className="opacity-10 shrink-0 hidden sm:block">
            <div className="w-12 h-12 rounded-xl border border-white flex items-center justify-center font-['Oswald'] font-black text-2xl text-white">
              RAI
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
