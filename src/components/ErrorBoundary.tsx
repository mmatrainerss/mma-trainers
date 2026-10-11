import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallbackTitle?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = () => {
    localStorage.removeItem('mma_admin_payment_forms_v1');
    localStorage.removeItem('mma_admin_client_submissions_v1');
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#0D0D0D] text-white flex items-center justify-center p-6">
          <div className="max-w-md w-full bg-[#141414] border border-[#E63B30]/40 rounded-3xl p-8 text-center shadow-2xl">
            <div className="w-14 h-14 rounded-2xl bg-[#E63B30]/20 border border-[#E63B30]/50 text-[#E63B30] flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-['Oswald'] font-bold uppercase mb-2">
              {this.props.fallbackTitle || 'Panel Recovery'}
            </h2>
            <p className="text-xs text-neutral-400 mb-4 leading-relaxed">
              An unexpected error occurred during rendering. Details:
            </p>
            <div className="bg-[#0D0D0D] p-3 rounded-xl border border-white/10 text-left font-mono text-[11px] text-red-400 mb-6 max-h-32 overflow-y-auto">
              {this.state.error?.message || 'Unknown runtime error'}
            </div>
            <div className="flex gap-2 justify-center">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-5 py-2.5 bg-[#E63B30] hover:bg-[#D32F2F] text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Reload Page
              </button>
              <button
                type="button"
                onClick={this.handleReset}
                className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all"
              >
                Reset Local Cache
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
