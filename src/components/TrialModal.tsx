import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, CheckCircle2, Calendar, Clock, Sparkles, AlertCircle } from 'lucide-react';
import { cleanIndianMobileInput, isValidIndianMobile } from '../lib/phoneUtils';

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = 'Brazilian Jiu-Jitsu'
}) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    participantType: 'Myself',
    program: defaultProgram,
    preferredTime: 'Evening (6:00 PM - 8:00 PM)',
    experience: 'None (First time)',
    notes: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
      setError('Please fill out all required contact fields.');
      return;
    }
    setError('');
    setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setFormData({
      name: '',
      email: '',
      phone: '',
      participantType: 'Myself',
      program: 'Brazilian Jiu-Jitsu',
      preferredTime: 'Evening (6:00 PM - 8:00 PM)',
      experience: 'None (First time)',
      notes: ''
    });
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/80 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#141414] border border-white/15 rounded-2xl p-6 md:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-[#E63B30]/20 border border-[#E63B30]/50 text-[#E63B30] flex items-center justify-center mx-auto mb-5">
                  <CheckCircle2 className="w-9 h-9" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-white mb-2 font-['Oswald']">
                  Your Free Trial is Reserved!
                </h3>
                <p className="text-neutral-300 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  Thanks <span className="font-semibold text-white">{formData.name}</span>. Our head coach will text or email you at <span className="text-[#E63B30] font-mono">{formData.phone}</span> within 24 hours to confirm your introductory schedule and prepare your loaner equipment.
                </p>
                <div className="bg-neutral-900 border border-white/10 rounded-xl p-4 text-left max-w-md mx-auto mb-6 text-xs text-neutral-400 space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Program:</span>
                    <span className="text-white font-medium">{formData.program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Preferred Slot:</span>
                    <span className="text-white font-medium">{formData.preferredTime}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Location:</span>
                    <span className="text-white font-medium">000 E 6th St, Austin, TX</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={handleReset}
                  className="px-6 py-3 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#E63B30]/30"
                >
                  Done & Return
                </button>
              </div>
            ) : (
              <div>
                <div className="mb-6">
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-[#E63B30]/20 text-[#E63B30] border border-[#E63B30]/30 mb-3">
                    <Sparkles className="w-3.5 h-3.5" />
                    100% Free · No Obligation
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold uppercase tracking-tight text-white font-['Oswald']">
                    Book Your Free Trial Class
                  </h3>
                  <p className="text-sm text-neutral-400 mt-1">
                    Step on the mats with world-class coaching in a friendly, ego-free Austin training facility.
                  </p>
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-3 mb-4 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Alex Johnson"
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors"
                      />
                    </div>
                    <div>
                      <div className="flex items-center justify-between mb-1.5">
                        <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                          WhatsApp / Phone *
                        </label>
                        <span className="text-[10px] font-mono text-neutral-400">
                          {formData.phone.length}/10
                        </span>
                      </div>
                      <div className="flex items-center rounded-lg border border-white/15 bg-neutral-900 focus-within:border-[#E63B30] focus-within:ring-1 focus-within:ring-[#E63B30] transition-colors overflow-hidden">
                        <div className="flex items-center gap-1 px-3 py-2.5 bg-white/5 border-r border-white/10 text-xs font-mono font-bold text-neutral-300 select-none shrink-0">
                          <span>🇮🇳</span>
                          <span>+91</span>
                        </div>
                        <input
                          type="tel"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          maxLength={10}
                          required
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: cleanIndianMobileInput(e.target.value) })}
                          placeholder="9876543210"
                          className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                        />
                        {isValidIndianMobile(formData.phone) && (
                          <div className="pr-3 text-xs font-mono font-bold text-emerald-400">
                            ✓
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="alex@example.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                        Program of Interest
                      </label>
                      <select
                        value={formData.program}
                        onChange={(e) => setFormData({ ...formData, program: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                      >
                        <option value="Kids Martial Arts">Kids Martial Arts (Ages 5–12)</option>
                        <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu (BJJ)</option>
                        <option value="Muay Thai & Kickboxing">Muay Thai & Kickboxing</option>
                        <option value="Mixed Martial Arts">Mixed Martial Arts (MMA)</option>
                        <option value="Not Sure Yet">Not Sure - Guide Me</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                        Who Will Train?
                      </label>
                      <select
                        value={formData.participantType}
                        onChange={(e) => setFormData({ ...formData, participantType: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                      >
                        <option value="Myself">Myself (Adult)</option>
                        <option value="My Child">My Child</option>
                        <option value="Family">Family (Multiple)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                        Experience Level
                      </label>
                      <select
                        value={formData.experience}
                        onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                      >
                        <option value="None">None (Absolute Beginner)</option>
                        <option value="Some">Under 1 Year</option>
                        <option value="Experienced">1 - 3 Years</option>
                        <option value="Advanced">3+ Years / Ranked</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                        Preferred Time
                      </label>
                      <select
                        value={formData.preferredTime}
                        onChange={(e) => setFormData({ ...formData, preferredTime: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-lg text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                      >
                        <option value="Afternoon (4:00 PM Kids)">Afternoon (4:00 PM Kids)</option>
                        <option value="Evening (5:00 PM - 7:30 PM)">Evening (5:00 PM - 7:30 PM)</option>
                        <option value="Saturday Morning (9:00 AM - 1:00 PM)">Saturday Morning</option>
                      </select>
                    </div>
                  </div>

                  <p className="text-[11px] text-neutral-500 leading-normal pt-1">
                    * By clicking submit, you confirm you are 18+ or a parent/guardian registering on behalf of a minor. No credit card required.
                  </p>

                  <button
                    type="submit"
                    className="w-full mt-2 py-3.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-sm tracking-wider uppercase rounded-xl transition-all shadow-lg shadow-[#E63B30]/30 hover:shadow-[#E63B30]/50"
                  >
                    Confirm Free Trial Class
                  </button>
                </form>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
