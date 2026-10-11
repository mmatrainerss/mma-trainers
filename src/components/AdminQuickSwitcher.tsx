import React, { useState } from 'react';
import { Shield, Eye, Home, ChevronUp, ChevronDown, Sparkles } from 'lucide-react';

interface AdminQuickSwitcherProps {
  currentView: 'home' | 'admin' | 'client';
  onNavigate: (view: 'home' | 'admin' | 'client', formId?: string) => void;
  activeFormId?: string;
}

export const AdminQuickSwitcher: React.FC<AdminQuickSwitcherProps> = ({
  currentView,
  onNavigate,
  activeFormId,
}) => {
  const [minimized, setMinimized] = useState(false);

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {minimized ? (
        <button
          onClick={() => setMinimized(false)}
          className="p-3 bg-[#141414] hover:bg-[#1f1f1f] border border-white/20 text-white rounded-full shadow-2xl transition-all flex items-center justify-center hover:scale-105 active:scale-95"
          title="Open Portal Switcher"
        >
          <Shield className="w-4 h-4 text-[#E63B30]" />
        </button>
      ) : (
        <div className="bg-[#141414]/95 backdrop-blur-md border border-white/20 rounded-2xl p-2.5 shadow-2xl text-white flex items-center gap-1.5 animate-in fade-in slide-in-from-bottom-2">
          <div className="flex items-center gap-1 px-2 py-1 text-[11px] font-mono text-neutral-400 border-r border-white/10 hidden sm:flex">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>PORTAL:</span>
          </div>

          {/* Website Button */}
          <button
            type="button"
            onClick={() => onNavigate('home')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              currentView === 'home'
                ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Home className="w-3.5 h-3.5" />
            <span>Site</span>
          </button>

          {/* Admin Button */}
          <button
            type="button"
            onClick={() => onNavigate('admin')}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              currentView === 'admin'
                ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-400" />
            <span>Admin</span>
          </button>

          {/* Client Form Button */}
          <button
            type="button"
            onClick={() => onNavigate('client', activeFormId)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all flex items-center gap-1 cursor-pointer ${
              currentView === 'client'
                ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                : 'text-neutral-300 hover:text-white hover:bg-white/10'
            }`}
          >
            <Eye className="w-3.5 h-3.5 text-emerald-400" />
            <span>Client Form</span>
          </button>

          {/* Minimize Button */}
          <button
            onClick={() => setMinimized(true)}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-white/10 ml-1 transition-colors"
            title="Minimize"
          >
            <ChevronDown className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
