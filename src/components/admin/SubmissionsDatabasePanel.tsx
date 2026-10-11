import React, { useState, useEffect } from 'react';
import {
  Database,
  Search,
  FileSpreadsheet,
  Phone,
  Eye,
  Trash2,
  MessageSquare,
  Copy,
  Check,
  X,
  ArrowRight,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { formStorage } from '../../services/formStorage';
import { ClientSubmission, AdminStats } from '../../types/admin';
import { SubmissionDetailView } from './SubmissionDetailView';
import { formatWhatsAppLink, formatDisplayIndianPhone } from '../../lib/phoneUtils';

export const SubmissionsDatabasePanel: React.FC = () => {
  const [submissions, setSubmissions] = useState<ClientSubmission[]>([]);
  const [stats, setStats] = useState<AdminStats>({
    totalForms: 0,
    totalSubmissions: 0,
    totalRevenue: 0,
    pendingVerifications: 0,
  });

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'verified' | 'rejected'>('all');
  const [programFilter, setProgramFilter] = useState<string>('all');

  // Selected submission ID for dedicated record page (synced with URL ?record=...)
  const [selectedSubmissionId, setSelectedSubmissionId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      try {
        return new URLSearchParams(window.location.search).get('record');
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [lightboxImage, setLightboxImage] = useState<string | null>(null);
  const [copiedUtr, setCopiedUtr] = useState<string | null>(null);

  // Load submissions and stats
  const refreshData = () => {
    setSubmissions(formStorage.getSubmissions());
    setStats(formStorage.getStats());
  };

  useEffect(() => {
    refreshData();
    const unsubscribe = formStorage.subscribeToUpdates(refreshData);
    return unsubscribe;
  }, []);

  // Update URL and state when selecting a record
  const handleSelectRecord = (id: string | null) => {
    setSelectedSubmissionId(id);
    try {
      const url = new URL(window.location.href);
      if (id) {
        url.searchParams.set('record', id);
      } else {
        url.searchParams.delete('record');
      }
      window.history.replaceState({}, '', url.toString());
    } catch (e) {
      console.warn('URL sync error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Update submission status
  const handleStatusChange = (id: string, newStatus: 'pending' | 'verified' | 'rejected') => {
    formStorage.updateSubmission(id, { status: newStatus });
    refreshData();
  };

  // Delete submission
  const handleDeleteSubmission = (id: string) => {
    if (confirm('Are you sure you want to delete this submission record?')) {
      formStorage.deleteSubmission(id);
      refreshData();
      if (selectedSubmissionId === id) {
        handleSelectRecord(null);
      }
    }
  };

  // Copy UTR helper
  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(utr);
    setTimeout(() => setCopiedUtr(null), 2000);
  };

  // Direct WhatsApp Message to Customer
  const handleSendWhatsAppToCustomer = (sub: ClientSubmission) => {
    let text = '';
    if (sub.status === 'verified') {
      text =
        `Hi ${sub.fullName},\n\nWe have verified your payment of ₹${sub.amount} for *${sub.programTitle}*!\n\n` +
          `Welcome to MMA Trainers Academy. Your registration (Ref: ${sub.id}) is now active. Please arrive 15 minutes early on your first day for uniform fitting.\n\n` +
          `See you on the mats!`;
    } else {
      text =
        `Hi ${sub.fullName},\n\nRegarding your registration for *${sub.programTitle}* at MMA Trainers Academy (Ref: ${sub.id}):\n\n` +
          `Could you please share your payment confirmation or transaction receipt so our head coach can confirm your spot?\n\n` +
          `Thank you!`;
    }
    const waUrl = formatWhatsAppLink(sub.phone, text);
    window.open(waUrl, '_blank');
  };

  // Filter Submissions safely
  const safeSubmissions = Array.isArray(submissions) ? submissions : [];
  const query = (searchQuery || '').toLowerCase();

  const filteredSubmissions = safeSubmissions.filter((item) => {
    if (!item) return false;
    const matchesSearch =
      query === '' ||
      (item.fullName || '').toLowerCase().includes(query) ||
      (item.phone || '').toLowerCase().includes(query) ||
      (item.email || '').toLowerCase().includes(query) ||
      (item.utrNumber || '').toLowerCase().includes(query) ||
      (item.razorpayPaymentId || '').toLowerCase().includes(query) ||
      (item.id || '').toLowerCase().includes(query);

    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesProgram = programFilter === 'all' || item.programTitle === programFilter;

    return matchesSearch && matchesStatus && matchesProgram;
  });

  // Unique list of programs for filtering
  const uniquePrograms = Array.from(
    new Set(safeSubmissions.map((s) => s?.programTitle || '').filter(Boolean))
  );

  // If a record is selected, render the dedicated full-page record view!
  const activeSubmission = safeSubmissions.find((s) => s.id === selectedSubmissionId) || null;
  if (activeSubmission) {
    return (
      <SubmissionDetailView
        submission={activeSubmission}
        onBack={() => handleSelectRecord(null)}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteSubmission}
      />
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* Minimal Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-white/10">
        <h2 className="font-['Oswald'] text-2xl font-bold uppercase text-white tracking-wide">
          Student Submissions & Records
        </h2>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => formStorage.exportSubmissionsCSV()}
            className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Download CSV"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Submissions */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            TOTAL SUBMISSIONS
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Oswald'] text-3xl sm:text-4xl font-bold text-white">
              {stats.totalSubmissions}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Students</span>
          </div>
        </div>

        {/* Total Revenue */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            REVENUE COLLECTED
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Oswald'] text-3xl sm:text-4xl font-bold text-[#E63B30]">
              ₹{stats.totalRevenue.toLocaleString('en-IN')}
            </span>
            <span className="text-xs text-emerald-400 font-medium">INR</span>
          </div>
        </div>

        {/* Pending Verifications */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            PENDING VERIFICATION
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Oswald'] text-3xl sm:text-4xl font-bold text-amber-400">
              {stats.pendingVerifications}
            </span>
            <span className="text-xs text-amber-400 font-medium">Action Needed</span>
          </div>
        </div>

        {/* Total Forms Active */}
        <div className="bg-[#141414] border border-white/10 rounded-2xl p-5 shadow-lg">
          <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400 block mb-1">
            PAYMENT LINKS ACTIVE
          </span>
          <div className="flex items-baseline justify-between">
            <span className="font-['Oswald'] text-3xl sm:text-4xl font-bold text-white">
              {stats.totalForms}
            </span>
            <span className="text-xs text-neutral-400 font-medium">Active Links</span>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#141414] border border-white/15 rounded-2xl p-4 sm:p-5 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        {/* Search Input */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-neutral-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search student, phone, UTR, Razorpay ID..."
            className="w-full pl-10 pr-4 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
          />
        </div>

        {/* Filters Group */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1.5 bg-[#0D0D0D] p-1 rounded-xl border border-white/10 text-xs">
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-white/20 text-white'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              All ({submissions.length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                statusFilter === 'pending'
                  ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Pending ({submissions.filter((s) => s.status === 'pending').length})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-lg transition-colors font-medium cursor-pointer ${
                statusFilter === 'verified'
                  ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              Verified ({submissions.filter((s) => s.status === 'verified').length})
            </button>
          </div>

          {/* Program Filter Dropdown */}
          {uniquePrograms.length > 1 && (
            <select
              value={programFilter}
              onChange={(e) => setProgramFilter(e.target.value)}
              className="px-3 py-2 bg-[#0D0D0D] border border-white/10 rounded-xl text-xs text-neutral-300 focus:outline-none focus:border-[#E63B30] cursor-pointer"
            >
              <option value="all">All Programs</option>
              {uniquePrograms.map((prog) => (
                <option key={prog} value={prog}>
                  {prog}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {/* Submissions Table / Cards */}
      <div className="bg-[#141414] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden">
        {filteredSubmissions.length === 0 ? (
          <div className="text-center py-12">
            <Database className="w-10 h-10 text-neutral-600 mx-auto mb-2" />
            <h4 className="font-['Oswald'] text-base font-bold uppercase text-white mb-1">
              No Registrations Found
            </h4>
            <p className="text-xs text-neutral-500">
              New student registrations and payment receipts will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-white/10 text-neutral-400 font-mono uppercase tracking-wider text-[11px]">
                  <th className="py-3 px-3">Student Details</th>
                  <th className="py-3 px-3">Enrolled Program</th>
                  <th className="py-3 px-3">Fee & Payment ID</th>
                  <th className="py-3 px-3">Proof</th>
                  <th className="py-3 px-3">Verification Status</th>
                  <th className="py-3 px-3">Submitted At</th>
                  <th className="py-3 px-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredSubmissions.map((sub) => (
                  <tr
                    key={sub.id}
                    onClick={() => handleSelectRecord(sub.id)}
                    className="hover:bg-white/[0.06] transition-all cursor-pointer group hover:shadow-lg border-l-2 border-l-transparent hover:border-l-[#E63B30]"
                    title="Click row to open student profile details page"
                  >
                    {/* Student Details */}
                    <td className="py-4 px-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-white text-sm group-hover:text-[#E63B30] transition-colors">
                            {sub.fullName}
                          </span>
                          <span className="text-[10px] font-mono text-neutral-500 bg-white/5 px-1.5 py-0.5 rounded">
                            {sub.id}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-1 text-neutral-400 text-[11px]">
                          <a
                            href={`tel:${sub.phone.replace(/\s+/g, '')}`}
                            onClick={(e) => e.stopPropagation()}
                            className="hover:text-white flex items-center gap-1 font-mono"
                          >
                            <Phone className="w-3 h-3 text-[#E63B30]" />
                            {formatDisplayIndianPhone(sub.phone)}
                          </a>
                        </div>
                        <span className="text-[10px] text-neutral-500 font-mono block">
                          {sub.email}
                        </span>
                        {sub.emergencyContactName && (
                          <span className="text-[10px] text-neutral-400 mt-1 block">
                            ICE: {sub.emergencyContactName} ({formatDisplayIndianPhone(sub.emergencyContactPhone)})
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Program */}
                    <td className="py-4 px-3 max-w-[220px]">
                      <span className="font-semibold text-neutral-200 block text-xs">
                        {sub.programTitle}
                      </span>
                      {sub.experienceLevel && (
                        <span className="text-[10px] text-neutral-400 block mt-0.5">
                          Exp: {sub.experienceLevel}
                        </span>
                      )}
                      {sub.fitnessGoals && (
                        <span
                          className="text-[10px] text-neutral-500 italic block mt-0.5 truncate max-w-[200px]"
                          title={sub.fitnessGoals}
                        >
                          Goal: {sub.fitnessGoals}
                        </span>
                      )}
                    </td>

                    {/* Fee & Payment Gateway */}
                    <td className="py-4 px-3">
                      <span className="font-mono font-bold text-white text-sm block">
                        ₹{Number(sub.amount || 0).toLocaleString('en-IN')}
                      </span>
                      {sub.paymentMethod === 'razorpay' ? (
                        <div className="mt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded border border-emerald-500/20">
                            💳 Razorpay: {sub.razorpayPaymentId || 'Paid'}
                          </span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-neutral-400 font-mono block mt-0.5">
                          UPI to {sub.upiId}
                        </span>
                      )}
                      {sub.utrNumber && (
                        <div className="mt-1 flex items-center gap-1">
                          <span className="font-mono text-[10px] text-amber-300/90 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/20">
                            UTR: {sub.utrNumber}
                          </span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleCopyUtr(sub.utrNumber!);
                            }}
                            className="p-1 hover:text-white text-neutral-400 cursor-pointer"
                            title="Copy UTR"
                          >
                            {copiedUtr === sub.utrNumber ? (
                              <Check className="w-3 h-3 text-emerald-400" />
                            ) : (
                              <Copy className="w-3 h-3" />
                            )}
                          </button>
                        </div>
                      )}
                    </td>

                    {/* Screenshot Thumbnail */}
                    <td className="py-4 px-3">
                      {sub.screenshotUrl ? (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setLightboxImage(sub.screenshotUrl!);
                          }}
                          className="group/img relative block w-12 h-12 rounded-xl overflow-hidden border border-white/20 hover:border-[#E63B30] transition-colors cursor-pointer"
                          title="Click to view full screenshot"
                        >
                          <img
                            src={sub.screenshotUrl}
                            alt="Payment screenshot"
                            className="w-full h-full object-cover group-hover/img:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover/img:opacity-100 flex items-center justify-center transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </button>
                      ) : (
                        <span className="text-[10px] text-neutral-500 italic">
                          None attached
                        </span>
                      )}
                    </td>

                    {/* Verification Status */}
                    <td className="py-4 px-3">
                      <select
                        value={sub.status}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) =>
                          handleStatusChange(
                            sub.id,
                            e.target.value as 'pending' | 'verified' | 'rejected'
                          )
                        }
                        className={`px-2.5 py-1.5 rounded-lg text-xs font-bold font-mono uppercase tracking-wider border focus:outline-none transition-colors cursor-pointer ${
                          sub.status === 'verified'
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                            : sub.status === 'rejected'
                            ? 'bg-red-500/20 text-red-400 border-red-500/40'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                        }`}
                      >
                        <option value="pending" className="bg-[#141414] text-amber-400">
                          Pending
                        </option>
                        <option value="verified" className="bg-[#141414] text-emerald-400">
                          Verified
                        </option>
                        <option value="rejected" className="bg-[#141414] text-red-400">
                          Rejected
                        </option>
                      </select>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-3 text-neutral-400 text-[11px] font-mono">
                      <div>{new Date(sub.submittedAt).toLocaleDateString()}</div>
                      <div className="text-[10px] text-neutral-500">
                        {new Date(sub.submittedAt).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSendWhatsAppToCustomer(sub);
                          }}
                          className="p-2 bg-emerald-500/10 hover:bg-emerald-500/25 text-emerald-400 rounded-lg transition-colors cursor-pointer"
                          title="WhatsApp Student"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>

                        {/* Open Record Details Button */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleSelectRecord(sub.id);
                          }}
                          className="px-2.5 py-1.5 bg-white/10 hover:bg-[#E63B30] text-white rounded-lg transition-all flex items-center gap-1 font-bold text-xs tracking-wider cursor-pointer"
                          title="Open Full Record Page"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Details</span>
                        </button>

                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSubmission(sub.id);
                          }}
                          className="p-2 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors cursor-pointer"
                          title="Delete Record"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* SCREENSHOT LIGHTBOX */}
      {lightboxImage && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md cursor-pointer"
          onClick={() => setLightboxImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
            <div className="absolute -top-12 left-0 right-0 flex items-center justify-between text-xs text-white">
              <span className="font-mono text-neutral-400">
                📷 Payment Receipt
              </span>
              <div className="flex items-center gap-2">
                <a
                  href={lightboxImage}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                  title="Open full image in new tab"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  <span>Open ↗</span>
                </a>
                <button
                  onClick={() => setLightboxImage(null)}
                  className="p-1.5 text-white hover:text-red-400 bg-white/10 rounded-full cursor-pointer"
                  title="Close"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <img
              src={lightboxImage}
              alt="Full payment proof"
              className="max-h-[85vh] max-w-full rounded-2xl border border-white/20 shadow-2xl object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};
