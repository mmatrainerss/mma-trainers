import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  CheckCircle2,
  Calendar,
  Clock,
  Sparkles,
  AlertCircle,
  MessageCircle,
  MapPin,
  Upload,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  Check,
  FileCheck,
  Image as ImageIcon
} from 'lucide-react';
import { cleanIndianMobileInput, isValidIndianMobile, formatWhatsAppLink, formatPhoneForStorage } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';
import { TRICITY_LOCATIONS, PRICING_PLANS } from '../data/martialArtsData';
import { UpiQrCode } from './client/UpiQrCode';
import { uploadPaymentProof } from '../lib/storageUtils';

export interface PlanOption {
  id: string;
  name: string;
  amount: number;
}

const AVAILABLE_PLANS: PlanOption[] = [
  { id: 'trial', name: 'Introductory Trial Session (Testing & Consultation)', amount: 999 },
  { id: 'zone-1', name: 'Zone 1 Monthly Plan (Chandigarh · Mohali · Kharar)', amount: 13000 },
  { id: 'zone-2', name: 'Zone 2 Monthly Plan (Zirakpur · Panchkula · New Chandigarh)', amount: 15000 },
  { id: 'elder', name: 'Elder Age Fitness Training (Senior Wellness Package)', amount: 15000 },
  { id: 'family', name: 'Family Group Plan (4 Members)', amount: 20000 },
];

interface TrialModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultProgram?: string;
  defaultPlanId?: string;
  defaultAmount?: number;
  defaultLocation?: string;
  defaultSlot?: string;
}

