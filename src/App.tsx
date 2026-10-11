import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Programs } from './components/Programs';
import { ParallaxBanner } from './components/ParallaxBanner';
import { Coaches } from './components/Coaches';
import { TargetAudience } from './components/TargetAudience';
import { TrainingModes } from './components/TrainingModes';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { TrialModal } from './components/TrialModal';
import { AdminPanel } from './components/admin/AdminPanel';
import { ClientPaymentForm } from './components/client/ClientPaymentForm';
import { QuickPayPage } from './components/client/QuickPayPage';
import { ErrorBoundary } from './components/ErrorBoundary';
import { formStorage } from './services/formStorage';
import { formatWhatsAppLink } from './lib/phoneUtils';

// Helper to determine initial view synchronously without flicker
const getInitialRoute = (): { view: 'home' | 'admin' | 'client'; formId?: string } => {
  if (typeof window === 'undefined') return { view: 'home' };
  try {
    const params = new URLSearchParams(window.location.search);
    const formParam = params.get('form');
    const quickParam = params.get('quick');
    const viewParam = params.get('view');
    const hash = window.location.hash;

    if (quickParam) return { view: 'client', formId: quickParam };
    if (formParam) return { view: 'client', formId: formParam };
    if (hash.startsWith('#/pay/')) return { view: 'client', formId: hash.replace('#/pay/', '') };
    if (hash.startsWith('#/quick/')) return { view: 'client', formId: hash.replace('#/quick/', '') };
    if (viewParam === 'admin' || hash === '#admin') return { view: 'admin' };
  } catch (e) {
    console.error('Route parsing error:', e);
  }
  return { view: 'home' };
};

export default function App() {
  const [trialModalOpen, setTrialModalOpen] = useState(false);
  const [selectedProgram, setSelectedProgram] = useState<string>('Brazilian Jiu-Jitsu');

  // Synchronous initial route to eliminate black screen flicker
  const initialRoute = getInitialRoute();
  const [view, setView] = useState<'home' | 'admin' | 'client'>(initialRoute.view);
  const [clientFormId, setClientFormId] = useState<string | undefined>(initialRoute.formId);

  // Sync route on popstate and hashchange
  useEffect(() => {
    const handleRouteSync = () => {
      const route = getInitialRoute();
      setView(route.view);
      if (route.formId) setClientFormId(route.formId);
    };

    window.addEventListener('popstate', handleRouteSync);
    window.addEventListener('hashchange', handleRouteSync);

    return () => {
      window.removeEventListener('popstate', handleRouteSync);
      window.removeEventListener('hashchange', handleRouteSync);
    };
  }, []);

  // Seamless Route Navigator
  const navigate = (newView: 'home' | 'admin' | 'client', formId?: string) => {
    setView(newView);
    if (formId) {
      setClientFormId(formId);
    } else if (newView === 'client' && !formId) {
      const forms = formStorage.getForms();
      if (forms.length > 0) {
        setClientFormId(forms[0].id);
      }
    }

    try {
      const url = new URL(window.location.href);
      if (newView === 'home') {
        url.searchParams.delete('view');
        url.searchParams.delete('form');
        url.searchParams.delete('quick');
        url.searchParams.delete('type');
        url.hash = '';
      } else if (newView === 'admin') {
        url.searchParams.set('view', 'admin');
        url.searchParams.delete('form');
        url.searchParams.delete('quick');
        url.searchParams.delete('type');
        url.hash = '';
      } else if (newView === 'client') {
        url.searchParams.delete('view');
        const targetId = formId || clientFormId || formStorage.getForms()[0]?.id;
        if (targetId) {
          const formConfig = formStorage.getFormById(targetId);
          if (formConfig?.formType === 'quick') {
            url.searchParams.set('quick', targetId);
            url.searchParams.delete('form');
          } else {
            url.searchParams.set('form', targetId);
            url.searchParams.delete('quick');
          }
          url.searchParams.delete('type');
        }
      }
      window.history.pushState({}, '', url.toString());
    } catch (e) {
      console.warn('History pushState error:', e);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenTrial = (programName?: string) => {
    const settings = formStorage.getAgencySettings();
    const phone = settings.whatsappNumber || '917986851137';
    const targetProgram = programName || selectedProgram || 'MMA Training';
    const text =
      `Hello MMA Trainers! 👋\n\n` +
      `I would like to book a *Free Trial Session* for *${targetProgram}* at MMA Trainers Academy.\n\n` +
      `Please let me know the upcoming batch schedule and availability!`;

    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  const handleCloseTrial = () => {
    setTrialModalOpen(false);
  };

  // Determine if current client form is Quick QR or Full Registration Form
  const isQuickMode = (() => {
    if (typeof window === 'undefined') return false;
    const params = new URLSearchParams(window.location.search);
    if (params.get('quick') || params.get('type') === 'quick') return true;
    if (window.location.hash.startsWith('#/quick/')) return true;
    if (clientFormId) {
      const f = formStorage.getFormById(clientFormId);
      if (f?.formType === 'quick') return true;
    }
    return false;
  })();

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-[#0D0D0D] text-[#F4F4F5] font-['Plus_Jakarta_Sans'] selection:bg-[#E63B30] selection:text-white flex flex-col">
        {/* 1. ADMIN PANEL VIEW */}
        {view === 'admin' && (
          <ErrorBoundary fallbackTitle="Admin Panel">
            <AdminPanel
              onBackToHome={() => navigate('home')}
              onPreviewClientForm={(formId) => navigate('client', formId)}
            />
          </ErrorBoundary>
        )}

        {/* 2. CLIENT VIEW (QUICK QR PAY OR FULL REGISTRATION FORM) */}
        {view === 'client' && (
          <ErrorBoundary fallbackTitle="Client Payment Portal">
            {isQuickMode ? (
              <QuickPayPage
                formId={clientFormId}
                onBackToHome={() => navigate('home')}
                onOpenAdmin={() => navigate('admin')}
              />
            ) : (
              <ClientPaymentForm
                formId={clientFormId}
                onBackToHome={() => navigate('home')}
                onOpenAdmin={() => navigate('admin')}
              />
            )}
          </ErrorBoundary>
        )}

        {/* 3. MAIN MMA WEBSITE VIEW */}
        {view === 'home' && (
          <>
            {/* Dynamic Header */}
            <Navbar onBookTrial={() => handleOpenTrial()} />

            <main className="flex-1">
              {/* 1. Hero Section & Feature Strip */}
              <Hero onBookTrial={() => handleOpenTrial()} />

              {/* 2. Programs Section ("Choose Your Program") */}
              <Programs onSelectProgram={(prog) => handleOpenTrial(prog)} />

              {/* 3. Full-Width Banner & Infinite Marquee */}
              <ParallaxBanner />

              {/* 4. Coaches Section ("Learn From Proven Coaches") */}
              <Coaches />

              {/* Target Audience / Busy Professionals Banner */}
              <TargetAudience />

              {/* Online vs Offline Training Comparison */}
              <TrainingModes />

              {/* FAQ Accordion Grid */}
              <FAQ />
            </main>

            {/* Footer */}
            <Footer
              onOpenAdmin={() => navigate('admin')}
              onBookTrial={() => handleOpenTrial()}
            />

            {/* Trial Booking Modal (Fallback) */}
            <TrialModal
              isOpen={trialModalOpen}
              onClose={handleCloseTrial}
              defaultProgram={selectedProgram}
            />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
