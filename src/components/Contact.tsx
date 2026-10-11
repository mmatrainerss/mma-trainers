import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, ArrowUpRight, CheckCircle2, AlertCircle } from 'lucide-react';
import { MediaPlaceholder } from './MediaPlaceholder';
import { cleanIndianMobileInput, isValidIndianMobile, formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

export const Contact: React.FC = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    trainee: 'My Child',
    program: 'Kids Martial Arts',
    experience: 'No Experience',
    message: ''
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please provide your name, email and phone number.');
      return;
    }
    setError('');
    setSubmitted(true);

    const settings = formStorage.getAgencySettings();
    const phone = settings.whatsappNumber || '917986851137';
    const text =
      `Hello MMA Trainers! 👋\n\n` +
      `New Free Trial / Class Inquiry:\n` +
      `• Name: ${form.name.trim()}\n` +
      `• Program: ${form.program}\n` +
      `• Trainee: ${form.trainee}\n` +
      `• Experience: ${form.experience}\n` +
      (form.message.trim() ? `• Note: ${form.message.trim()}\n\n` : '\n') +
      `Please let me know the upcoming batch schedule!`;

    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <section id="contact" className="py-24 bg-[#F4F4F5] relative border-t border-black/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
              CONTACT MMA TRAINERS
            </div>
            <h2 className="font-['Oswald'] text-3xl sm:text-5xl font-bold uppercase tracking-tight text-neutral-900 leading-tight">
              Ready to Start? <br />
              Contact MMA Trainers
            </h2>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-sm sm:text-base text-neutral-600 max-w-md leading-relaxed"
          >
            Call us, visit the training center, or fill out the form and our team will contact you to help you choose the right class.
          </motion.p>
        </div>

        {/* 2-Column Split: Info Card & Form */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Dark Info Card */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 bg-white border border-black/10 rounded-2xl overflow-hidden p-6 sm:p-8 flex flex-col justify-between shadow-xl"
          >
            {/* Facility Photo Placeholder */}
            <div className="mb-8">
              <MediaPlaceholder
                aspectRatio="aspect-[16/9]"
                className="w-full"
                badge="AUSTIN TRAINING FACILITY"
                label="MMA Trainers Academy"
                sublabel="Downtown Austin, Texas"
                icon="shield"
              />
            </div>

            {/* Contact Details */}
            <div className="space-y-6">
              {/* Phone */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  PHONE
                </span>
                <a
                  href="tel:+15125551234"
                  className="font-['Oswald'] text-lg sm:text-xl font-bold text-white hover:text-[#E63B30] transition-colors"
                >
                  +1 (512) 555-1234
                </a>
              </div>

              {/* Email */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  EMAIL
                </span>
                <a
                  href="mailto:contact@mmatrainers.com"
                  className="text-sm sm:text-base font-semibold text-neutral-900 hover:text-[#E63B30] transition-colors"
                >
                  contact@mmatrainers.com
                </a>
              </div>

              {/* Address */}
              <div>
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-1">
                  ADDRESS
                </span>
                <p className="text-sm text-neutral-200 font-medium">
                  000 East 6th Street • Austin, TX 78701 • United States
                </p>
                <a
                  href="#map-section"
                  className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[#E63B30] hover:text-white mt-2 group"
                >
                  <span>GET DIRECTIONS</span>
                  <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </a>
              </div>

              {/* Operating Hours */}
              <div className="pt-4 border-t border-black/10">
                <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 block mb-2">
                  FACILITY HOURS
                </span>
                <div className="space-y-1 text-xs text-neutral-700">
                  <div className="flex justify-between">
                    <span>Monday–Friday:</span>
                    <span className="font-semibold text-neutral-900">3:30 PM–9:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday:</span>
                    <span className="font-semibold text-neutral-900">9:00 AM–2:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday:</span>
                    <span className="text-neutral-500">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Clean Form */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 bg-white border border-black/10 rounded-2xl p-6 sm:p-8 shadow-xl"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-[#E63B30]/20 border border-[#E63B30]/50 text-[#E63B30] flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold uppercase tracking-tight text-neutral-900 mb-2 font-['Oswald']">
                  Message Received
                </h3>
                <p className="text-neutral-600 text-sm max-w-md mx-auto leading-relaxed mb-6">
                  Thank you for reaching out, <span className="font-semibold text-neutral-900">{form.name}</span>. A coach from MMA Trainers will contact you at <span className="text-[#E63B30]">{form.email}</span> or <span className="text-[#E63B30]">{form.phone}</span> within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setForm({
                      name: '',
                      email: '',
                      phone: '',
                      trainee: 'My Child',
                      program: 'Kids Martial Arts',
                      experience: 'No Experience',
                      message: ''
                    });
                  }}
                  className="px-6 py-2.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-900 text-xs font-bold uppercase tracking-wider rounded-lg transition-colors"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                {error && (
                  <div className="flex items-center gap-2 p-3 rounded-lg bg-red-950/60 border border-red-800 text-red-300 text-xs">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                {/* Full Name */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    placeholder="John Doe"
                    className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                      Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm({ ...form, email: e.target.value })}
                      placeholder="email@example.com"
                      className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors"
                    />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider">
                        WhatsApp / Phone *
                      </label>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {form.phone.length}/10
                      </span>
                    </div>
                    <div className="flex items-center rounded-xl border border-black/10 bg-neutral-50 focus-within:border-[#E63B30] focus-within:ring-1 focus-within:ring-[#E63B30] transition-colors overflow-hidden">
                      <div className="flex items-center gap-1 px-3 py-3 bg-neutral-200/50 border-r border-black/10 text-xs font-mono font-bold text-neutral-700 select-none shrink-0">
                        <span>🇮🇳</span>
                        <span>+91</span>
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
                        className="flex-1 px-3.5 py-3 bg-transparent text-sm text-neutral-900 font-mono placeholder-neutral-400 focus:outline-none tracking-wider"
                      />
                      {isValidIndianMobile(form.phone) && (
                        <div className="pr-3 text-xs font-mono font-bold text-emerald-600">
                          ✓
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Who Will Be Training */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                    Who Will Be Training?
                  </label>
                  <select
                    value={form.trainee}
                    onChange={(e) => setForm({ ...form, trainee: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-[#E63B30] transition-colors"
                  >
                    <option value="My Child">My Child</option>
                    <option value="Myself">Myself (Adult)</option>
                    <option value="Family">Both / Family</option>
                  </select>
                  <p className="text-[11px] text-neutral-500 mt-1">
                    A parent or legal guardian must submit this form for anyone under 18.
                  </p>
                </div>

                {/* Program */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                    Program
                  </label>
                  <select
                    value={form.program}
                    onChange={(e) => setForm({ ...form, program: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-[#E63B30] transition-colors"
                  >
                    <option value="Kids Martial Arts">Kids Martial Arts</option>
                    <option value="Brazilian Jiu-Jitsu">Brazilian Jiu-Jitsu (BJJ)</option>
                    <option value="Muay Thai & Kickboxing">Muay Thai & Kickboxing</option>
                    <option value="Mixed Martial Arts">Mixed Martial Arts (MMA)</option>
                    <option value="General Inquiry">General Inquiry / Not Sure</option>
                  </select>
                </div>

                {/* Experience Level */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                    Experience Level
                  </label>
                  <select
                    value={form.experience}
                    onChange={(e) => setForm({ ...form, experience: e.target.value })}
                    className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-[#E63B30] transition-colors"
                  >
                    <option value="No Experience">No Experience</option>
                    <option value="Beginner (< 1 Year)">Beginner (&lt; 1 Year)</option>
                    <option value="Intermediate (1-3 Years)">Intermediate (1–3 Years)</option>
                    <option value="Advanced (3+ Years)">Advanced (3+ Years)</option>
                  </select>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-neutral-600 uppercase tracking-wider mb-1.5">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={form.message}
                    onChange={(e) => setForm({ ...form, message: e.target.value })}
                    placeholder="Tell us about your fitness goals, your schedule availability, or any questions..."
                    className="w-full px-4 py-3 bg-neutral-50 border border-black/10 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors resize-none"
                  />
                </div>

                <p className="text-[10px] text-neutral-500 leading-tight">
                  By submitting this form, you agree to be contacted about classes and acknowledge our Privacy Policy.
                </p>

                {/* Submit Button */}
                <button
                  type="submit"
                  className="w-full py-4 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg shadow-[#E63B30]/30 hover:shadow-[#E63B30]/50 active:scale-[0.99]"
                >
                  REQUEST A FREE TRIAL
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};