export const TrialModal: React.FC<TrialModalProps> = ({
  isOpen,
  onClose,
  defaultProgram = 'Mixed Martial Arts (MMA)',
  defaultPlanId = 'trial',
  defaultAmount = 999,
  defaultLocation = 'Chandigarh',
  defaultSlot = '07:00 PM – 08:00 PM (Prime)',
}) => {
  // Step: 1 = Details Form, 2 = Payment Procedure, 3 = Confirmation
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form Details
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState(defaultLocation);
  const [program, setProgram] = useState(defaultProgram);
  const [selectedPlanId, setSelectedPlanId] = useState(defaultPlanId);
  const [preferredSlot, setPreferredSlot] = useState(defaultSlot);
  const [participantType, setParticipantType] = useState('Myself (Adult)');
  const [notes, setNotes] = useState('');

  // Payment Details
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);

  // Status
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [createdRefId, setCreatedRefId] = useState('');

  const settings = formStorage.getAgencySettings();
  const agencyPhone = settings.whatsappNumber || '917986851137';
  const agencyUpi = settings.upiId || '7668598281@ybl';

  // Find active plan and amount
  const activePlan = AVAILABLE_PLANS.find((p) => p.id === selectedPlanId) || AVAILABLE_PLANS[0];
  const payableAmount = activePlan.amount;

  // Sync defaults on open
  useEffect(() => {
    if (isOpen) {
      if (defaultProgram) setProgram(defaultProgram);
      if (defaultPlanId) setSelectedPlanId(defaultPlanId);
      if (defaultLocation) setLocation(defaultLocation);
      if (defaultSlot) setPreferredSlot(defaultSlot);
    }
  }, [isOpen, defaultProgram, defaultPlanId, defaultLocation, defaultSlot]);

  // Handle file select for payment screenshot
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setScreenshotFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotPreview(null);
  };

  // Step 1 Validation -> Proceed to Payment
  const handleProceedToPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !phone.trim()) {
      setError('Please fill in your name, email and WhatsApp mobile number.');
      return;
    }
    if (!isValidIndianMobile(phone)) {
      setError('Please enter a valid 10-digit Indian WhatsApp mobile number.');
      return;
    }
    setError('');
    setStep(2);
  };

  // Build full WhatsApp message with ALL details
  const buildWhatsAppMessage = (refId: string) => {
    return (
      `Hello MMA Trainers! I have submitted my enrollment details and payment proof:\n\n` +
      `*ENROLLMENT DETAILS:*\n` +
      `• Admission Ref: ${refId}\n` +
      `• Name: ${name.trim()}\n` +
      `• WhatsApp Phone: +91 ${phone}\n` +
      `• Email: ${email.trim()}\n` +
      `• Course / Curriculum: ${program}\n` +
      `• Plan: ${activePlan.name}\n` +
      `• Total Fee: ₹${payableAmount.toLocaleString('en-IN')}\n` +
      `• Tricity Location: ${location}\n` +
      `• Preferred Timing Slot: ${preferredSlot}\n` +
      `• Participant: ${participantType}\n` +
      (notes.trim() ? `• Goals / Notes: ${notes.trim()}\n\n` : '\n') +
      `*PAYMENT INFORMATION:*\n` +
      `• Payment Mode: Direct UPI QR Code\n` +
      `• UTR / Reference Ref: ${utrNumber.trim() || 'Payment completed via UPI'}\n` +
      `• Payment Proof: (Attaching screenshot below)\n\n` +
      `Please confirm my registration and trainer slot allocation!`
    );
  };

  // Final Step: Submit Payment & Redirect to WhatsApp
  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError('');

    try {
      const generatedId = `MMA-${Date.now().toString().slice(-6)}`;
      setCreatedRefId(generatedId);

      let uploadedScreenshotUrl = screenshotPreview || undefined;
      if (screenshotFile) {
        try {
          const res = await uploadPaymentProof(screenshotFile, 'enrollment');
          if (res.success && res.publicUrl) {
            uploadedScreenshotUrl = res.publicUrl;
          }
        } catch (uploadErr) {
          console.warn('Storage upload fallback:', uploadErr);
        }
      }

      // Save submission in formStorage so it syncs to Admin
      formStorage.saveSubmission({
        formId: `course-${activePlan.id}`,
        programTitle: `${program} (${activePlan.name})`,
        amount: payableAmount,
        upiId: agencyUpi,
        fullName: name.trim(),
        phone: formatPhoneForStorage(phone),
        email: email.trim(),
        emergencyContactName: location,
        emergencyContactPhone: preferredSlot,
        fitnessGoals: notes.trim(),
        utrNumber: utrNumber.trim() || 'Paid via UPI QR',
        screenshotUrl: uploadedScreenshotUrl,
        screenshotFileName: screenshotFile?.name || undefined,
        paymentMethod: 'upi',
        status: 'pending',
      });

      // Construct and trigger WhatsApp redirect
      const message = buildWhatsAppMessage(generatedId);
      window.open(formatWhatsAppLink(agencyPhone, message), '_blank');

      setStep(3);
    } catch (err) {
      console.error(err);
      setError('An error occurred while saving your details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setStep(1);
    setName('');
    setEmail('');
    setPhone('');
    setLocation('Chandigarh');
    setProgram('Mixed Martial Arts (MMA)');
    setSelectedPlanId('trial');
    setPreferredSlot('07:00 PM – 08:00 PM (Prime)');
    setNotes('');
    setUtrNumber('');
    setScreenshotFile(null);
    setScreenshotPreview(null);
    setError('');
    setCreatedRefId('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 select-none">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/85 backdrop-blur-md"
          />

          {/* Modal Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-xl bg-[#111111] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[92vh] overflow-y-auto text-white flex flex-col justify-between"
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className="absolute top-5 right-5 text-neutral-400 hover:text-white p-2 rounded-xl hover:bg-white/10 transition-colors cursor-pointer z-20"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header with Step Tracker */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="w-2 h-2 rounded-full bg-[#E63B30]" />
                <span className="text-[11px] font-mono tracking-widest uppercase text-neutral-400 font-bold">
                  {step === 1 && 'Step 1 of 2: Details & Schedule'}
                  {step === 2 && 'Step 2 of 2: Payment Procedure & WhatsApp'}
                  {step === 3 && 'Confirmation'}
                </span>
              </div>

              <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {step === 1 && 'Course & Curriculum Enrollment'}
                {step === 2 && 'Payment Procedure & Verification'}
                {step === 3 && 'Details Forwarded to WhatsApp'}
              </h2>

              <p className="text-xs text-neutral-400 mt-1">
                {step === 1 && 'Select your training curriculum, location, and timing slot.'}
                {step === 2 && 'Scan the UPI QR code below, upload proof, and redirect to WhatsApp.'}
                {step === 3 && 'Your admission reference has been generated and forwarded.'}
              </p>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-red-950/60 border border-red-800 text-red-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* STEP 1: DETAILS FORM */}
            {step === 1 && (
              <form onSubmit={handleProceedToPayment} className="space-y-4">
                {/* Plan Selection */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Select Training Plan / Package *
                  </label>
                  <select
                    value={selectedPlanId}
                    onChange={(e) => setSelectedPlanId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                  >
                    {AVAILABLE_PLANS.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} — ₹{p.amount.toLocaleString('en-IN')}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Course / Curriculum Discipline */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Curriculum / Discipline *
                  </label>
                  <select
                    value={program}
                    onChange={(e) => setProgram(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                  >
                    <option value="Mixed Martial Arts (MMA)">Mixed Martial Arts (MMA)</option>
                    <option value="Boxing">Boxing (Striking & Kinetic Mechanics)</option>
                    <option value="Kickboxing">Kickboxing (Conditioning & Pads)</option>
                    <option value="Practical Self Defence">Practical Self Defence (Escapes & Leverage)</option>
                    <option value="Elder Age Fitness Training">Elder Age Fitness Training (Senior Wellness)</option>
                  </select>
                </div>

                {/* Name & Phone */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Jaspreet Singh"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider">
                        WhatsApp Mobile *
                      </label>
                      <span className="text-[10px] font-mono text-neutral-400">
                        {phone.length}/10
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
                        value={phone}
                        onChange={(e) => setPhone(cleanIndianMobileInput(e.target.value))}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2.5 bg-transparent text-sm text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                      />
                    </div>
                  </div>
                </div>

                {/* Email & Location */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="e.g. name@example.com"
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Tricity Hub / Location *
                    </label>
                    <select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                    >
                      {TRICITY_LOCATIONS.map((loc) => (
                        <option key={loc.name} value={loc.name}>
                          {loc.name} ({loc.tier})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Preferred Slot & Participant */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Hourly Timing Slot *
                    </label>
                    <select
                      value={preferredSlot}
                      onChange={(e) => setPreferredSlot(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                    >
                      <option value="06:30 AM – 07:30 AM (Fast Burn)">06:30 AM – 07:30 AM (Morning 1)</option>
                      <option value="08:00 AM – 09:00 AM (High Energy)">08:00 AM – 09:00 AM (Morning 2)</option>
                      <option value="09:30 AM – 10:30 AM (Senior Gentle)">09:30 AM – 10:30 AM (Senior / Gentle)</option>
                      <option value="11:00 AM – 12:00 PM (Midday Focus)">11:00 AM – 12:00 PM (Midday)</option>
                      <option value="04:00 PM – 05:00 PM (Afternoon)">04:00 PM – 05:00 PM (Afternoon)</option>
                      <option value="05:30 PM – 06:30 PM (Evening Kickstart)">05:30 PM – 06:30 PM (Evening)</option>
                      <option value="07:00 PM – 08:00 PM (Prime Time)">07:00 PM – 08:00 PM (Prime Slot)</option>
                      <option value="08:30 PM – 09:30 PM (Night Pro)">08:30 PM – 09:30 PM (Night)</option>
                      <option value="09:30 PM – 10:30 PM (Late Night)">09:30 PM – 10:30 PM (Late Night)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                      Who Will Train?
                    </label>
                    <select
                      value={participantType}
                      onChange={(e) => setParticipantType(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                    >
                      <option value="Myself (Adult)">Myself (Adult)</option>
                      <option value="Senior Member">Senior Family Member</option>
                      <option value="Family Group (4 Persons)">Family Group (4 Persons)</option>
                      <option value="Youth / Teen">Youth / Teen</option>
                    </select>
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Fitness Goals or Medical Notes (Optional)
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Build core strength, beginner to combat, knee recovery..."
                    className="w-full px-3.5 py-2 bg-neutral-900 border border-white/15 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                  />
                </div>

                {/* Fee Summary Strip */}
                <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between">
                  <div>
                    <span className="text-neutral-400 text-[11px] block">Calculated Package Fee:</span>
                    <span className="font-['Plus_Jakarta_Sans'] font-extrabold text-base text-white">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <span className="text-[11px] text-[#E63B30] font-mono font-bold px-2.5 py-1 rounded bg-[#E63B30]/10 border border-[#E63B30]/20">
                    {activePlan.id === 'trial' ? 'TESTING + CONSULTATION' : '16 SESSIONS / MO'}
                  </span>
                </div>

                {/* Next Button */}
                <button
                  type="submit"
                  className="w-full py-3.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E63B30]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Proceed to Payment Procedure</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}

            {/* STEP 2: PAYMENT PROCEDURE & PROOF */}
            {step === 2 && (
              <form onSubmit={handleFinalSubmit} className="space-y-5">
                {/* Back to Step 1 Button */}
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-white transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Edit Details</span>
                </button>

                {/* Order Summary Pill */}
                <div className="bg-[#161616] border border-white/10 rounded-2xl p-4 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] text-neutral-400">Enrolling for:</p>
                    <p className="font-bold text-sm text-white">{program}</p>
                    <p className="text-[11px] text-neutral-400 font-mono">{activePlan.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] text-neutral-400 uppercase font-mono">Amount Due</p>
                    <p className="font-['Plus_Jakarta_Sans'] text-xl font-extrabold text-[#E63B30]">
                      ₹{payableAmount.toLocaleString('en-IN')}
                    </p>
                  </div>
                </div>

                {/* UPI QR Code & Instructions */}
                <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 flex flex-col items-center">
                  <UpiQrCode
                    amount={payableAmount}
                    upiId={agencyUpi}
                    payeeName="MMA Trainers Academy"
                    note={`Enrollment: ${name.trim()} - ${program}`}
                    size={180}
                  />
                </div>

                {/* UTR / Transaction Reference Input */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    UPI UTR / Transaction Reference Number *
                  </label>
                  <input
                    type="text"
                    required
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 428192837192 or UPI Ref ID"
                    className="w-full px-3.5 py-2.5 bg-neutral-900 border border-white/15 rounded-xl text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                  />
                </div>

                {/* Payment Proof Screenshot Upload */}
                <div>
                  <label className="block text-xs font-medium text-neutral-300 uppercase tracking-wider mb-1.5">
                    Payment Proof Screenshot
                  </label>
                  {screenshotPreview ? (
                    <div className="relative p-3 bg-neutral-900 border border-white/20 rounded-xl flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="w-12 h-12 object-cover rounded-lg border border-white/10"
                        />
                        <div>
                          <p className="text-xs font-semibold text-white truncate max-w-[200px]">
                            {screenshotFile?.name || 'payment_proof.jpg'}
                          </p>
                          <span className="text-[10px] text-emerald-400 inline-flex items-center gap-1 font-mono">
                            <Check className="w-3 h-3" /> Ready to attach on WhatsApp
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={removeScreenshot}
                        className="text-neutral-400 hover:text-red-400 p-1.5 transition-colors cursor-pointer"
                        title="Remove file"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="border-2 border-dashed border-white/15 hover:border-[#E63B30]/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-neutral-900/50">
                      <Upload className="w-5 h-5 text-neutral-400 mb-1" />
                      <span className="text-xs text-neutral-300 font-medium">Click to upload payment screenshot</span>
                      <span className="text-[10px] text-neutral-500 mt-0.5">JPG, PNG, WebP</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Final Submit & WhatsApp Trigger */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 bg-[#25D366] hover:bg-[#20ba59] disabled:bg-neutral-700 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4 fill-white" />
                  <span>
                    {submitting ? 'Redirecting to WhatsApp...' : 'Submit & Forward Proof on WhatsApp'}
                  </span>
                </button>
              </form>
            )}

            {/* STEP 3: CONFIRMATION */}
            {step === 3 && (
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500/20 border border-emerald-500/50 text-emerald-400 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-9 h-9" />
                </div>

                <span className="text-[10px] font-mono uppercase tracking-widest text-[#E63B30] font-bold block mb-1">
                  ADMISSION REFERENCE: {createdRefId}
                </span>

                <h3 className="font-['Plus_Jakarta_Sans'] text-2xl font-bold text-white mb-2">
                  Enrollment Submitted!
                </h3>

                <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto leading-relaxed mb-6 font-normal">
                  Thank you, <span className="font-semibold text-white">{name}</span>! Your details and UTR have been forwarded to our Head Coach on WhatsApp.
                </p>

                {/* Summary Card */}
                <div className="bg-[#141414] border border-white/10 rounded-2xl p-4 text-left max-w-md mx-auto mb-6 text-xs text-neutral-400 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Curriculum:</span>
                    <span className="text-white font-medium">{program}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Plan:</span>
                    <span className="text-white font-medium">{activePlan.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Location:</span>
                    <span className="text-[#E63B30] font-medium">{location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Timing Slot:</span>
                    <span className="text-white font-medium">{preferredSlot}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-500">Fee Paid:</span>
                    <span className="text-emerald-400 font-bold">₹{payableAmount.toLocaleString('en-IN')}</span>
                  </div>
                  {utrNumber && (
                    <div className="flex justify-between">
                      <span className="text-neutral-500">UTR / Ref:</span>
                      <span className="text-white font-mono">{utrNumber}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto">
                  <button
                    type="button"
                    onClick={() => {
                      const msg = buildWhatsAppMessage(createdRefId);
                      window.open(formatWhatsAppLink(agencyPhone, msg), '_blank');
                    }}
                    className="flex-1 py-3 bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md shadow-[#25D366]/25 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <MessageCircle className="w-4 h-4 fill-white" />
                    <span>Open WhatsApp Chat</span>
                  </button>

                  <button
                    type="button"
                    onClick={handleResetAndClose}
                    className="py-3 px-5 bg-white/10 hover:bg-white/15 text-white font-semibold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
                  >
                    Done & Close
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
