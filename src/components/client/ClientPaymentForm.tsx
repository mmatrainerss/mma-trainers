import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Shield,
  MessageSquare,
  AlertTriangle,
  CheckCircle2,
  Upload,
  ArrowLeft,
  Lock,
  Clock,
  Sparkles,
  Phone,
  FileCheck,
  X,
  CreditCard,
  QrCode,
  ShieldCheck,
  ExternalLink,
} from 'lucide-react';
import { RaiLogo } from '../RaiLogo';
import { UpiQrCode } from './UpiQrCode';
import { formStorage } from '../../services/formStorage';
import { openRazorpayPayment } from '../../services/razorpay';
import { PaymentFormConfig, ClientSubmission } from '../../types/admin';
import {
  cleanIndianMobileInput,
  isValidIndianMobile,
  formatWhatsAppLink,
  formatDisplayIndianPhone,
  formatPhoneForStorage,
} from '../../lib/phoneUtils';
import { uploadPaymentProof } from '../../lib/storageUtils';

interface ClientPaymentFormProps {
  formId?: string;
  onBackToHome?: () => void;
  onOpenAdmin?: () => void;
}

export const ClientPaymentForm: React.FC<ClientPaymentFormProps> = ({
  formId,
  onBackToHome,
  onOpenAdmin,
}) => {
  const [formConfig, setFormConfig] = useState<PaymentFormConfig | null>(null);
  const [loading, setLoading] = useState(true);

  // Active Payment Method Tab: 'razorpay' | 'upi_qr'
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi_qr'>('razorpay');

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('Male');
  const [emergencyContactName, setEmergencyContactName] = useState('');
  const [emergencyContactPhone, setEmergencyContactPhone] = useState('');
  const [experienceLevel, setExperienceLevel] = useState('No Experience');
  const [fitnessGoals, setFitnessGoals] = useState('');
  const [medicalConditions, setMedicalConditions] = useState('');
  const [utrNumber, setUtrNumber] = useState('');
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotData, setScreenshotData] = useState<string | null>(null);
  const [screenshotFileName, setScreenshotFileName] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Submission State
  const [submitting, setSubmitting] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState<ClientSubmission | null>(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Load Form Config
  useEffect(() => {
    let isMounted = true;
    const idToLoad =
      formId ||
      new URLSearchParams(window.location.search).get('form') ||
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
              setFullName(found.clientName);
            }
          } else {
            // If the requested form ID is not found in database, do NOT silently fall back to a random form!
            setFormConfig(null);
          }
          setLoading(false);
        }
        return;
      }

      // No specific form ID requested: load generic default form
      const forms = formStorage.getForms();
      if (isMounted) {
        if (forms.length > 0) {
          setFormConfig(forms[0]);
        }
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

  // Handle Screenshot Upload
  const handleScreenshotChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        setErrorMessage('Screenshot file size should be less than 10MB.');
        return;
      }
      setScreenshotFile(file);
      setScreenshotFileName(file.name);
      const reader = new FileReader();
      reader.onloadend = () => {
        setScreenshotData(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Generate WhatsApp Direct link
  const getWhatsAppLink = (customMsg?: string) => {
    if (!formConfig) return '#';
    const clientGreeting = fullName.trim() ? `Client: ${fullName.trim()}` : 'New Registration';
    const displayPhone = phone.trim() ? formatDisplayIndianPhone(phone) : 'N/A';
    const message =
      customMsg ||
      `Hello MMA Trainers! I am submitting my payment for "${formConfig.programTitle}".\n` +
        `• Amount: ₹${formConfig.amount}\n` +
        `• ${clientGreeting}\n` +
        `• WhatsApp/Phone: ${displayPhone}\n` +
        `• Payment Ref: ${utrNumber.trim() || 'Screenshot attached'}\n\n` +
        `Please find my payment screenshot attached!`;
    return formatWhatsAppLink(formConfig.whatsappNumber, message);
  };

  // Trigger Razorpay Payment Checkout
  const handleRazorpayCheckout = () => {
    setErrorMessage('');

    if (!formConfig) return;

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Please fill in your Full Name, Phone, and Email address above before proceeding with Razorpay payment.');
      return;
    }

    if (!isValidIndianMobile(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian WhatsApp mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (emergencyContactPhone.trim() && !isValidIndianMobile(emergencyContactPhone)) {
      setErrorMessage('Emergency contact phone must be a valid 10-digit Indian mobile number.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the MMA Academy Rules and Safety Waiver checkbox below.');
      return;
    }

    setSubmitting(true);

    openRazorpayPayment({
      key: formConfig.razorpayKeyId,
      amount: formConfig.amount,
      name: formConfig.payeeName,
      description: formConfig.programTitle,
      prefill: {
        name: fullName.trim(),
        email: email.trim(),
        contact: `91${cleanIndianMobileInput(phone)}`,
      },
      onSuccess: (response) => {
        try {
          const newSubmission = formStorage.saveSubmission({
            formId: formConfig.id,
            programTitle: formConfig.programTitle,
            amount: formConfig.amount,
            upiId: formConfig.upiId,
            fullName: fullName.trim(),
            phone: formatPhoneForStorage(phone),
            email: email.trim(),
            age: age.trim(),
            gender,
            emergencyContactName: emergencyContactName.trim(),
            emergencyContactPhone: emergencyContactPhone.trim() ? formatPhoneForStorage(emergencyContactPhone) : undefined,
            experienceLevel,
            fitnessGoals: fitnessGoals.trim(),
            medicalConditions: medicalConditions.trim(),
            paymentMethod: 'razorpay',
            razorpayPaymentId: response.razorpay_payment_id,
            razorpayOrderId: response.razorpay_order_id,
            razorpaySignature: response.razorpay_signature,
            status: 'verified',
          });

          setSubmissionSuccess(newSubmission);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (err) {
          console.error(err);
          setErrorMessage('Payment received, but error occurred saving details. Please contact gym support.');
        } finally {
          setSubmitting(false);
        }
      },
      onDismiss: () => {
        setSubmitting(false);
      },
      onError: (err) => {
        setSubmitting(false);
        setErrorMessage(`Razorpay payment error: ${err?.description || 'Transaction cancelled or failed.'}`);
      },
    });
  };

  // Handle Manual UPI Form Submit
  const handleManualSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formConfig) {
      setErrorMessage('Form configuration is missing.');
      return;
    }

    if (!fullName.trim() || !phone.trim() || !email.trim()) {
      setErrorMessage('Please fill in all mandatory contact information.');
      return;
    }

    if (!isValidIndianMobile(phone)) {
      setErrorMessage('Please enter a valid 10-digit Indian WhatsApp mobile number (starting with 6, 7, 8, or 9).');
      return;
    }

    if (emergencyContactPhone.trim() && !isValidIndianMobile(emergencyContactPhone)) {
      setErrorMessage('Emergency contact phone must be a valid 10-digit Indian mobile number.');
      return;
    }

    if (!agreeTerms) {
      setErrorMessage('Please accept the MMA Academy Rules and Safety Waiver to proceed.');
      return;
    }

    setSubmitting(true);

    try {
      let finalScreenshotUrl = screenshotData || undefined;
      if (screenshotFile) {
        try {
          const uploadRes = await uploadPaymentProof(screenshotFile, 'registration');
          if (uploadRes.success && uploadRes.publicUrl) {
            finalScreenshotUrl = uploadRes.publicUrl;
          }
        } catch (storageErr) {
          console.warn('Supabase storage upload note:', storageErr);
        }
      }

      const newSubmission = formStorage.saveSubmission({
        formId: formConfig.id,
        programTitle: formConfig.programTitle,
        amount: formConfig.amount,
        upiId: formConfig.upiId,
        fullName: fullName.trim(),
        phone: formatPhoneForStorage(phone),
        email: email.trim(),
        age: age.trim(),
        gender,
        emergencyContactName: emergencyContactName.trim(),
        emergencyContactPhone: emergencyContactPhone.trim() ? formatPhoneForStorage(emergencyContactPhone) : undefined,
        experienceLevel,
        fitnessGoals: fitnessGoals.trim(),
        medicalConditions: medicalConditions.trim(),
        utrNumber: utrNumber.trim(),
        screenshotUrl: finalScreenshotUrl,
        screenshotFileName: screenshotFileName || undefined,
        paymentMethod: 'upi',
        status: 'pending',
      });

      setSubmissionSuccess(newSubmission);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to save details. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] flex items-center justify-center text-white">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#E63B30] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-sm font-mono text-neutral-400">Loading Registration Portal...</p>
        </div>
      </div>
    );
  }

  if (!formConfig) {
    return (
      <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-[#141414] border border-white/10 rounded-2xl p-8 text-center shadow-2xl">
          <AlertTriangle className="w-12 h-12 text-[#E63B30] mx-auto mb-4" />
          <h2 className="text-2xl font-['Oswald'] font-bold uppercase mb-2">Form Not Found</h2>
          <p className="text-sm text-neutral-400 mb-6">
            The requested registration link is unavailable or expired. Please contact the MMA academy staff.
          </p>
          <div className="flex gap-3 justify-center">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase rounded-xl transition-colors"
              >
                Back to Website
              </button>
            )}
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="px-5 py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white text-xs font-bold uppercase rounded-xl transition-colors"
              >
                Open Admin Panel
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F5] font-['Plus_Jakarta_Sans'] selection:bg-[#E63B30] selection:text-white pb-20">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBackToHome && (
              <button
                onClick={onBackToHome}
                className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors"
                title="Return to main site"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            )}
            <RaiLogo theme="dark" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-full text-xs font-medium">
              <Lock className="w-3 h-3" />
              <span>Official Academy Portal</span>
            </div>
            {onOpenAdmin && (
              <button
                onClick={onOpenAdmin}
                className="text-[11px] font-semibold text-neutral-400 hover:text-white px-2.5 py-1 rounded-lg border border-white/10 hover:border-white/20 transition-colors"
              >
                Admin Switch
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10">
        {/* If successfully submitted */}
        {submissionSuccess ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto bg-[#141414] border border-[#E63B30]/40 rounded-3xl p-6 sm:p-10 shadow-2xl text-center relative overflow-hidden"
          >
            {/* Background Glow */}
            <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#E63B30]/15 rounded-full blur-3xl pointer-events-none" />

            <div className="w-20 h-20 bg-emerald-500/20 border-2 border-emerald-500/60 text-emerald-400 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-emerald-500/20">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block px-3 py-1 bg-[#E63B30]/20 text-[#E63B30] border border-[#E63B30]/40 rounded-full text-xs font-bold uppercase tracking-widest mb-3">
              Registration Saved to Supabase Database
            </span>

            <h1 className="text-3xl sm:text-4xl font-['Oswald'] font-black uppercase tracking-tight text-white mb-3">
              Welcome to MMA Trainers!
            </h1>

            <p className="text-neutral-300 text-sm sm:text-base leading-relaxed max-w-lg mx-auto mb-8">
              Thank you, <span className="font-semibold text-white">{submissionSuccess.fullName}</span>! Your registration details have been logged in the academy cloud database under reference{' '}
              <span className="font-mono text-[#E63B30] font-bold">{submissionSuccess.id}</span>.
            </p>

            {/* Receipt Summary Card */}
            <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-5 text-left mb-8 space-y-2.5 text-xs sm:text-sm">
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-neutral-400">Program / Plan:</span>
                <span className="font-semibold text-white">{submissionSuccess.programTitle}</span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-neutral-400">Total Fee:</span>
                <span className="font-black text-[#E63B30] font-mono text-base">
                  ₹{submissionSuccess.amount.toLocaleString('en-IN')}
                </span>
              </div>
              <div className="flex justify-between pb-2 border-b border-white/5">
                <span className="text-neutral-400">Payment Gateway:</span>
                <span className="font-semibold text-white uppercase">
                  {submissionSuccess.paymentMethod === 'razorpay' ? 'Razorpay Secure Checkout' : 'Direct UPI Transfer'}
                </span>
              </div>
              {submissionSuccess.razorpayPaymentId && (
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-neutral-400">Razorpay Payment ID:</span>
                  <span className="font-mono text-emerald-400 font-bold">{submissionSuccess.razorpayPaymentId}</span>
                </div>
              )}
              {submissionSuccess.utrNumber && (
                <div className="flex justify-between pb-2 border-b border-white/5">
                  <span className="text-neutral-400">UTR / Ref:</span>
                  <span className="font-mono text-neutral-300">{submissionSuccess.utrNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-neutral-400">Status:</span>
                <span className={`inline-flex items-center gap-1 font-bold ${
                  submissionSuccess.status === 'verified' ? 'text-emerald-400' : 'text-amber-400'
                }`}>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  {submissionSuccess.status === 'verified' ? 'Payment Verified & Confirmed' : 'Pending Verification'}
                </span>
              </div>
            </div>

            {/* MANDATORY ACTION BUTTON: Send WhatsApp Screenshot / Confirmation */}
            <div className="bg-[#1C1710] border border-amber-500/40 rounded-2xl p-5 mb-8 text-left">
              <div className="flex items-start gap-3">
                <MessageSquare className="w-6 h-6 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-['Oswald'] text-base uppercase text-white font-bold tracking-wide">
                    Next Step: Confirm on WhatsApp
                  </h4>
                  <p className="text-xs text-neutral-300 mt-1 leading-relaxed">
                    Click the button below to message our head coach on WhatsApp with your registration receipt so we can assign your batch and uniform loaner immediately.
                  </p>
                </div>
              </div>

              <a
                href={getWhatsAppLink(
                  `Hi MMA Trainers! I have completed my registration for ${submissionSuccess.programTitle} (Ref: ${submissionSuccess.id}).\n` +
                  `Amount: ₹${submissionSuccess.amount}\n` +
                  (submissionSuccess.razorpayPaymentId ? `Razorpay ID: ${submissionSuccess.razorpayPaymentId}\n` : '') +
                  `Name: ${submissionSuccess.fullName}\n` +
                  `Looking forward to starting classes!`
                )}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2 active:scale-[0.99]"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Confirm with Head Coach on WhatsApp</span>
              </a>
            </div>

            {/* Return Actions */}
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {onBackToHome && (
                <button
                  type="button"
                  onClick={onBackToHome}
                  className="px-6 py-3 bg-white/10 hover:bg-white/15 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
                >
                  Return to Academy Homepage
                </button>
              )}
              <button
                type="button"
                onClick={() => setSubmissionSuccess(null)}
                className="px-6 py-3 border border-white/20 hover:border-white/40 text-neutral-300 hover:text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-colors"
              >
                Submit Another Form
              </button>
            </div>
          </motion.div>
        ) : (
          /* Main 2-Column Payment & Form Layout */
          <div>
            {/* Top Page Heading */}
            <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
              <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 mb-3">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Razorpay Secured • Official Registration Portal</span>
              </div>
              <h1 className="font-['Oswald'] text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight mb-3">
                {formConfig.programTitle}
              </h1>
              {formConfig.notes && (
                <p className="text-neutral-400 text-xs sm:text-sm leading-relaxed max-w-xl mx-auto">
                  {formConfig.notes}
                </p>
              )}
            </div>

            {/* URGENT NOTIFICATION BANNER REQUESTED BY USER */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-8 rounded-2xl bg-gradient-to-r from-[#E63B30]/20 via-[#1F1414] to-[#E63B30]/20 border-2 border-[#E63B30] p-4 sm:p-5 shadow-2xl shadow-[#E63B30]/20 relative overflow-hidden"
            >
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#E63B30] text-white flex items-center justify-center shrink-0 shadow-lg shadow-[#E63B30]/40">
                    <MessageSquare className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-['Oswald'] text-base sm:text-lg font-bold uppercase tracking-wide text-white flex items-center gap-2">
                      <span>Important Payment Notice</span>
                      <span className="animate-pulse w-2.5 h-2.5 rounded-full bg-[#E63B30]" />
                    </h3>
                    <p className="text-xs sm:text-sm text-neutral-200 mt-0.5 leading-relaxed">
                      Please <strong className="text-white">pay ₹{formConfig.amount.toLocaleString('en-IN')}</strong> via <strong className="text-emerald-400">Razorpay</strong> or UPI QR, and send your payment screenshot on WhatsApp to confirm your slot!
                    </p>
                  </div>
                </div>

                <a
                  href={getWhatsAppLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full md:w-auto shrink-0 inline-flex items-center justify-center gap-2 px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-emerald-600/30 active:scale-95 whitespace-nowrap"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Send Screenshot on WhatsApp</span>
                </a>
              </div>
            </motion.div>

            {/* Two Column Layout: Left Column = Payment Gateway, Right Column = Registration Details */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Razorpay & UPI Gateway (5 Cols) */}
              <div className="lg:col-span-5 space-y-6">
                <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
                  {/* Total Fee Header */}
                  <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block">
                        TOTAL REGISTRATION FEE
                      </span>
                      <span className="font-['Oswald'] text-3xl sm:text-4xl font-black text-[#E63B30]">
                        ₹{formConfig.amount.toLocaleString('en-IN')}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-[10px] uppercase tracking-wider text-neutral-400 font-mono block">
                        PAYEE
                      </span>
                      <span className="inline-block px-2.5 py-0.5 rounded bg-white/10 text-white text-xs font-semibold">
                        {formConfig.payeeName}
                      </span>
                    </div>
                  </div>

                  {/* Payment Method Switcher Tabs */}
                  <div className="flex items-center p-1 bg-[#0D0D0D] rounded-xl border border-white/10 mb-5">
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('razorpay')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'razorpay'
                          ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <CreditCard className="w-3.5 h-3.5" />
                      <span>Razorpay Pay</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('upi_qr')}
                      className={`flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 ${
                        paymentMethod === 'upi_qr'
                          ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                          : 'text-neutral-400 hover:text-white'
                      }`}
                    >
                      <QrCode className="w-3.5 h-3.5" />
                      <span>UPI QR Code</span>
                    </button>
                  </div>

                  {/* Tab 1: Razorpay Option */}
                  {paymentMethod === 'razorpay' && (
                    <div className="space-y-4">
                      <div className="p-4 bg-[#0D0D0D] border border-emerald-500/30 rounded-2xl">
                        <div className="flex items-center gap-2 mb-2">
                          <ShieldCheck className="w-5 h-5 text-emerald-400" />
                          <h4 className="font-['Oswald'] text-sm uppercase text-white font-bold">
                            Razorpay Instant Payment Gateway
                          </h4>
                        </div>
                        <p className="text-xs text-neutral-300 leading-relaxed">
                          Pay securely using any UPI app (GPay, PhonePe, Paytm), Debit/Credit Cards, or NetBanking. Instant verification and automatic receipt generation.
                        </p>

                        <div className="mt-3 flex items-center gap-2 flex-wrap text-[10px] text-neutral-400 font-mono">
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-200">UPI / QR</span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-200">Google Pay</span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-200">PhonePe</span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-200">Cards</span>
                          <span className="px-2 py-0.5 bg-white/5 border border-white/10 rounded text-neutral-200">NetBanking</span>
                        </div>
                      </div>

                      {/* Razorpay Launch Button */}
                      <button
                        type="button"
                        onClick={handleRazorpayCheckout}
                        disabled={submitting}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-wider rounded-xl transition-all shadow-xl shadow-emerald-600/30 active:scale-[0.99] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{formConfig.amount.toLocaleString('en-IN')} with Razorpay</span>
                      </button>
                      <p className="text-[11px] text-center text-neutral-400">
                        * Fills your details from the form and opens Razorpay checkout
                      </p>
                    </div>
                  )}

                  {/* Tab 2: Manual UPI QR Option */}
                  {paymentMethod === 'upi_qr' && (
                    <div>
                      <UpiQrCode
                        upiId={formConfig.upiId}
                        payeeName={formConfig.payeeName}
                        amount={formConfig.amount}
                        note={formConfig.programTitle}
                        size={210}
                      />
                    </div>
                  )}

                  {/* 3 Step Instructions */}
                  <div className="mt-6 pt-5 border-t border-white/10 space-y-3">
                    <h4 className="text-[11px] font-mono uppercase tracking-wider text-neutral-400 font-bold">
                      Enrollment Walkthrough
                    </h4>

                    <div className="flex items-start gap-3 text-xs text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-[#E63B30]/20 text-[#E63B30] flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                        1
                      </div>
                      <p>
                        Fill in your student contact information in the form on the right.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-[#E63B30]/20 text-[#E63B30] flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                        2
                      </div>
                      <p>
                        Pay <span className="text-white font-bold">₹{formConfig.amount}</span> via Razorpay or UPI QR code.
                      </p>
                    </div>

                    <div className="flex items-start gap-3 text-xs text-neutral-300">
                      <div className="w-5 h-5 rounded-full bg-[#E63B30]/20 text-[#E63B30] flex items-center justify-center font-bold font-mono text-[11px] shrink-0">
                        3
                      </div>
                      <p>
                        Save your details to sync with our Supabase database and message the coach on WhatsApp.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Academy WhatsApp Support Box */}
                <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                      <Phone className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="block text-[10px] uppercase font-mono text-neutral-400">
                        WhatsApp Helpdesk
                      </span>
                      <span className="text-sm font-semibold text-white font-mono">
                        {formatDisplayIndianPhone(formConfig.whatsappNumber)}
                      </span>
                    </div>
                  </div>
                  <a
                    href={formatWhatsAppLink(formConfig.whatsappNumber)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 uppercase tracking-wider"
                  >
                    Chat ↗
                  </a>
                </div>
              </div>

              {/* Right Column: Customer Details Form (7 Cols) */}
              <div className="lg:col-span-7">
                <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative">
                  <div className="mb-6 pb-4 border-b border-white/10">
                    <h2 className="font-['Oswald'] text-2xl font-bold uppercase tracking-tight text-white">
                      Student Registration Form
                    </h2>
                    <p className="text-neutral-400 text-xs mt-1">
                      Enter trainee details for gym records, safety waivers, and batch scheduling.
                    </p>
                  </div>

                  {errorMessage && (
                    <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>{errorMessage}</span>
                    </div>
                  )}

                  <form onSubmit={handleManualSubmit} className="space-y-4">
                    {/* Full Name */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        required
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] focus:ring-1 focus:ring-[#E63B30] transition-colors"
                      />
                    </div>

                    {/* Phone & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                            WhatsApp / Phone *
                          </label>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {phone.length}/10 digits
                          </span>
                        </div>
                        <div className="flex items-center rounded-xl border border-white/15 bg-[#0D0D0D] focus-within:border-[#E63B30] focus-within:ring-1 focus-within:ring-[#E63B30] transition-colors overflow-hidden">
                          <div className="flex items-center gap-1 px-3 py-3 bg-white/5 border-r border-white/10 text-xs font-mono font-bold text-neutral-300 select-none shrink-0">
                            <span>🇮🇳</span>
                            <span>+91</span>
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
                            className="flex-1 px-3.5 py-3 bg-transparent text-sm text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                          />
                          {isValidIndianMobile(phone) && (
                            <div className="pr-3 text-xs font-mono font-bold text-emerald-400">
                              ✓ Valid
                            </div>
                          )}
                        </div>
                        <span className="text-[10px] text-neutral-500 mt-1 block">
                          No spaces. Used for WhatsApp confirmation & batch schedule
                        </span>
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@example.com"
                          className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                        />
                      </div>
                    </div>

                    {/* Age & Gender */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                          Age
                        </label>
                        <input
                          type="number"
                          min="5"
                          max="85"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          placeholder="e.g. 26"
                          className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                          Gender
                        </label>
                        <select
                          value={gender}
                          onChange={(e) => setGender(e.target.value)}
                          className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other / Non-Binary</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      </div>
                    </div>

                    {/* Emergency Contact */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                          Emergency Contact Name
                        </label>
                        <input
                          type="text"
                          value={emergencyContactName}
                          onChange={(e) => setEmergencyContactName(e.target.value)}
                          placeholder="e.g. Priya Sharma (Spouse / Parent)"
                          className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                        />
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                            Emergency Contact Phone
                          </label>
                          <span className="text-[10px] font-mono text-neutral-400">
                            {emergencyContactPhone.length ? `${emergencyContactPhone.length}/10` : 'Optional'}
                          </span>
                        </div>
                        <div className="flex items-center rounded-xl border border-white/15 bg-[#0D0D0D] focus-within:border-[#E63B30] focus-within:ring-1 focus-within:ring-[#E63B30] transition-colors overflow-hidden">
                          <div className="flex items-center gap-1 px-3 py-3 bg-white/5 border-r border-white/10 text-xs font-mono font-bold text-neutral-300 select-none shrink-0">
                            <span>🇮🇳</span>
                            <span>+91</span>
                          </div>
                          <input
                            type="tel"
                            inputMode="numeric"
                            pattern="[0-9]*"
                            maxLength={10}
                            value={emergencyContactPhone}
                            onChange={(e) => setEmergencyContactPhone(cleanIndianMobileInput(e.target.value))}
                            placeholder="9876511223"
                            className="flex-1 px-3.5 py-3 bg-transparent text-sm text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                          />
                          {isValidIndianMobile(emergencyContactPhone) && (
                            <div className="pr-3 text-xs font-mono font-bold text-emerald-400">
                              ✓ Valid
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Experience Level */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                        Martial Arts Experience
                      </label>
                      <select
                        value={experienceLevel}
                        onChange={(e) => setExperienceLevel(e.target.value)}
                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-[#E63B30] transition-colors"
                      >
                        <option value="No Experience">No Experience (First time)</option>
                        <option value="Beginner (< 1 Year)">Beginner (&lt; 1 Year)</option>
                        <option value="Intermediate (1-3 Years)">Intermediate (1–3 Years)</option>
                        <option value="Advanced / Competitor (3+ Years)">Advanced / Competitor (3+ Years)</option>
                      </select>
                    </div>

                    {/* Fitness Goals */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                        Goals & Expectations
                      </label>
                      <input
                        type="text"
                        value={fitnessGoals}
                        onChange={(e) => setFitnessGoals(e.target.value)}
                        placeholder="e.g. Learn self defense, weight loss, competition, general fitness..."
                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                      />
                    </div>

                    {/* Medical Notes */}
                    <div>
                      <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                        Medical Conditions / Injuries (Optional)
                      </label>
                      <input
                        type="text"
                        value={medicalConditions}
                        onChange={(e) => setMedicalConditions(e.target.value)}
                        placeholder="e.g. None, knee injury recovery, asthma..."
                        className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                      />
                    </div>

                    {/* MANUAL UPI / OFFLINE PAYMENT SECTION */}
                    {paymentMethod === 'upi_qr' && (
                      <div className="pt-4 border-t border-white/10 space-y-4">
                        <div className="flex items-center justify-between">
                          <h3 className="font-['Oswald'] text-base uppercase text-white font-bold tracking-wide">
                            UPI Verification Details
                          </h3>
                          <span className="text-[11px] font-mono text-[#E63B30] font-bold">
                            Amount: ₹{formConfig.amount}
                          </span>
                        </div>

                        {/* UTR / UPI Ref */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                            UPI UTR / Reference ID (12 digits)
                          </label>
                          <input
                            type="text"
                            value={utrNumber}
                            onChange={(e) => setUtrNumber(e.target.value)}
                            placeholder="e.g. 428910394821 or Transaction ID"
                            className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-sm text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
                          />
                        </div>

                        {/* Payment Screenshot Upload */}
                        <div>
                          <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1.5 font-bold">
                            Attach Payment Screenshot
                          </label>

                          {screenshotData ? (
                            <div className="relative p-3 bg-neutral-900 border border-emerald-500/40 rounded-xl flex items-center justify-between">
                              <div className="flex items-center gap-3 overflow-hidden">
                                <img
                                  src={screenshotData}
                                  alt="Payment proof"
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10 shrink-0"
                                />
                                <div className="overflow-hidden">
                                  <span className="block text-xs font-medium text-white truncate">
                                    {screenshotFileName || 'Screenshot attached'}
                                  </span>
                                  <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                    <CheckCircle2 className="w-3 h-3" /> Attached
                                  </span>
                                </div>
                              </div>
                              <button
                                type="button"
                                onClick={() => {
                                  setScreenshotFile(null);
                                  setScreenshotData(null);
                                  setScreenshotFileName('');
                                }}
                                className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <label className="border-2 border-dashed border-white/20 hover:border-[#E63B30]/60 rounded-xl p-4 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#0D0D0D]/50 hover:bg-[#0D0D0D]">
                              <Upload className="w-6 h-6 text-neutral-400 mb-1" />
                              <span className="text-xs font-semibold text-neutral-300">
                                Click or Drag to Upload Payment Screenshot
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
                      </div>
                    )}

                    {/* Waiver & Terms Checkbox */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-1 w-4 h-4 rounded bg-[#0D0D0D] border-white/20 text-[#E63B30] focus:ring-[#E63B30] focus:ring-offset-0 cursor-pointer accent-[#E63B30]"
                        />
                        <span className="text-xs text-neutral-400 leading-relaxed select-none">
                          I agree to MMA Academy rules, confirm the details submitted are genuine, and acknowledge the physical training health & safety waiver.
                        </span>
                      </label>
                    </div>

                    {/* Submit Actions */}
                    {paymentMethod === 'razorpay' ? (
                      <button
                        type="button"
                        onClick={handleRazorpayCheckout}
                        disabled={submitting}
                        className="w-full py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-600/30 hover:shadow-emerald-600/50 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        <CreditCard className="w-4 h-4" />
                        <span>Pay ₹{formConfig.amount.toLocaleString('en-IN')} via Razorpay & Save</span>
                      </button>
                    ) : (
                      <button
                        type="submit"
                        disabled={submitting}
                        className="w-full py-4 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-xl transition-all shadow-xl shadow-[#E63B30]/30 hover:shadow-[#E63B30]/50 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                      >
                        {submitting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Saving Details to Database...</span>
                          </>
                        ) : (
                          <>
                            <FileCheck className="w-4 h-4" />
                            <span>Save Registration & Confirm Payment</span>
                          </>
                        )}
                      </button>
                    )}
                  </form>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
