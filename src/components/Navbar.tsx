import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ArrowUpRight } from 'lucide-react';
import { RaiLogo } from './RaiLogo';

interface NavbarProps {
  onBookTrial: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onBookTrial }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
    { label: 'Programs', href: '#programs' },
    { label: 'About', href: '#about' },
    { label: 'Coaches', href: '#coaches' },
    { label: 'Reviews', href: '#reviews' },
    { label: 'FAQ', href: '#faq' },
  ];

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 px-3 sm:px-6 pt-3 sm:pt-4 transition-all duration-300 pointer-events-none">
        <div
          className={`pointer-events-auto max-w-[1240px] mx-auto rounded-2xl md:rounded-full px-4 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300 ${
            scrolled
              ? 'bg-black/90 backdrop-blur-md border border-white/15 text-white shadow-2xl shadow-black/80'
              : 'bg-white text-black shadow-xl shadow-black/25'
          }`}
        >
          {/* Logo */}
          <a href="#" className="flex items-center group">
            <RaiLogo theme={scrolled ? 'dark' : 'light'} />
          </a>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

          {/* Right Action: Red Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={onBookTrial}
              className="hidden sm:inline-flex items-center gap-1.5 px-4 sm:px-5 py-2 sm:py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white text-[11px] sm:text-xs font-bold uppercase tracking-wider rounded-xl md:rounded-full transition-all shadow-md shadow-[#E63B30]/30 hover:shadow-lg hover:shadow-[#E63B30]/40 active:scale-95 cursor-pointer"
            >
              <span>BOOK A FREE TRIAL</span>
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
              <div className="pt-3">
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onBookTrial();
                  }}
                  className="w-full py-3 bg-[#E63B30] text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-lg shadow-[#E63B30]/30 cursor-pointer"
                >
                  Book a Free Trial ↗
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
