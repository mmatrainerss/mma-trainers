import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight, MessageCircle } from 'lucide-react';
import { RaiLogo } from './RaiLogo';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

interface NavbarProps {
  onBookTrial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookTrial }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 40) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Disciplines', href: '#programs' },
    { label: 'Packages & Areas', href: '#pricing' },
    { label: 'Action Reels', href: '#coaches' },
    { label: 'Delivery Modes', href: '#modes' },
    { label: 'FAQ', href: '#faq' },
  ];

  const handleWhatsAppClick = () => {
    const text = 'Hello MMA Trainers! I would like to inquire about training plans, fees, and slot availability in Tricity.';
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-4 sm:px-6 lg:px-10 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none select-none">
        <div
          className={`pointer-events-auto w-full max-w-[1800px] mx-auto rounded-2xl md:rounded-full px-5 sm:px-8 py-2.5 sm:py-3 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-black/95 backdrop-blur-md border border-white/15 text-white shadow-2xl shadow-black/80'
              : 'bg-white text-black shadow-xl shadow-black/25'
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <RaiLogo theme={scrolled ? 'dark' : 'light'} />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={`text-xs xl:text-sm font-semibold tracking-normal transition-colors duration-200 ${
                  scrolled
                    ? 'text-neutral-300 hover:text-white'
                    : 'text-neutral-800 hover:text-black'
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Action: WhatsApp + Trial Button */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            {/* WhatsApp Mini Action */}
            <button
              onClick={handleWhatsAppClick}
              className={`hidden sm:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl md:rounded-full text-xs font-bold transition-all cursor-pointer ${
                scrolled
                  ? 'bg-white/10 hover:bg-[#25D366] hover:text-white text-neutral-200 border border-white/10'
                  : 'bg-neutral-100 hover:bg-[#25D366] hover:text-white text-neutral-800'
              }`}
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-3.5 h-3.5 fill-current text-[#25D366]" />
              <span className="hidden xl:inline">WhatsApp</span>
            </button>

            {/* Trial Session Button */}
            <button
              onClick={onBookTrial}
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-full transition-all shadow-md shadow-[#E63B30]/30 hover:shadow-lg hover:shadow-[#E63B30]/40 active:scale-95 cursor-pointer"
            >
              <span>TRIAL @ ₹999</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className={`lg:hidden p-1.5 rounded-lg transition-colors cursor-pointer ${
                scrolled ? 'text-white hover:bg-white/10' : 'text-black hover:bg-black/5'
              }`}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-x-4 top-20 z-50 bg-[#141414] border border-white/15 rounded-2xl p-6 shadow-2xl text-white lg:hidden"
          >
            <div className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-neutral-300 hover:text-[#E63B30] transition-colors py-2 border-b border-white/5"
                >
                  {link.label}
                </a>
              ))}
              <div className="pt-3 space-y-2">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookTrial();
                  }}
                  className="w-full py-3 bg-[#E63B30] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#E63B30]/30 cursor-pointer"
                >
                  Book Trial Session — ₹999
                </button>
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    handleWhatsAppClick();
                  }}
                  className="w-full py-2.5 bg-[#25D366] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#25D366]/20 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Chat on WhatsApp</span>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
