import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Settings,
  Check,
  Save,
  Database,
  Copy,
  ChevronDown,
  ChevronUp,
  Radio,
} from 'lucide-react';
import { formStorage } from '../../services/formStorage';
import {
  cleanIndianMobileInput,
  isValidIndianMobile,
  getWhatsAppDigits,
} from '../../lib/phoneUtils';

interface AgencySettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaved?: () => void;
}

export const AgencySettingsModal: React.FC<AgencySettingsModalProps> = ({
  isOpen,
  onClose,
  onSaved,
}) => {
  const [agencyName, setAgencyName] = useState('MMA Trainers Academy');
  const [upiId, setUpiId] = useState('7668598281@ybl');
  const [whatsappNumber, setWhatsappNumber] = useState('7986851137');
  const [razorpayKeyId, setRazorpayKeyId] = useState('rzp_test_51Z11122233344');

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [showSql, setShowSql] = useState(false);
  const [copiedSql, setCopiedSql] = useState(false);

  // Load current settings when modal opens
  useEffect(() => {
    if (isOpen) {
      const current = formStorage.getAgencySettings();
      setAgencyName(current.agencyName || 'MMA Trainers Academy');
      setUpiId(current.upiId || '7668598281@ybl');
      setWhatsappNumber(
        cleanIndianMobileInput(current.whatsappNumber) || '7986851137'
      );
      setRazorpayKeyId(current.razorpayKeyId || 'rzp_test_51Z11122233344');
      setSaveSuccess(false);
    }
  }, [isOpen]);

  const sqlCode = `-- Run this in your Supabase SQL Editor:
CREATE TABLE IF NOT EXISTS public.agency_settings (
  id TEXT PRIMARY KEY DEFAULT 'default',
  agency_name TEXT DEFAULT 'MMA Trainers Academy',
  upi_id TEXT DEFAULT '7668598281@ybl',
  whatsapp_number TEXT DEFAULT '917986851137',
  razorpay_key_id TEXT DEFAULT 'rzp_test_51Z11122233344',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

INSERT INTO public.agency_settings (id, agency_name, upi_id, whatsapp_number, razorpay_key_id)
VALUES ('default', 'MMA Trainers Academy', '7668598281@ybl', '917986851137', 'rzp_test_51Z11122233344')
ON CONFLICT (id) DO NOTHING;

ALTER TABLE public.agency_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read agency_settings"
ON public.agency_settings FOR SELECT
TO anon, authenticated
USING (true);

CREATE POLICY "Allow public all agency_settings"
ON public.agency_settings FOR ALL
TO anon, authenticated
USING (true)
WITH CHECK (true);`;

  const handleCopySql = () => {
    navigator.clipboard.writeText(sqlCode);
    setCopiedSql(true);
    setTimeout(() => setCopiedSql(false), 2000);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!upiId.trim()) {
      alert('Please enter a valid Payee UPI ID.');
      return;
    }

    if (!whatsappNumber.trim() || !isValidIndianMobile(whatsappNumber)) {
      alert('Please enter a valid 10-digit Indian WhatsApp mobile number.');
      return;
    }

    const cleanDigits = getWhatsAppDigits(whatsappNumber) || '917986851137';

    setSaving(true);
    try {
      await formStorage.saveAgencySettings({
        agencyName: agencyName.trim() || 'MMA Trainers Academy',
        upiId: upiId.trim(),
        whatsappNumber: cleanDigits,
        razorpayKeyId: razorpayKeyId.trim() || undefined,
      });

      setSaveSuccess(true);
      if (onSaved) onSaved();

      setTimeout(() => {
        setSaveSuccess(false);
        onClose();
      }, 1200);
    } catch (err) {
      console.error('Save error:', err);
      alert('Saved locally. If Supabase table is not yet created, run the SQL query.');
    } finally {
      setSaving(false);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          className="relative w-full max-w-lg bg-[#141414] border border-white/20 rounded-3xl p-6 sm:p-7 shadow-2xl z-10 my-8"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
                <Settings className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-['Oswald'] text-lg font-bold uppercase text-white tracking-wide">
                  Agency Payment Defaults
                </h3>
                <p className="text-[11px] text-neutral-400">
                  Pre-fills all new payment forms & quick QR generators automatically
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSave} className="mt-5 space-y-4">
            {/* Agency Name */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                Business / Academy Name
              </label>
              <input
                type="text"
                required
                value={agencyName}
                onChange={(e) => setAgencyName(e.target.value)}
                placeholder="MMA Trainers Academy"
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
              />
            </div>

            {/* UPI ID */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                Default Payee UPI ID *
              </label>
              <input
                type="text"
                required
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="7668598281@ybl"
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 font-bold">
                  Agency WhatsApp (For Payment Screenshots) *
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
                  onChange={(e) =>
                    setWhatsappNumber(cleanIndianMobileInput(e.target.value))
                  }
                  placeholder="7986851137"
                  className="flex-1 px-3 py-2.5 bg-transparent text-xs text-white font-mono placeholder-neutral-500 focus:outline-none tracking-wider"
                />
              </div>
            </div>

            {/* Razorpay Key ID */}
            <div>
              <label className="block text-[11px] font-mono uppercase tracking-wider text-neutral-300 mb-1 font-bold">
                Default Razorpay Key ID (Optional)
              </label>
              <input
                type="text"
                value={razorpayKeyId}
                onChange={(e) => setRazorpayKeyId(e.target.value)}
                placeholder="rzp_test_51Z11122233344"
                className="w-full px-3.5 py-2.5 bg-[#0D0D0D] border border-white/15 rounded-xl text-xs text-white font-mono placeholder-neutral-500 focus:outline-none focus:border-[#E63B30] transition-colors"
              />
            </div>

            {/* Cloud Sync Status Strip */}
            <div className="p-3 rounded-xl bg-white/5 border border-white/10 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-neutral-300 text-[11px]">
                <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
                <span>Saves to Supabase Database & Local Cache</span>
              </span>
              <button
                type="button"
                onClick={() => setShowSql(!showSql)}
                className="text-[11px] text-amber-400 hover:underline flex items-center gap-0.5 cursor-pointer"
              >
                <span>SQL Schema</span>
                {showSql ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
              </button>
            </div>

            {/* Collapsible Supabase SQL Schema Box */}
            {showSql && (
              <div className="p-3 bg-[#0D0D0D] border border-white/15 rounded-xl text-[10px] font-mono text-neutral-300 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-neutral-400 font-bold uppercase text-[9px]">
                    Supabase SQL Query
                  </span>
                  <button
                    type="button"
                    onClick={handleCopySql}
                    className="text-amber-400 hover:text-amber-300 flex items-center gap-1 cursor-pointer font-sans text-xs"
                  >
                    {copiedSql ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    <span>{copiedSql ? 'Copied' : 'Copy SQL'}</span>
                  </button>
                </div>
                <pre className="max-h-28 overflow-y-auto bg-black/60 p-2 rounded border border-white/5 text-[9px] text-neutral-400 select-all">
                  {sqlCode}
                </pre>
              </div>
            )}

            {/* Actions */}
            <div className="pt-2 flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2.5 px-4 bg-white/10 hover:bg-white/15 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={saving}
                className="flex-1 py-2.5 px-4 bg-[#E63B30] hover:bg-[#D32F2F] disabled:opacity-50 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E63B30]/30 flex items-center justify-center gap-1.5 cursor-pointer"
              >
                {saving ? (
                  <span>Saving...</span>
                ) : saveSuccess ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    <span>Save Defaults</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
