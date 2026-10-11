import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  ShieldCheck,
  MessageSquare,
  ArrowLeft,
  CheckCircle2,
  Copy,
  Check,
  ExternalLink,
  Lock,
  Upload,
  AlertCircle,
  Zap,
  Image as ImageIcon,
  X,
  Loader2,
} from 'lucide-react';
import { RaiLogo } from '../RaiLogo';
import { UpiQrCode } from './UpiQrCode';
import { formStorage } from '../../services/formStorage';
import { PaymentFormConfig, ClientSubmission } from '../../types/admin';
import {
  formatWhatsAppLink,
  formatDisplayIndianPhone,
  isValidIndianMobile,
  cleanIndianMobileInput,
} from '../../lib/phoneUtils';
import { uploadPaymentProof } from '../../lib/storageUtils';

interface QuickPayPageProps {
  formId?: string;
  onBackToHome?: () => void;
  onOpenAdmin?: () => void;
}

export const QuickPayPage: React.FC<QuickPayPageProps> = ({
  formId,
  onBackToHome,
  onOpenAdmin,
}) => {
  const [formConfig, setFormConfig] = useState<PaymentFormConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Screenshot & Proof Submission State
  const [payerName, setPayerName] = useState('');
  const [payerPhone, setPayerPhone] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotPreview, setScreenshotPreview] = useState<string | null>(null);
  const [submittingProof, setSubmittingProof] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [proofSubmitted, setProofSubmitted] = useState<ClientSubmission | null>(null);
  const [proofError, setProofError] = useState('');
  const [isDragging, setIsDragging] = useState(false);

  // Load Form Config
  useEffect(() => {
    let isMounted = true;
    const params = new URLSearchParams(window.location.search);
    const idToLoad =
      formId ||
      params.get('quick') ||
      params.get('form') ||
      (window.location.hash.startsWith('#/pay/')
        ? window.location.hash.replace('#/pay/', '')
        : null);

    const loadForm = async () => {
      setLoading(true);

      if (idToLoad) {
        // Fetch specific form: checks local cache first, then fetches directly from Supabase
        const found = await formStorage.getFormByIdAsync(idToLoad);
        if (isMounted) {
          if (found) {
            setFormConfig(found);
            if (found.clientName) {
              setPayerName(found.clientName);
            }
          } else {
            // NEVER silently fall back to wrong form when an explicit form ID is in the URL!
            setFormConfig(null);
          }
          setLoading(false);
        }
        return;
      }

      // No ID specified in URL: load first quick form
      const forms = formStorage.getForms();
      if (isMounted) {
        const found = forms.find((f) => f.formType === 'quick') || forms[0] || null;
        setFormConfig(found);
        setLoading(false);
      }
    };

    loadForm();

    const unsubscribe = formStorage.subscribeToUpdates(() => {
      if (idToLoad) {
        const updated = formStorage.getFormById(idToLoad);
        if (updated && isMounted) {
          setFormConfig(updated);
        }
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [formId]);

  // Handle Screenshot File Selection
  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) {
      setProofError('Screenshot file size must be less than 10MB.');
      return;
    }
    setProofError('');
    setScreenshotFile(file);
    const previewUrl = URL.createObjectURL(file);
    setScreenshotPreview(previewUrl);
  };

  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleRemoveScreenshot = () => {
    setScreenshotFile(null);
    if (screenshotPreview) {
      URL.revokeObjectURL(screenshotPreview);
    }
    setScreenshotPreview(null);
  };

  // Build WhatsApp Submission Link
  const getWhatsAppSubmissionUrl = () => {
    if (!formConfig) return '#';
    const amountStr = Number(formConfig.amount || 0).toLocaleString('en-IN');
    const nameLine = payerName.trim()
      ? `• Student / Payer: ${payerName.trim()}\n`
      : formConfig.clientName
      ? `• Student / Payer: ${formConfig.clientName}\n`
      : '';
    const utrLine = utrNumber.trim() ? `• UTR / Ref No: ${utrNumber.trim()}\n` : '';
    const refLine = proofSubmitted ? `• Ref ID: ${proofSubmitted.id}\n` : '';

    const text =
      `Hi Coach! 👋\n` +
      `I have completed the payment of *₹${amountStr}* for *${formConfig.programTitle}*.\n\n` +
      nameLine +
      utrLine +
      refLine +
      (proofSubmitted?.screenshotUrl
        ? `• Payment Screenshot: Uploaded & attached 📸\n\n`
        : `• Payment Screenshot: Attached below 📸\n\n`) +
      `Please verify and confirm my receipt!`;

    return formatWhatsAppLink(formConfig.whatsappNumber, text);
  };

  // Handle Screenshot Upload to Supabase Storage & Database Sync
  const handleSubmitScreenshotProof = async (e: React.FormEvent) => {
    e.preventDefault();
    setProofError('');

    if (!formConfig) return;

    if (!screenshotFile) {
      setProofError('Please choose or drag your payment screenshot image before submitting.');
      return;
    }

    if (payerPhone.trim() && !isValidIndianMobile(payerPhone)) {
      setProofError('Please enter a valid 10-digit Indian WhatsApp mobile number.');
      return;
    }

    setSubmittingProof(true);
    setUploadProgress('Uploading payment proof...');

    try {
      // 1. Upload to Supabase Storage 'proofs' bucket
      const uploadRes = await uploadPaymentProof(screenshotFile, 'quickpay');

      let finalUrl = '';
      if (uploadRes.success && uploadRes.publicUrl) {
        finalUrl = uploadRes.publicUrl;
      } else {
        console.warn('Storage upload note:', uploadRes.error);
        // Fallback to local DataURL if offline or storage blocked
        const reader = new FileReader();
        finalUrl = await new Promise<string>((resolve) => {
          reader.onloadend = () => resolve((reader.result as string) || '');
          reader.readAsDataURL(screenshotFile);
        });
      }

      setUploadProgress('Confirming payment details...');

      // 2. Save submission to Supabase database & local cache
      const submission = formStorage.saveSubmission({
        formId: formConfig.id,
        programTitle: formConfig.programTitle,
        amount: formConfig.amount,
        upiId: formConfig.upiId,
        fullName: payerName.trim() || formConfig.clientName || 'Quick Pay Client',
        phone: payerPhone.trim() ? `+91${cleanIndianMobileInput(payerPhone)}` : '+919999999999',
        email: 'quickpay@mmatrainers.com',
        paymentMethod: 'upi',
        utrNumber: utrNumber.trim() || undefined,
        screenshotUrl: finalUrl || undefined,
        screenshotFileName: screenshotFile.name,
        status: 'pending',
        adminNotes: 'Submitted via Quick Pay Portal with payment screenshot.',
      });

      setProofSubmitted(submission);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      console.error('Proof submission error:', err);
      setProofError('Upload encountered an issue. You can still message our coach directly on WhatsApp.');
    } finally {
      setSubmittingProof(false);
      setUploadProgress('');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#E63B30] border-t-transparent rounded-full animate-spin" />
          <p className="font-mono text-xs uppercase tracking-widest text-neutral-400">
            Loading Payment Portal...
          </p>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-4">
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-8 max-w-md w-full text-center">
          <AlertCircle className="w-12 h-12 text-[#E63B30] mx-auto mb-4" />
          <h2 className="font-['Oswald'] text-2xl font-bold uppercase mb-2">
            Payment Link Not Found
          </h2>
          <p className="text-neutral-400 text-xs mb-6">
            This payment request link is invalid or has expired. Please request a fresh payment QR from the academy.
          </p>
          {onBackToHome && (
            <button
              onClick={onBackToHome}
              className="px-6 py-2.5 bg-[#E63B30] text-white font-bold text-xs uppercase tracking-wider rounded-xl cursor-pointer"
            >
              Back to Home
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F5] font-['Plus_Jakarta_Sans'] selection:bg-[#E63B30] selection:text-white flex flex-col justify-between relative overflow-hidden">
      {/* Background Accent Gradients */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-[#E63B30]/10 blur-[130px] rounded-full pointer-events-none" />
      <div className="fixed bottom-0 right-0 w-[400px] h-[300px] bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/90 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
                title="Back to Website"
              >
                <ArrowLeft className="w-4 h-4" />
                <span className="hidden sm:inline">Website</span>
              </button>
            )}
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <RaiLogo theme="dark" />
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[11px] font-mono font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Verified UPI Payment</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Payment Section */}
      <main className="flex-1 max-w-xl mx-auto w-full px-4 py-8 sm:py-12 flex flex-col justify-center">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 relative overflow-hidden backdrop-blur-xl"
        >
          {/* Top Decorative Edge */}
          <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#E63B30] via-amber-500 to-emerald-500" />

          {/* Badge & Program Header */}
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-neutral-300 text-[11px] font-mono font-semibold uppercase tracking-wider mb-2.5">
              <Zap className="w-3 h-3 text-amber-400" />
              <span>Instant UPI Checkout</span>
            </div>

            <h1 className="font-['Oswald'] text-2xl sm:text-3xl font-bold uppercase text-white tracking-wide">
              {formConfig.programTitle}
            </h1>

            {formConfig.clientName && (
              <p className="mt-1 text-xs text-neutral-400 font-medium">
                For: <span className="text-white font-semibold">{formConfig.clientName}</span>
              </p>
            )}

            {formConfig.notes && (
              <p className="mt-1.5 text-[11px] text-neutral-400 max-w-xs mx-auto leading-relaxed">
                {formConfig.notes}
              </p>
            )}
          </div>

          {/* Amount Display */}
          <div className="bg-[#0D0D0D] border border-white/15 rounded-2xl p-4 text-center mb-6 relative overflow-hidden">
            <span className="text-[10px] font-mono uppercase tracking-widest text-neutral-400 font-bold block mb-1">
              Total Amount Payable
            </span>
            <div className="flex items-center justify-center gap-1">
              <span className="font-mono text-xl sm:text-2xl text-[#E63B30] font-bold">₹</span>
              <span className="font-['Oswald'] text-4xl sm:text-5xl font-black text-white tracking-tight">
                {Number(formConfig.amount || 0).toLocaleString('en-IN')}
              </span>
            </div>
            <p className="text-[10px] text-neutral-500 font-mono mt-1">
              Zero platform surcharge • Direct to academy bank
            </p>
          </div>

          {/* Step 1: Dynamic UPI QR Code */}
          <div className="mb-6 flex flex-col items-center">
            <div className="text-center mb-3">
              <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold">
                Step 1: Scan & Pay with any UPI App
              </span>
            </div>
            <UpiQrCode
              upiId={formConfig.upiId}
              payeeName={formConfig.payeeName}
              amount={formConfig.amount}
              note={formConfig.programTitle}
              size={210}
              showDirectPayButton={true}
            />
          </div>

          {/* Step 2: Upload Screenshot Section */}
          <div className="pt-6 border-t border-white/10">
            {/* If Proof is Already Submitted */}
            {proofSubmitted ? (
              <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-center animate-in fade-in space-y-4">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
                <div>
                  <h3 className="font-['Oswald'] text-xl font-bold uppercase text-white tracking-wide">
                    Payment Screenshot Uploaded!
                  </h3>
                  <p className="text-xs text-neutral-300 mt-1">
                    Your proof has been saved to academy records. Our coach will verify and activate your spot.
                  </p>
                </div>

                <div className="bg-[#0D0D0D] p-3 rounded-xl border border-white/10 text-left text-xs font-mono space-y-1">
                  <div className="flex justify-between text-neutral-400">
                    <span>Reference ID:</span>
                    <span className="text-emerald-400 font-bold">{proofSubmitted.id}</span>
                  </div>
                  <div className="flex justify-between text-neutral-400">
                    <span>Amount:</span>
                    <span className="text-white font-bold">₹{proofSubmitted.amount}</span>
                  </div>
                  {proofSubmitted.screenshotUrl && (
                    <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                      <span className="text-[10px] text-neutral-400">Attached Receipt:</span>
                      <a
                        href={proofSubmitted.screenshotUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-[11px] text-[#E63B30] hover:underline flex items-center gap-1 font-sans"
                      >
                        <ImageIcon className="w-3.5 h-3.5" />
                        <span>View Receipt ↗</span>
                      </a>
                    </div>
                  )}
                </div>

                <a
                  href={getWhatsAppSubmissionUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/30 cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4 fill-white" />
                  <span>Notify Coach on WhatsApp</span>
                </a>
              </div>
            ) : (
              /* Upload Form */
              <form onSubmit={handleSubmitScreenshotProof} className="space-y-4">
                <div className="text-center">
                  <span className="text-[11px] font-mono uppercase tracking-wider text-amber-400 font-bold block mb-1">
                    Step 2: Upload Payment Screenshot (SS)
                  </span>
                  <p className="text-xs text-neutral-400">
                    Take a screenshot in your UPI app and drop it below for instant verification.
                  </p>
                </div>

                {proofError && (
                  <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{proofError}</span>
                  </div>
                )}

                {/* Screenshot Upload Dropzone */}
                <div>
                  {screenshotPreview ? (
                    <div className="relative p-3.5 bg-[#0D0D0D] border-2 border-emerald-500/40 rounded-2xl flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <img
                          src={screenshotPreview}
                          alt="Screenshot preview"
                          className="w-14 h-14 object-cover rounded-xl border border-white/10 shrink-0 bg-black"
                        />
                        <div className="overflow-hidden">
                          <span className="block text-xs font-semibold text-white truncate">
                            {screenshotFile?.name}
                          </span>
                          <span className="text-[10px] text-neutral-400 font-mono block">
                            {screenshotFile ? `${(screenshotFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                          </span>
                          <span className="text-[10px] text-emerald-400 font-medium flex items-center gap-1 mt-0.5">
                            <CheckCircle2 className="w-3 h-3" /> Ready to submit
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleRemoveScreenshot}
                        className="p-2 text-neutral-400 hover:text-red-400 hover:bg-white/5 rounded-xl transition-colors cursor-pointer"
                        title="Remove screenshot"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <label
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all text-center ${
                        isDragging
                          ? 'border-[#E63B30] bg-[#E63B30]/10'
                          : 'border-white/20 hover:border-[#E63B30]/60 bg-[#0D0D0D]/60 hover:bg-[#0D0D0D]'
                      }`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-2.5 text-[#E63B30]">
                        <Upload className="w-6 h-6" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider text-white mb-1">
                        Tap or Drag to Upload Screenshot
                      </span>
                      <span className="text-[11px] text-neutral-400">
                        PNG, JPG, or WebP from your gallery/UPI app (up to 10MB)
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleScreenshotChange}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Optional Payer Info Inputs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      Student / Payer Name
                    </label>
                    <input
                      type="text"
                      value={payerName}
                      onChange={(e) => setPayerName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                      WhatsApp Number
                    </label>
                    <div className="flex items-center rounded-xl border border-white/15 bg-[#0D0D0D] focus-within:border-[#E63B30] overflow-hidden">
                      <span className="px-2.5 py-2.5 text-xs font-mono font-bold text-neutral-400 border-r border-white/10">
                        +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={payerPhone}
                        onChange={(e) => setPayerPhone(cleanIndianMobileInput(e.target.value))}
                        placeholder="9876543210"
                        className="flex-1 px-3 py-2.5 bg-transparent text-xs text-white font-mono placeholder-neutral-500 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-mono uppercase tracking-wider text-neutral-400 mb-1">
                    UPI UTR / Ref No. (Optional 12 Digits)
                  </label>
                  <input
                    type="text"
                    value={utrNumber}
                    onChange={(e) => setUtrNumber(e.target.value)}
                    placeholder="e.g. 428910394821 or Transaction ID"
                    className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                  />
                </div>

                {/* Submit Screenshot Button */}
                <button
                  type="submit"
                  disabled={submittingProof || !screenshotFile}
                  className="w-full py-3.5 px-6 bg-gradient-to-r from-[#E63B30] via-[#D32F2F] to-[#B71C1C] hover:from-[#D32F2F] hover:to-[#991B1B] disabled:opacity-40 disabled:cursor-not-allowed text-white rounded-2xl text-xs sm:text-sm font-bold uppercase tracking-wider transition-all shadow-xl shadow-[#E63B30]/25 hover:shadow-[#E63B30]/40 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer border border-[#E63B30]/40"
                >
                  {submittingProof ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>{uploadProgress || 'Uploading...'}</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4" />
                      <span>Submit Payment Screenshot</span>
                    </>
                  )}
                </button>

                {/* Secondary WhatsApp Fallback */}
                <div className="pt-2 text-center">
                  <a
                    href={getWhatsAppSubmissionUrl()}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-400 hover:text-emerald-400 transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Or send screenshot directly on WhatsApp ↗</span>
                  </a>
                </div>
              </form>
            )}
          </div>
        </motion.div>

        {/* Security & Support Guarantee */}
        <div className="mt-6 text-center space-y-2">
          <div className="flex items-center justify-center gap-3 text-xs text-neutral-500 font-mono">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>Official Merchant</span>
            </span>
            <span>•</span>
            <span>256-bit SSL Encrypted</span>
            <span>•</span>
            <span>Instant Verification</span>
          </div>
          <p className="text-[11px] text-neutral-500">
            Assistance or queries? Call or WhatsApp{' '}
            <span className="text-neutral-300 font-mono">
              +{formConfig.whatsappNumber}
            </span>
          </p>
        </div>
      </main>

      {/* Minimal Footer */}
      <footer className="py-4 text-center text-[11px] text-neutral-600 border-t border-white/5">
        <span>© {new Date().getFullYear()} MMA Trainers Academy. All rights reserved.</span>
      </footer>
    </div>
  );
};
