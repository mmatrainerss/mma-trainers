import React, { useState, useEffect } from 'react';
import {
  Link2,
  Copy,
  Check,
  Eye,
  MessageSquare,
  Zap,
  FileText,
} from 'lucide-react';
import { formStorage } from '../../services/formStorage';
import { PaymentFormConfig } from '../../types/admin';
import { UpiQrCode } from '../client/UpiQrCode';
import {
  cleanIndianMobileInput,
  isValidIndianMobile,
  getWhatsAppDigits,
  formatWhatsAppLink,
} from '../../lib/phoneUtils';

interface FormGeneratorPanelProps {
  onPreviewForm: (formId: string) => void;
}

export const FormGeneratorPanel: React.FC<FormGeneratorPanelProps> = ({ onPreviewForm }) => {
  const defaults = formStorage.getDefaults();

  // Generator Mode: 'full' (Student Registration Form) | 'quick' (Simple QR Code Payment)
  const [generatorMode, setGeneratorMode] = useState<'full' | 'quick'>('full');

  // Form Fields
  const [amount, setAmount] = useState<number>(3500);
  const [upiId, setUpiId] = useState<string>(defaults.defaultUpi);
  const [payeeName, setPayeeName] = useState<string>(defaults.defaultAgencyName || 'MMA Trainers Academy');
  const [programTitle, setProgramTitle] = useState<string>('Brazilian Jiu-Jitsu (Monthly Unlimited)');
  
  // WhatsApp Number (persisted in localStorage / Supabase)
  const [whatsappNumber, setWhatsappNumber] = useState<string>(() =>
    cleanIndianMobileInput(defaults.defaultPhone) || '7986851137'
  );
  
  const [razorpayKeyId, setRazorpayKeyId] = useState<string>(defaults.defaultRazorpayKey);
  const [notes, setNotes] = useState<string>('Includes loaner Gi, locker access, and 6 days/week open mat sessions.');

  // Output & UI State
  const [generatedForm, setGeneratedForm] = useState<PaymentFormConfig | null>(null);
  const [copied, setCopied] = useState(false);

  // Auto-sync form fields if defaults are edited in the global modal
  useEffect(() => {
    const handleDefaultsUpdate = () => {
      const current = formStorage.getDefaults();
      setUpiId(current.defaultUpi);
      setPayeeName(current.defaultAgencyName);
      setWhatsappNumber(cleanIndianMobileInput(current.defaultPhone) || '7986851137');
      if (current.defaultRazorpayKey) {
        setRazorpayKeyId(current.defaultRazorpayKey);
      }
    };

    const unsubscribe = formStorage.subscribeToUpdates(handleDefaultsUpdate);
    return unsubscribe;
  }, []);

  // Presets for Full Registration
  const fullAmountPresets = [999, 1999, 2500, 3500, 4500, 7500, 12000];
  const programPresets = [
    'Brazilian Jiu-Jitsu (Monthly Unlimited)',
    'Muay Thai & Kickboxing - Fighter Bootcamp',
    'Mixed Martial Arts (MMA All-Access)',
    'Kids Martial Arts (Quarterly)',
    'Personal 1-on-1 MMA Training',
  ];

  // Presets for Quick QR Mode
  const quickAmountPresets = [500, 1000, 1500, 2000, 3000, 5000];
  const quickPurposePresets = [
    'Drop-in Sparring & Training Pass',
    'MMA Uniform & Gloves Fee',
    'Monthly Membership Balance',
    'Personal Coaching Session',
    'Fight Camp Gear Pass',
  ];

  // Generate the shareable link for client
  const getShareableUrl = (form: PaymentFormConfig) => {
    const origin = window.location.origin;
    const path = window.location.pathname;
    if (form.formType === 'quick') {
      return `${origin}${path}?quick=${form.id}`;
    }
    return `${origin}${path}?form=${form.id}`;
  };

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();

    if (!amount || amount <= 0) {
      alert('Please enter a valid amount.');
      return;
    }
    if (!upiId.trim()) {
      alert('Please enter a valid UPI ID.');
      return;
    }

    if (!whatsappNumber.trim() || !isValidIndianMobile(whatsappNumber)) {
      alert('Please enter a valid 10-digit Indian WhatsApp mobile number.');
      return;
    }

    const cleanWhatsApp = getWhatsAppDigits(whatsappNumber) || '919876543210';

    // Persist default phone and UPI in localStorage
    try {
      localStorage.setItem('mma_admin_default_phone_v1', cleanWhatsApp);
      localStorage.setItem('mma_admin_default_upi_v1', upiId.trim());
    } catch (err) {
      console.warn('LocalStorage save error:', err);
    }

    const created = formStorage.createForm({
      amount: Number(amount),
      upiId: upiId.trim(),
      payeeName: payeeName.trim() || 'MMA Trainers Academy',
      programTitle: programTitle.trim() || (generatorMode === 'quick' ? 'MMA Direct Payment' : 'MMA Training Program'),
      whatsappNumber: cleanWhatsApp,
      formType: generatorMode,
      notes: notes.trim() || undefined,
      razorpayKeyId: generatorMode === 'full' ? (razorpayKeyId.trim() || undefined) : undefined,
    });

    setGeneratedForm(created);
  };

  const handleCopyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = (form: PaymentFormConfig) => {
    const url = getShareableUrl(form);
    
    let text = '';
    if (form.formType === 'quick') {
      text =
        `Hello,\n\nHere is your instant UPI QR payment link for *${form.programTitle}* at MMA Trainers Academy:\n\n` +
        `💰 *Fee:* ₹${Number(form.amount || 0).toLocaleString('en-IN')}\n` +
        `📲 *Pay & Send Screenshot here:* ${url}\n\n` +
        `_Scan the UPI QR code on the page and tap the WhatsApp button to submit your payment screenshot._`;
    } else {
      text =
        `Hello,\n\nHere is your official registration and payment link for *${form.programTitle}* at MMA Trainers Academy:\n\n` +
        `💰 *Fee:* ₹${Number(form.amount || 0).toLocaleString('en-IN')}\n` +
        `📲 *Pay & Register here:* ${url}\n\n` +
        `_Scan the UPI QR code on the page, send your payment screenshot on WhatsApp, and complete your registration details._`;
    }

    window.open(formatWhatsAppLink('', text), '_blank');
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Top Header & Mode Switcher */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div>
          <h2 className="font-['Oswald'] text-2xl font-bold uppercase text-white tracking-wide">
            Payment Link Generator
          </h2>
          <p className="text-xs text-neutral-400 mt-0.5">
            Choose between full student registration or a quick amount QR code
          </p>
        </div>

        {/* Mode Selector Segmented Pill */}
        <div className="flex p-1 bg-[#0D0D0D] border border-white/15 rounded-2xl w-full sm:w-auto">
          {/* Mode 1: Full Registration Form */}
          <button
            type="button"
            onClick={() => {
              setGeneratorMode('full');
              if (programTitle === 'Drop-in Sparring & Training Pass') {
                setProgramTitle('Brazilian Jiu-Jitsu (Monthly Unlimited)');
                setAmount(3500);
              }
            }}
            className={`flex-1 sm:flex-none py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              generatorMode === 'full'
                ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Full Registration Form</span>
          </button>

          {/* Mode 2: Quick QR Payment */}
          <button
            type="button"
            onClick={() => {
              setGeneratorMode('quick');
              setProgramTitle('Drop-in Sparring & Training Pass');
              setAmount(1500);
            }}
            className={`flex-1 sm:flex-none py-2 px-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
              generatorMode === 'quick'
                ? 'bg-amber-500 text-black font-extrabold shadow-md shadow-amber-500/30'
                : 'text-neutral-400 hover:text-white hover:bg-white/5'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Quick QR Payment</span>
          </button>
        </div>
      </div>

      {/* Main Generator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Input Form (7 Cols) */}
        <div className="lg:col-span-7 bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
          {/* Mode Title Strip */}
          <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
            {generatorMode === 'quick' ? (
              <>
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Oswald'] text-base font-bold uppercase text-white">
                    Quick QR Code Generator
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Generates a shareable webpage with just the UPI QR code and WhatsApp submission button
                  </p>
                </div>
              </>
            ) : (
              <>
                <div className="w-7 h-7 rounded-lg bg-[#E63B30]/20 text-[#E63B30] flex items-center justify-center">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-['Oswald'] text-base font-bold uppercase text-white">
                    Full Student Registration Form
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    Collects full student details (name, emergency contacts, medicals, experience) + fees
                  </p>
                </div>
              </>
            )}
          </div>

          <form onSubmit={handleGenerate} className="space-y-4">
            {/* Amount & Presets */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                  Fee Amount (₹ INR) *
                </label>
                <span className={`text-xs font-mono font-bold ${generatorMode === 'quick' ? 'text-amber-400' : 'text-[#E63B30]'}`}>
                  ₹{Number(amount || 0).toLocaleString('en-IN')}
                </span>
              </div>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 font-bold text-base font-mono">
                  ₹
                </span>
                <input
                  type="number"
                  required
                  min="1"
                  step="1"
                  value={amount || ''}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  placeholder="1500"
                  className="w-full pl-9 pr-4 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-base font-bold text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                />
              </div>

              {/* Quick Amount Chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(generatorMode === 'quick' ? quickAmountPresets : fullAmountPresets).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setAmount(preset)}
                    className={`px-2 py-1 text-[11px] rounded-lg font-mono font-medium transition-all cursor-pointer ${
                      amount === preset
                        ? generatorMode === 'quick'
                          ? 'bg-amber-500 text-black font-bold'
                          : 'bg-[#E63B30] text-white'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-300 border border-white/10'
                    }`}
                  >
                    ₹{preset.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
            </div>

            {/* Program / Payment Purpose */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                {generatorMode === 'quick' ? 'Payment Purpose / Note *' : 'Program Title *'}
              </label>
              <input
                type="text"
                required
                value={programTitle}
                onChange={(e) => setProgramTitle(e.target.value)}
                placeholder={generatorMode === 'quick' ? 'e.g. Drop-in Training Pass' : 'e.g. Brazilian Jiu-Jitsu (Monthly Unlimited)'}
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
              />

              {/* Quick Preset Chips */}
              <div className="mt-2 flex flex-wrap gap-1.5">
                {(generatorMode === 'quick' ? quickPurposePresets : programPresets).map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setProgramTitle(preset)}
                    className={`px-2 py-1 text-[11px] rounded-lg transition-all text-left cursor-pointer ${
                      programTitle === preset
                        ? 'bg-white/20 text-white border border-white/40 font-semibold'
                        : 'bg-white/5 hover:bg-white/10 text-neutral-400 border border-white/10'
                    }`}
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* UPI ID & Payee Name */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                  Payee UPI ID *
                </label>
                <input
                  type="text"
                  required
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="mmatrainers@upi"
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                />
              </div>

              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                  Business / Payee Name
                </label>
                <input
                  type="text"
                  value={payeeName}
                  onChange={(e) => setPayeeName(e.target.value)}
                  placeholder="MMA Trainers Academy"
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                />
              </div>
            </div>

            {/* Academy WhatsApp Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                  Academy WhatsApp (For Payment Screenshots) *
                </label>
                {isValidIndianMobile(whatsappNumber) && (
                  <span className="text-[10px] font-mono text-emerald-400 font-bold">
                    ✓ Valid
                  </span>
                )}
              </div>
              <div className="flex items-center rounded-xl border border-white/15 bg-[#0D0D0D] focus-within:border-[#E63B30] transition-colors overflow-hidden">
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
                  value={whatsappNumber}
                  onChange={(e) => {
                    const cleaned = cleanIndianMobileInput(e.target.value);
                    setWhatsappNumber(cleaned);
                    if (cleaned.length === 10) {
                      localStorage.setItem('mma_admin_default_phone_v1', `91${cleaned}`);
                    }
                  }}
                  placeholder="9876543210"
                  className="flex-1 px-3 py-2.5 bg-transparent text-xs text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                />
              </div>
            </div>

            {/* Full Registration Only Fields */}
            {generatorMode === 'full' && (
              <>
                {/* Razorpay Key ID */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                    Razorpay Key ID (Optional)
                  </label>
                  <input
                    type="text"
                    value={razorpayKeyId}
                    onChange={(e) => setRazorpayKeyId(e.target.value)}
                    placeholder="rzp_test_..."
                    className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                  />
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                    Notes / Terms (Optional)
                  </label>
                  <textarea
                    rows={2}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Includes uniform loaner, locker access..."
                    className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors resize-none"
                  />
                </div>
              </>
            )}

            {/* Quick QR Only Notes */}
            {generatorMode === 'quick' && (
              <div>
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                  Payment Instructions / Note (Optional)
                </label>
                <input
                  type="text"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Valid for open mat sparring this Saturday."
                  className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                />
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              className={`w-full py-3.5 text-white font-bold text-xs uppercase tracking-widest rounded-xl transition-all shadow-lg active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer ${
                generatorMode === 'quick'
                  ? 'bg-amber-500 hover:bg-amber-400 text-black font-extrabold shadow-amber-500/30 hover:shadow-amber-500/50'
                  : 'bg-[#E63B30] hover:bg-[#D32F2F] shadow-[#E63B30]/30 hover:shadow-[#E63B30]/50'
              }`}
            >
              {generatorMode === 'quick' ? (
                <>
                  <Zap className="w-4 h-4 fill-black" />
                  <span>Generate Quick QR Payment Link</span>
                </>
              ) : (
                <>
                  <Link2 className="w-4 h-4" />
                  <span>Generate Student Registration Link</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Right: Output & QR Preview (5 Cols) */}
        <div className="lg:col-span-5 space-y-4">
          {generatedForm ? (
            <div className="bg-[#141414] border-2 border-emerald-500/40 rounded-3xl p-6 shadow-xl relative">
              <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/10">
                <span className="inline-flex items-center gap-1.5 text-emerald-400 font-bold text-xs uppercase tracking-wider">
                  <Check className="w-4 h-4" /> Link Ready
                </span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300">
                  {generatedForm.formType === 'quick' ? '⚡ Quick Pay' : '📝 Full Form'}
                </span>
              </div>

              {/* Shareable Link Box */}
              <div className="bg-[#0D0D0D] border border-white/15 rounded-2xl p-3.5 mb-4">
                <p className="font-mono text-xs text-white break-all bg-white/5 p-2 rounded-lg border border-white/5 select-all mb-3">
                  {getShareableUrl(generatedForm)}
                </p>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopyLink(getShareableUrl(generatedForm))}
                    className="flex-1 py-2.5 px-3 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span className="text-emerald-400">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleWhatsAppShare(generatedForm)}
                    className="flex-1 py-2.5 px-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/20 cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Send on WhatsApp</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => onPreviewForm(generatedForm.id)}
                  className="w-full mt-2.5 py-1.5 text-center text-xs text-neutral-400 hover:text-white flex items-center justify-center gap-1 hover:underline cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Client Page</span>
                </button>
              </div>

              {/* Live QR Preview */}
              <div className="text-center pt-1">
                <UpiQrCode
                  upiId={generatedForm.upiId}
                  payeeName={generatedForm.payeeName}
                  amount={generatedForm.amount}
                  note={generatedForm.programTitle}
                  size={160}
                  showDirectPayButton={false}
                />
              </div>
            </div>
          ) : (
            <div className="bg-[#141414] border border-white/10 rounded-3xl p-6 shadow-xl text-center">
              <div className="py-2 opacity-80">
                <UpiQrCode
                  upiId={upiId || 'mmatrainers@upi'}
                  payeeName={payeeName || 'MMA Trainers Academy'}
                  amount={amount || 1500}
                  note={programTitle}
                  size={160}
                  showDirectPayButton={false}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
