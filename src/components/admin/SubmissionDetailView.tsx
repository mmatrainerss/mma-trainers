import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  ArrowLeft,
  Printer,
  MessageSquare,
  Phone,
  Mail,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Copy,
  Check,
  Trash2,
  ExternalLink,
  FileText,
  Calendar,
  User,
  HeartPulse,
  CreditCard,
  Lock,
  Download,
  Share2,
  Sparkles,
  X,
  Image as ImageIcon,
} from 'lucide-react';
import { ClientSubmission } from '../../types/admin';
import { formStorage } from '../../services/formStorage';
import { formatWhatsAppLink, formatDisplayIndianPhone } from '../../lib/phoneUtils';

interface SubmissionDetailViewProps {
  submission: ClientSubmission;
  onBack: () => void;
  onStatusChange: (id: string, status: 'pending' | 'verified' | 'rejected') => void;
  onDelete: (id: string) => void;
}

export const SubmissionDetailView: React.FC<SubmissionDetailViewProps> = ({
  submission,
  onBack,
  onStatusChange,
  onDelete,
}) => {
  const [adminNotes, setAdminNotes] = useState(submission.adminNotes || '');
  const [notesSaved, setNotesSaved] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [lightboxImage, setLightboxImage] = useState<string | null>(null);

  // Copy helper
  const handleCopy = (text: string, fieldName: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  // Save notes to Supabase & localStorage
  const handleSaveNotes = () => {
    formStorage.updateSubmission(submission.id, { adminNotes });
    setNotesSaved(true);
    setTimeout(() => setNotesSaved(false), 2500);
  };

  // Direct WhatsApp Message
  const handleWhatsAppChat = () => {
    let msg = '';
    if (submission.status === 'verified') {
      msg =
        `Hi ${submission.fullName}!\n\n` +
          `Your registration for *${submission.programTitle}* at MMA Trainers Academy is confirmed (Ref: ${submission.id}).\n\n` +
          `• Amount Paid: ₹${submission.amount.toLocaleString('en-IN')}\n` +
          (submission.razorpayPaymentId ? `• Razorpay ID: ${submission.razorpayPaymentId}\n` : '') +
          `\nPlease arrive 15 minutes before your first class for locker assignment and loaner uniform fitting. Welcome to the team!`;
    } else {
      msg =
        `Hi ${submission.fullName},\n\n` +
          `We received your student registration for *${submission.programTitle}* at MMA Trainers Academy (Ref: ${submission.id}).\n\n` +
          `Our coaches are currently verifying your payment of ₹${submission.amount.toLocaleString('en-IN')}. Could you please confirm your payment screenshot or UTR?\n\n` +
          `Thank you!`;
    }
    const waUrl = formatWhatsAppLink(submission.phone, msg);
    window.open(waUrl, '_blank');
  };

  // Print Student Admission Slip
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Breadcrumb & Action Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="p-2 bg-white/5 hover:bg-white/15 text-neutral-300 hover:text-white rounded-xl transition-colors border border-white/10 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to All Submissions</span>
          </button>
          <div className="h-4 w-px bg-white/10 hidden sm:block" />
          <span className="text-xs text-neutral-400 font-mono hidden sm:inline">
            Registration Record: <strong className="text-white">{submission.id}</strong>
          </span>
        </div>

        {/* Right Top Actions */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Status Dropdown */}
          <div className="flex items-center gap-2 bg-[#141414] border border-white/10 px-3 py-1.5 rounded-xl">
            <span className="text-[11px] font-mono text-neutral-400 uppercase">Status:</span>
            <select
              value={submission.status}
              onChange={(e) =>
                onStatusChange(submission.id, e.target.value as 'pending' | 'verified' | 'rejected')
              }
              className={`px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wider border focus:outline-none cursor-pointer ${
                submission.status === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : submission.status === 'rejected'
                  ? 'bg-red-500/20 text-red-400 border-red-500/40'
                  : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
              }`}
            >
              <option value="pending" className="bg-[#141414] text-amber-400">
                Pending Verification
              </option>
              <option value="verified" className="bg-[#141414] text-emerald-400">
                Verified & Active
              </option>
              <option value="rejected" className="bg-[#141414] text-red-400">
                Rejected / Incomplete
              </option>
            </select>
          </div>

          {/* WhatsApp Student Button */}
          <button
            type="button"
            onClick={handleWhatsAppChat}
            className="px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer"
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>WhatsApp Student</span>
          </button>

          {/* Print / Save Receipt Button */}
          <button
            type="button"
            onClick={handlePrint}
            className="p-2 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors border border-white/10 cursor-pointer"
            title="Print Admission Slip"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Delete Record Button */}
          <button
            type="button"
            onClick={() => onDelete(submission.id)}
            className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl transition-colors border border-red-500/20 cursor-pointer"
            title="Delete Record"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Student Header Hero Card */}
      <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute -top-24 right-0 w-80 h-80 bg-[#E63B30]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10">
          <div className="flex items-start gap-4 sm:gap-5">
            {/* Student Avatar Icon */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#E63B30] to-[#991B1B] text-white flex items-center justify-center font-['Oswald'] text-2xl sm:text-3xl font-black shadow-xl shadow-[#E63B30]/20 shrink-0">
              {submission.fullName
                .split(' ')
                .map((n) => n[0])
                .join('')
                .substring(0, 2)
                .toUpperCase() || 'ST'}
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2.5 mb-1.5">
                <span className="font-mono text-xs px-2.5 py-0.5 rounded-full bg-white/10 text-neutral-300 font-bold border border-white/10">
                  {submission.id}
                </span>
                <span
                  className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                    submission.status === 'verified'
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                      : submission.status === 'rejected'
                      ? 'bg-red-500/20 text-red-400 border border-red-500/40'
                      : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  }`}
                >
                  {submission.status === 'verified'
                    ? '✓ Verified Student'
                    : submission.status === 'rejected'
                    ? '✕ Rejected'
                    : '⏳ Pending Verification'}
                </span>
                <span className="text-[11px] font-mono text-neutral-500">
                  Enrolled: {new Date(submission.submittedAt).toLocaleString()}
                </span>
              </div>

              <h1 className="font-['Oswald'] text-3xl sm:text-4xl font-black uppercase text-white tracking-wide">
                {submission.fullName}
              </h1>

              {/* Fast Contact Strip */}
              <div className="flex flex-wrap items-center gap-4 mt-3 text-xs text-neutral-300">
                <a
                  href={`tel:${submission.phone.replace(/\s+/g, '')}`}
                  className="hover:text-white flex items-center gap-1.5 font-mono text-neutral-300 hover:text-[#E63B30] transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-[#E63B30]" />
                  <span>{formatDisplayIndianPhone(submission.phone)}</span>
                </a>

                <a
                  href={`mailto:${submission.email}`}
                  className="hover:text-white flex items-center gap-1.5 font-mono text-neutral-300 hover:text-[#E63B30] transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-[#E63B30]" />
                  <span>{submission.email}</span>
                </a>

                <span className="text-neutral-500 font-mono">
                  Age: <strong className="text-white">{submission.age || 'N/A'}</strong> • Gender: <strong className="text-white">{submission.gender || 'N/A'}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Fee Badge Pill */}
          <div className="bg-[#0D0D0D] border border-white/10 rounded-2xl p-4 sm:p-5 text-right shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
              REGISTRATION FEE PAID
            </span>
            <div className="font-['Oswald'] text-3xl sm:text-4xl font-black text-[#E63B30] font-mono">
              ₹{Number(submission.amount || 0).toLocaleString('en-IN')}
            </div>
            <span className="text-[11px] text-emerald-400 font-mono block mt-1 uppercase font-semibold">
              via {submission.paymentMethod === 'razorpay' ? 'Razorpay Gateway' : 'Direct UPI'}
            </span>
          </div>
        </div>
      </div>

      {/* 2-Column Full Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Training & Personal Profile (7 Cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card 1: Program & Martial Arts Training Profile */}
          <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
              <FileText className="w-4 h-4 text-[#E63B30]" />
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white tracking-wide">
                Martial Arts & Program Enrollment
              </h3>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1">
                  Enrolled Program
                </span>
                <p className="text-base font-bold text-white font-['Oswald'] tracking-wide">
                  {submission.programTitle}
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div>
                  <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1">
                    Prior Martial Arts Experience
                  </span>
                  <span className="inline-block px-3 py-1 bg-white/5 border border-white/10 text-white font-semibold rounded-lg">
                    {submission.experienceLevel || 'No Experience (First time)'}
                  </span>
                </div>

                <div>
                  <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1">
                    Emergency Contact Person
                  </span>
                  <p className="text-white font-medium">
                    {submission.emergencyContactName || 'None listed'}
                  </p>
                  {submission.emergencyContactPhone && (
                    <a
                      href={`tel:${submission.emergencyContactPhone.replace(/\s+/g, '')}`}
                      className="text-[#E63B30] font-mono hover:underline block mt-0.5"
                    >
                      {formatDisplayIndianPhone(submission.emergencyContactPhone)}
                    </a>
                  )}
                </div>
              </div>

              {/* Goals */}
              <div className="pt-2">
                <span className="text-neutral-400 font-mono uppercase text-[10px] block mb-1">
                  Student Goals & Expectations
                </span>
                <p className="p-3 bg-[#0D0D0D] rounded-xl border border-white/10 text-neutral-200 leading-relaxed italic">
                  {submission.fitnessGoals || 'No specific goals provided by student.'}
                </p>
              </div>

              {/* Medical Notice */}
              {submission.medicalConditions && (
                <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <div className="flex items-center gap-2 mb-1 text-amber-400 font-bold uppercase text-[11px]">
                    <HeartPulse className="w-4 h-4" />
                    <span>Medical Conditions & Injury Notes:</span>
                  </div>
                  <p className="text-neutral-200 text-xs">
                    {submission.medicalConditions}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Card 2: Coach & Admin Internal Notes */}
          <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-[#E63B30]" />
                <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white tracking-wide">
                  Coach / Academy Notes
                </h3>
              </div>
              {notesSaved && (
                <span className="text-xs text-emerald-400 font-mono flex items-center gap-1 animate-pulse">
                  <Check className="w-3.5 h-3.5" /> Notes Saved
                </span>
              )}
            </div>

            <textarea
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add internal notes (e.g. Assigned to Evening 7 PM Batch, loaner Gi size A2 delivered, verified on phone)..."
              className="w-full px-4 py-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors resize-none mb-3"
            />

            <button
              type="button"
              onClick={handleSaveNotes}
              className="px-4 py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer"
            >
              Update Coach Notes
            </button>
          </div>
        </div>

        {/* Right Column: Payment & Transaction Ledger (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card 3: Payment Gateway Ledger */}
          <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-white/10">
              <CreditCard className="w-4 h-4 text-emerald-400" />
              <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white tracking-wide">
                Payment Verification Details
              </h3>
            </div>

            <div className="space-y-3.5 text-xs">
              {/* Payment Method */}
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-neutral-400">Payment Gateway:</span>
                <span className="inline-flex items-center gap-1 text-emerald-400 font-bold uppercase font-mono">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  {submission.paymentMethod === 'razorpay' ? 'Razorpay Secure' : 'Direct UPI Transfer'}
                </span>
              </div>

              {/* Razorpay Payment ID */}
              {submission.razorpayPaymentId && (
                <div className="pb-2.5 border-b border-white/5">
                  <span className="text-neutral-400 block mb-1 font-mono uppercase text-[10px]">
                    Razorpay Payment ID
                  </span>
                  <div className="flex items-center justify-between p-2 bg-[#0D0D0D] rounded-xl border border-white/10">
                    <span className="font-mono text-emerald-400 font-bold text-xs truncate">
                      {submission.razorpayPaymentId}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(submission.razorpayPaymentId!, 'rzp')}
                      className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                      title="Copy Razorpay Payment ID"
                    >
                      {copiedField === 'rzp' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* UPI ID */}
              <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                <span className="text-neutral-400">Payee UPI ID:</span>
                <span className="font-mono text-white font-medium">{submission.upiId || 'mmatrainers@upi'}</span>
              </div>

              {/* UTR / Transaction Reference */}
              {submission.utrNumber ? (
                <div className="pb-2.5 border-b border-white/5">
                  <span className="text-neutral-400 block mb-1 font-mono uppercase text-[10px]">
                    Bank UTR / Transaction Reference
                  </span>
                  <div className="flex items-center justify-between p-2 bg-[#0D0D0D] rounded-xl border border-white/10">
                    <span className="font-mono text-amber-300 font-bold text-xs truncate">
                      {submission.utrNumber}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopy(submission.utrNumber!, 'utr')}
                      className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                      title="Copy UTR"
                    >
                      {copiedField === 'utr' ? (
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-center pb-2.5 border-b border-white/5">
                  <span className="text-neutral-400">Bank UTR:</span>
                  <span className="text-neutral-500 italic">None provided</span>
                </div>
              )}

              {/* Origin Form ID */}
              <div className="flex justify-between items-center">
                <span className="text-neutral-400">Payment Form ID:</span>
                <span className="font-mono text-neutral-300">{submission.formId || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Card 4: Payment Screenshot Preview */}
          <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-7 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono uppercase tracking-wider text-neutral-400 font-bold">
                Payment Screenshot / Receipt Proof:
              </span>
              {submission.screenshotUrl && (
                <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/30">
                  <CheckCircle2 className="w-3 h-3" /> Receipt Attached
                </span>
              )}
            </div>

            {submission.screenshotUrl ? (
              <div className="space-y-3">
                <div
                  onClick={() => setLightboxImage(submission.screenshotUrl!)}
                  className="relative rounded-2xl overflow-hidden border border-white/20 hover:border-[#E63B30] transition-colors cursor-pointer group max-h-64 flex items-center justify-center bg-black"
                >
                  <img
                    src={submission.screenshotUrl}
                    alt="Payment proof screenshot"
                    className="max-h-64 w-auto object-contain group-hover:scale-105 transition-transform"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white text-xs font-bold uppercase tracking-wider">
                    Click to View Full Size
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <span className="text-[11px] text-neutral-400 font-mono truncate max-w-[180px]">
                    {submission.screenshotFileName || 'Screenshot attached'}
                  </span>

                  <div className="flex items-center gap-1.5">
                    <a
                      href={submission.screenshotUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
                      title="Open full image in new tab"
                    >
                      <ExternalLink className="w-3 h-3 text-neutral-300" />
                      <span>Open ↗</span>
                    </a>

                    <button
                      type="button"
                      onClick={() => handleCopy(submission.screenshotUrl!, 'ss_url')}
                      className="px-2.5 py-1.5 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                      title="Copy public image link"
                    >
                      {copiedField === 'ss_url' ? (
                        <>
                          <Check className="w-3 h-3 text-emerald-400" />
                          <span className="text-emerald-400">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3 h-3 text-neutral-300" />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-white/10 rounded-2xl text-center text-xs text-neutral-500">
                No screenshot image was attached with this registration.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh]">
            <button
              onClick={() => setLightboxImage(null)}
              className="absolute -top-12 right-0 p-2 text-white hover:text-red-400 bg-white/10 rounded-full cursor-pointer"
            >
              <X className="w-6 h-6" />
            </button>
            <img
              src={lightboxImage}
              alt="Payment proof high-res"
              className="max-h-[85vh] max-w-full rounded-2xl border border-white/20 shadow-2xl object-contain mx-auto"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}
    </div>
  );
};
