import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, CheckCircle2, AlertCircle, MessageCircle } from 'lucide-react';
import { cleanIndianMobileInput, formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';
import { TRICITY_LOCATIONS } from '../data/martialArtsData';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Chandigarh',
    program: 'Mixed Martial Arts (MMA)',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please provide your name, email and WhatsApp phone number.');
      return;
    }
    setError('');
    setSubmitted(true);

    const text =
      `Hello MMA Trainers,\n\n` +
      `Inquiry via Website Contact Form:\n` +
      `• Name: ${form.name.trim()}\n` +
      `• Phone: +91 ${form.phone}\n` +
      `• Location: ${form.location}\n` +
      `• Program: ${form.program}\n` +
      (form.message.trim() ? `• Message: ${form.message.trim()}\n\n` : '\n') +
      `Please let me know training schedule and slot availability.`;

    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <section id="contact" className="py-20 sm:py-24 bg-[#0B0B0B] text-white relative border-t border-white/5 select-none">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Header */}
        <div className="max-w-2xl mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <span className="text-[11px] font-mono tracking-widest uppercase text-[#E63B30] block mb-2 font-bold">
              GET IN TOUCH
            </span>
            <h2 className="font-['Plus_Jakarta_Sans'] text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-3">
              Contact & Inquiry
            </h2>
            <p className="text-sm text-neutral-400 font-normal">
              Direct consultation for personalized combat training and doorstep visits across Tricity.
            </p>
          </motion.div>
        </div>

        {/* 2-Column Split: Info Card & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4 }}
            className="lg:col-span-5 bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8 flex flex-col justify-between space-y-6"
          >
            <div>
              <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] font-bold block mb-2">
                TRICITY HEADQUARTERS
              </span>
              <h3 className="font-['Plus_Jakarta_Sans'] text-xl font-bold text-white mb-1">
                MMA Trainers Academy
              </h3>
              <p className="text-xs text-neutral-400 leading-relaxed">
                Chandigarh · Mohali · Kharar · Zirakpur · Panchkula · New Chandigarh
              </p>
            </div>

            {/* Contact Details */}
            <div className="space-y-4 pt-2">
              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  WHATSAPP DIRECT
                </span>
                <a
                  href={`https://wa.me/${phone}`}
                  target="_blank"
                  rel="noreferrer"
                  className="font-mono text-sm font-semibold text-white hover:text-[#25D366] transition-colors inline-flex items-center gap-2"
                >
                  <MessageCircle className="w-4 h-4 text-[#25D366]" />
                  <span>+91 79868 51137</span>
                </a>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  TIMINGS
                </span>
                <p className="text-xs text-neutral-300 font-medium">
                  6:30 AM – 10:30 PM (Continuous Hourly Slots)
                </p>
              </div>

              <div>
                <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-500 block mb-1">
                  FORMAT
                </span>
                <p className="text-xs text-neutral-300 font-medium">
                  16 Sessions / Month · Alternate Days · 30m Rest Buffer
                </p>
              </div>
            </div>

            {/* Quick Action */}
            <div className="pt-4 border-t border-white/5">
              <button
                type="button"
                onClick={() => {
                  const text = 'Hello MMA Trainers, I would like to inquire about training plans.';
                  window.open(formatWhatsAppLink(phone, text), '_blank');
                }}
                className="w-full py-3 px-4 bg-white/5 hover:bg-white/10 text-white border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#25D366]" />
                <span>Quick WhatsApp Chat</span>
              </button>
            </div>
          </motion.div>

          {/* Right Column: Clean Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.08 }}
            className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-2xl p-6 sm:p-8"
          >
            {submitted ? (
              <div className="text-center py-10">
                <div className="w-14 h-14 rounded-full bg-[#E63B30]/20 border border-[#E63B30]/40 text-[#E63B30] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2 font-['Plus_Jakarta_Sans']">
                  Inquiry Forwarded
                </h3>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto leading-relaxed mb-6">
                  Thank you, <span className="text-white font-medium">{form.name}</span>. Your details have been sent to our coaching desk on WhatsApp.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="e.g. Jaspreet Singh"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="e.g. name@example.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        WhatsApp Mobile *
                      </label>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {form.phone.length}/10
                      </span>
                    </div>
                    <div className="flex items-center rounded-xl border border-white/15 bg-neutral-900 focus-within:border-[#E63B30] transition-colors overflow-hidden">
                      <div className="px-3 py-2.5 bg-white/5 border-r border-white/10 text-xs font-mono font-bold text-neutral-300 select-none shrink-0">
                        +91
                      </div>
                      <input
                        type="tel"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={10}
                        required
                        value={form.phone}
                        onChange={(e) => setForm({ ...form, phone: cleanIndianMobileInput(e.target.value) })}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Location & Program */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Location *
                    </label>
                    <select
                      value={form.location}
                      onChange={(e) => setForm({ ...form, location: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                    >
                      {TRICITY_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} ({loc.tier} · {loc.price})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Program of Interest *
                    </label>
                    <select
                      value={form.program}
                      onChange={(e) => setForm({ ...form, program: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                    >
                      <option value="Mixed Martial Arts (MMA)">Mixed Martial Arts (MMA)</option>
                      <option value="Boxing">Boxing</option>
                      <option value="Kickboxing">Kickboxing</option>
                      <option value="Practical Self Defence">Practical Self Defence</option>
                      <option value="Elder Age Fitness Training">Elder Age Fitness Training</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Notes / Query (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Any specific goals, preferred timings, or questions..."
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#E63B30]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>Send Inquiry via WhatsApp</span>
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
