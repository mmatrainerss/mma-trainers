import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Link2,
  Database,
  ArrowLeft,
  Bell,
  X,
  FileCheck2,
  ShieldAlert,
  HelpCircle,
  Settings,
} from 'lucide-react';
import { RaiLogo } from '../RaiLogo';
import { FormGeneratorPanel } from './FormGeneratorPanel';
import { SubmissionsDatabasePanel } from './SubmissionsDatabasePanel';
import { AgencySettingsModal } from './AgencySettingsModal';
import { formStorage } from '../../services/formStorage';
import { ClientSubmission } from '../../types/admin';

interface AdminPanelProps {
  onBackToHome: () => void;
  onPreviewClientForm: (formId?: string) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToHome,
  onPreviewClientForm,
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'database'>('generator');
  const [pendingCount, setPendingCount] = useState(0);
  const [toastNotification, setToastNotification] = useState<string | null>(null);
  const [settingsOpen, setSettingsOpen] = useState(false);

  // Update pending count & check for incoming submissions
  const updateStats = () => {
    const stats = formStorage.getStats();
    setPendingCount(stats.pendingVerifications);
  };

  useEffect(() => {
    updateStats();
    let prevSubCount = formStorage.getSubmissions().length;

    const unsubscribe = formStorage.subscribeToUpdates(() => {
      updateStats();
      const currentSubs = formStorage.getSubmissions();
      if (currentSubs.length > prevSubCount) {
        const latest = currentSubs[0];
        setToastNotification(
          `New Registration: ${latest.fullName} submitted ₹${latest.amount} for "${latest.programTitle}"`
        );
      }
      prevSubCount = currentSubs.length;
    });

    return unsubscribe;
  }, []);

  return (
    <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F5] font-['Plus_Jakarta_Sans'] selection:bg-[#E63B30] selection:text-white pb-24">
      {/* Real-time Multi-tab Toast Alert */}
      <AnimatePresence>
        {toastNotification && (
          <motion.div
            initial={{ opacity: 0, y: -20, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0, y: -20, x: '-50%' }}
            className="fixed top-20 left-1/2 z-50 bg-[#1C1414] border-2 border-emerald-500 rounded-2xl px-5 py-3.5 shadow-2xl flex items-center gap-3 text-xs text-white max-w-md w-full"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
              <Bell className="w-4 h-4 animate-bounce" />
            </div>
            <div className="flex-1">
              <p className="font-bold text-white text-xs leading-tight">Live Registration Alert</p>
              <p className="text-neutral-300 text-[11px] mt-0.5">{toastNotification}</p>
            </div>
            <button
              onClick={() => {
                setActiveTab('database');
                setToastNotification(null);
              }}
              className="text-[11px] font-bold text-emerald-400 hover:underline uppercase"
            >
              View
            </button>
            <button
              onClick={() => setToastNotification(null)}
              className="p-1 text-neutral-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/10 px-4 sm:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToHome}
              className="p-2 -ml-2 text-neutral-400 hover:text-white rounded-lg hover:bg-white/5 transition-colors flex items-center gap-1.5 text-xs font-semibold"
              title="Return to Main Website"
            >
              <ArrowLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Main Website</span>
            </button>
            <div className="h-5 w-px bg-white/10 hidden sm:block" />
            <RaiLogo theme="dark" />
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            {/* Global Payment & Agency Defaults Button */}
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors border border-amber-500/30 cursor-pointer"
              title="Edit Agency UPI, WhatsApp & Payment Settings"
            >
              <Settings className="w-3.5 h-3.5 text-amber-400" />
              <span>Agency Defaults</span>
            </button>
          </div>
        </div>
      </header>

      {/* Admin Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        {/* Navigation Tabs (2 Panels) */}
        <div className="flex items-center justify-center sm:justify-start mb-8">
          <div className="p-1 bg-[#141414] border border-white/10 rounded-xl flex items-center gap-1.5 shadow-xl">
            {/* Tab 1: Form Generator */}
            <button
              type="button"
              onClick={() => setActiveTab('generator')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer ${
                activeTab === 'generator'
                  ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Link2 className="w-3.5 h-3.5" />
              <span>Form Generator</span>
            </button>

            {/* Tab 2: Submissions Database */}
            <button
              type="button"
              onClick={() => setActiveTab('database')}
              className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-2 cursor-pointer relative ${
                activeTab === 'database'
                  ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                  : 'text-neutral-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <Database className="w-3.5 h-3.5" />
              <span>Submissions</span>
              {pendingCount > 0 && (
                <span className="ml-1 px-1.5 py-0.2 rounded-full bg-amber-400 text-black text-[10px] font-black font-mono">
                  {pendingCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab 1 Content */}
        {activeTab === 'generator' && (
          <FormGeneratorPanel
            onPreviewForm={(id) => onPreviewClientForm(id)}
          />
        )}

        {/* Tab 2 Content */}
        {activeTab === 'database' && <SubmissionsDatabasePanel />}
      </main>

      {/* Global Agency Defaults Modal */}
      <AgencySettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
      />
    </div>
  );
};
