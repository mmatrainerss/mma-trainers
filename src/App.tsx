import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Programs } from './components/Programs';
import { PricingPlans } from './components/PricingPlans';
import { Coaches } from './components/Coaches';
import { TrainingModes } from './components/TrainingModes';
import { FAQ } from './components/FAQ';
import { Footer } from './components/Footer';
import { TrialModal } from './components/TrialModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
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
  const [selectedProgram, setSelectedProgram] = useState<string>('Mixed Martial Arts (MMA)');
  const [selectedPlanId, setSelectedPlanId] = useState<string>('trial');
  const [selectedAmount, setSelectedAmount] = useState<number>(999);
  const [selectedLocation, setSelectedLocation] = useState<string>('Chandigarh');
  const [selectedSlot, setSelectedSlot] = useState<string>('07:00 PM – 08:00 PM (Prime)');

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

  const handleOpenTrial = (
    programName?: string,
    planId?: string,
    amount?: number,
    location?: string,
    slot?: string
  ) => {
    if (programName) setSelectedProgram(programName);
    if (planId) setSelectedPlanId(planId);
    if (amount) setSelectedAmount(amount);
    if (location) setSelectedLocation(location);
    if (slot) setSelectedSlot(slot);
    setTrialModalOpen(true);
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
      <div className="min-h-screen w-full bg-[#0D0D0D] text-[#F4F4F5] font-['Plus_Jakarta_Sans'] selection:bg-[#E63B30] selection:text-white flex flex-col overflow-x-hidden">
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

            <main className="flex-1 w-full overflow-x-hidden">
              {/* 1. Hero Section (BLACK bg-[#0B0B0B]) */}
              <Hero
                onBookTrial={() => handleOpenTrial('Trial Session', 'trial', 999)}
                onBookMonthly={() => handleOpenTrial('Monthly Package', 'zone-1', 13000)}
              />

              {/* 2. Disciplines & Programs Section (WHITE bg-white) */}
              <Programs
                onBookTrial={(prog) => handleOpenTrial(prog, 'trial', 999)}
                onBookMonthly={(prog) => {
                  const isElder = prog.toLowerCase().includes('elder');
                  handleOpenTrial(prog, isElder ? 'elder' : 'zone-1', isElder ? 15000 : 13000);
                }}
              />

              {/* 3. Monthly Packages Section (BLACK bg-[#0A0A0A]) */}
              <PricingPlans onBookTrial={handleOpenTrial} />

              {/* 4. Coaches & Action Reels Section (WHITE bg-white) */}
              <Coaches />

              {/* 5. Delivery Modes Section (BLACK bg-[#0A0A0A]) */}
              <TrainingModes />

              {/* 6. FAQ Accordion Grid (WHITE bg-white) */}
              <FAQ />
            </main>

            {/* Footer with Interactive Tricity Area Selector */}
            <Footer
              onOpenAdmin={() => navigate('admin')}
              onBookTrial={handleOpenTrial}
              onBookMonthly={handleOpenTrial}
            />

            {/* Course Enrollment & Payment Modal */}
            <TrialModal
              isOpen={trialModalOpen}
              onClose={handleCloseTrial}
              defaultProgram={selectedProgram}
              defaultPlanId={selectedPlanId}
              defaultAmount={selectedAmount}
              defaultLocation={selectedLocation}
              defaultSlot={selectedSlot}
            />

            {/* Direct WhatsApp Floating Support Button */}
            <FloatingWhatsApp />
          </>
        )}
      </div>
    </ErrorBoundary>
  );
}
