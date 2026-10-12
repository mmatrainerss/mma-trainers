import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Check,
  MessageCircle,
  ArrowRight,
  MapPin,
  Clock,
  Sparkles,
  ArrowUpRight,
  RotateCcw,
  Calendar,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { formatWhatsAppLink } from '../lib/phoneUtils';
import { formStorage } from '../services/formStorage';

export interface CityTerritory {
  id: string;
  name: string;
  zone: 'Zone 1' | 'Zone 2';
  zonePlanKey: 'zone-1' | 'zone-2';
  monthlyPrice: number;
  coverage: string;
  keywords: string[];
}

const CITIES: CityTerritory[] = [
  {
    id: 'chandigarh',
    name: 'Chandigarh',
    zone: 'Zone 1',
    zonePlanKey: 'zone-1',
    monthlyPrice: 13000,
    coverage: 'Sectors 1 to 70 · IT Park · Manimajra · Sector 17 & 35',
    keywords: ['chandigarh', 'chd', 'sector', 'it park', 'manimajra', '17', '35'],
  },
  {
    id: 'mohali',
    name: 'Mohali',
    zone: 'Zone 1',
    zonePlanKey: 'zone-1',
    monthlyPrice: 13000,
    coverage: 'Phases 1 to 11 · Sectors 67 to 127 · Aerocity Belt & Homeland',
    keywords: ['mohali', 'phase', 'sas nagar', 'phase 7', 'aerocity', 'homeland'],
  },
  {
    id: 'kharar',
    name: 'Kharar',
    zone: 'Zone 1',
    zonePlanKey: 'zone-1',
    monthlyPrice: 13000,
    coverage: 'Sunny Enclave · Gillco Valley · Chajju Majra · Kharar-Landran Belt',
    keywords: ['kharar', 'sunny enclave', 'gillco', 'landran'],
  },
  {
    id: 'zirakpur',
    name: 'Zirakpur',
    zone: 'Zone 2',
    zonePlanKey: 'zone-2',
    monthlyPrice: 15000,
    coverage: 'VIP Road · Dhakoli · Peer Muchalla · Baltana · PR7 Airport Road',
    keywords: ['zirakpur', 'vip road', 'dhakoli', 'peer muchalla', 'baltana', 'pr7'],
  },
  {
    id: 'panchkula',
    name: 'Panchkula',
    zone: 'Zone 2',
    zonePlanKey: 'zone-2',
    monthlyPrice: 15000,
    coverage: 'Sectors 1 to 28 · MDC (Mansa Devi Complex) · Sector 20 & Pinjore',
    keywords: ['panchkula', 'mdc', 'mansa devi', 'sector 20', 'pinjore'],
  },
  {
    id: 'new-chandigarh',
    name: 'New Chandigarh',
    zone: 'Zone 2',
    zonePlanKey: 'zone-2',
    monthlyPrice: 15000,
    coverage: 'Mullanpur · Eco City 1 & 2 · Omaxe · Medicity · DLF Hyde Park',
    keywords: ['new chandigarh', 'mullanpur', 'eco city', 'omaxe', 'medicity', 'dlf'],
  },
];

interface TimeSlotGroup {
  band: string;
  description: string;
  slots: string[];
}

const TIME_SLOT_GROUPS: TimeSlotGroup[] = [
  {
    band: 'Morning Slots',
    description: 'High energy start (30-min buffer)',
    slots: [
      '06:30 AM – 07:30 AM',
      '08:00 AM – 09:00 AM',
      '09:30 AM – 10:30 AM',
      '11:00 AM – 12:00 PM',
    ],
  },
  {
    band: 'Afternoon Slots',
    description: 'Flexible midday training',
    slots: [
      '12:30 PM – 01:30 PM',
      '02:00 PM – 03:00 PM',
      '03:30 PM – 04:30 PM',
    ],
  },
  {
    band: 'Evening & Night',
    description: 'Post-work combat sessions',
    slots: [
      '05:00 PM – 06:00 PM',
      '06:30 PM – 07:30 PM',
      '08:00 PM – 09:00 PM',
      '09:30 PM – 10:30 PM',
    ],
  },
];

interface PricingPlansProps {
  onBookTrial: (
    programName?: string,
    planId?: string,
    amount?: number,
    location?: string,
    slot?: string
  ) => void;
}

export const PricingPlans: React.FC<PricingPlansProps> = ({ onBookTrial }) => {
  // Step state: 1 = City, 2 = Slot, 3 = Package
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Progressive choices
  const [selectedCity, setSelectedCity] = useState<CityTerritory | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [selectedPackageId, setSelectedPackageId] = useState<string | null>(null);

  // Locality search inside city step
  const [citySearch, setCitySearch] = useState('');

  const settings = formStorage.getAgencySettings();
  const phone = settings.whatsappNumber || '917986851137';

  // Compute packages available for the chosen city
  const availablePackages = React.useMemo(() => {
    if (!selectedCity) return [];
    const isZone1 = selectedCity.zone === 'Zone 1';

    return [
      {
        id: 'trial',
        name: 'Introductory Trial Session',
        price: 999,
        badge: 'TESTING & CONSULTATION',
        planKey: 'trial',
        description: `1-on-1 movement testing and customized combat roadmap with our coach in ${selectedCity.name}.`,
        features: [
          'Entry-level testing & stamina assessment',
          'Doorstep visit with gloves & focus pads',
          '30-minute rest buffer pacing',
        ],
      },
      {
        id: selectedCity.zonePlanKey,
        name: `${selectedCity.name} Regular Monthly Plan`,
        price: selectedCity.monthlyPrice,
        badge: `${selectedCity.zone.toUpperCase()} · 16 SESSIONS`,
        planKey: selectedCity.zonePlanKey,
        description: `Full monthly combat conditioning (16 sessions on alternate days) at your doorstep or studio in ${selectedCity.name}.`,
        features: [
          '16 Sessions / Month on alternate days',
          'Continuous hourly slots with 30-min buffer',
          'Full trainer mobility & sparring pads included',
          'MMA, Boxing, Kickboxing or Self Defence',
        ],
      },
      {
        id: 'elder',
        name: 'Elder Age Fitness Training',
        price: 15000,
        badge: 'SENIOR WELLNESS',
        planKey: 'elder',
        description: 'Specialized low-impact functional mobility, balance, fall prevention, and core stability.',
        features: [
          'Adapted joint-safe conditioning drills',
          'Gentle cardiovascular & balance recovery',
          '30-minute rest buffers for safe pacing',
        ],
      },
      {
        id: 'family',
        name: 'Family Group Plan (4 Members)',
        price: 20000,
        badge: 'UP TO 4 MEMBERS',
        planKey: 'family',
        description: 'Train together with family or close friends in a private dedicated hourly batch.',
        features: [
          'Covers up to 4 members (₹5,000/person)',
          '16 sessions monthly on alternate days',
          'Custom pacing for different fitness levels',
        ],
      },
    ];
  }, [selectedCity]);

  const activePackage = availablePackages.find((p) => p.id === selectedPackageId);

  // Handlers
  const handleCitySelect = (city: CityTerritory) => {
    setSelectedCity(city);
    setCurrentStep(2);
  };

  const handleSlotSelect = (slot: string) => {
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handlePackageSelect = (pkgId: string) => {
    setSelectedPackageId(pkgId);
  };

  const handleReset = () => {
    setCurrentStep(1);
    setSelectedCity(null);
    setSelectedSlot(null);
    setSelectedPackageId(null);
    setCitySearch('');
  };

  const handleConfirmBooking = () => {
    if (!selectedCity || !selectedSlot || !activePackage) return;
    onBookTrial(
      `${activePackage.name} (${selectedCity.name})`,
      activePackage.planKey,
      activePackage.price,
      selectedCity.name,
      selectedSlot
    );
  };

  const handleWhatsAppConfirm = () => {
    if (!selectedCity || !selectedSlot || !activePackage) return;
    const text = `Hello MMA Trainers! I selected ${activePackage.name} in ${selectedCity.name} for the ${selectedSlot} slot. Please confirm trainer availability.`;
    window.open(formatWhatsAppLink(phone, text), '_blank');
  };

  return (
    <section id="pricing" className="py-16 sm:py-20 bg-[#0A0A0A] relative text-white border-t border-white/5 select-none overflow-hidden">
      <div className="w-full max-w-[1800px] mx-auto px-4 sm:px-8 md:px-12 lg:px-16 relative z-10">

        {/* Section Header */}
        <div className="max-w-2xl mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E63B30]/15 text-[#E63B30] border border-[#E63B30]/30 text-[10px] font-mono uppercase tracking-widest font-bold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>INTERACTIVE BOOKING WIZARD</span>
          </div>
          <h2 className="font-['Plus_Jakarta_Sans'] text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white mb-2">
            Select Your City, Slot & Package
          </h2>
          <p className="text-xs sm:text-sm text-neutral-400 font-normal">
            Options unfold progressively as you choose your city, preferred training slot, and tailored package.
          </p>
        </div>

        {/* Main Compact Wizard Container */}
        <div className="w-full rounded-2xl bg-[#121212] border border-white/10 shadow-2xl p-5 sm:p-7 relative overflow-hidden">

          {/* =============================================================== */}
          {/* COMPACT PROGRESS BREADCRUMB BAR                                 */}
          {/* =============================================================== */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-6 pb-5 border-b border-white/10">
            {/* Step 1 Pill */}
            <button
              type="button"
              onClick={() => setCurrentStep(1)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                currentStep === 1
                  ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30 ring-1 ring-[#E63B30]'
                  : selectedCity
                  ? 'bg-white/10 text-neutral-200 hover:bg-white/15'
                  : 'bg-white/5 text-neutral-500'
              }`}
            >
              <span>1. City</span>
              {selectedCity && (
                <span className="text-[#25D366] text-[11px] font-sans font-bold flex items-center gap-0.5">
                  : {selectedCity.name}
                  <Check className="w-3 h-3" />
                </span>
              )}
            </button>

            <span className="text-neutral-600 text-xs font-mono">→</span>

            {/* Step 2 Pill */}
            <button
              type="button"
              disabled={!selectedCity}
              onClick={() => selectedCity && setCurrentStep(2)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                currentStep === 2
                  ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30 ring-1 ring-[#E63B30] cursor-pointer'
                  : selectedSlot
                  ? 'bg-white/10 text-neutral-200 hover:bg-white/15 cursor-pointer'
                  : 'bg-white/5 text-neutral-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <span>2. Slot</span>
              {selectedSlot && (
                <span className="text-[#25D366] text-[11px] font-sans font-bold flex items-center gap-0.5">
                  : {selectedSlot.split(' ')[0]}
                  <Check className="w-3 h-3" />
                </span>
              )}
            </button>

            <span className="text-neutral-600 text-xs font-mono">→</span>

            {/* Step 3 Pill */}
            <button
              type="button"
              disabled={!selectedSlot}
              onClick={() => selectedSlot && setCurrentStep(3)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all ${
                currentStep === 3
                  ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30 ring-1 ring-[#E63B30] cursor-pointer'
                  : activePackage
                  ? 'bg-white/10 text-neutral-200 hover:bg-white/15 cursor-pointer'
                  : 'bg-white/5 text-neutral-500 opacity-60 cursor-not-allowed'
              }`}
            >
              <span>3. Package</span>
              {activePackage && (
                <span className="text-[#25D366] text-[11px] font-sans font-bold flex items-center gap-0.5">
                  : ₹{activePackage.price.toLocaleString('en-IN')}
                  <Check className="w-3 h-3" />
                </span>
              )}
            </button>

            {/* Reset Button */}
            {(selectedCity || selectedSlot) && (
              <button
                type="button"
                onClick={handleReset}
                className="ml-auto text-neutral-400 hover:text-white text-[11px] font-mono flex items-center gap-1 py-1 px-2.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>

          {/* =============================================================== */}
          {/* STEP 1: SELECT CITY                                             */}
          {/* =============================================================== */}
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="step-1"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-[#E63B30]" />
                      <span>Select Your City / Territory</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Click your location to unlock doorstep slot availability.
                    </p>
                  </div>

                  {/* Locality Search Filter */}
                  <div className="relative w-full sm:w-72">
                    <Search className="w-3.5 h-3.5 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                    <input
                      type="text"
                      value={citySearch}
                      onChange={(e) => setCitySearch(e.target.value)}
                      placeholder="Type sector, VIP road, phase..."
                      className="w-full bg-[#181818] border border-white/15 focus:border-[#E63B30] rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-neutral-500 outline-none"
                    />
                  </div>
                </div>

                {/* 6 Compact City Buttons Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                  {CITIES.filter((c) => {
                    if (!citySearch.trim()) return true;
                    const q = citySearch.toLowerCase();
                    return (
                      c.name.toLowerCase().includes(q) ||
                      c.coverage.toLowerCase().includes(q) ||
                      c.keywords.some((k) => k.includes(q))
                    );
                  }).map((city) => {
                    const isSelected = selectedCity?.id === city.id;

                    return (
                      <button
                        key={city.id}
                        type="button"
                        onClick={() => handleCitySelect(city)}
                        className={`p-4 rounded-xl text-left transition-all duration-200 cursor-pointer flex flex-col justify-between border ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-[#E63B30] shadow-lg shadow-[#E63B30]/20 ring-1 ring-[#E63B30]'
                            : 'bg-[#161616] border-white/10 hover:border-white/30 hover:bg-[#1A1A1A]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-1.5">
                            <span className="text-[9px] font-mono font-bold text-[#E63B30] uppercase">
                              {city.zone}
                            </span>
                            <span className="w-1.5 h-1.5 rounded-full bg-[#25D366]" />
                          </div>

                          <h4 className="font-['Plus_Jakarta_Sans'] text-sm sm:text-base font-bold text-white mb-1">
                            {city.name}
                          </h4>

                          <p className="text-[10px] text-neutral-400 line-clamp-2 leading-relaxed mb-3">
                            {city.coverage}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-white/5 flex items-baseline justify-between text-[11px]">
                          <span className="font-extrabold text-white">
                            ₹{city.monthlyPrice.toLocaleString('en-IN')}/mo
                          </span>
                          <span className="text-[#E63B30] text-[10px] font-mono font-bold flex items-center gap-0.5">
                            Select <ArrowRight className="w-2.5 h-2.5" />
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* STEP 2: SELECT TIME SLOT                                        */}
            {/* =============================================================== */}
            {currentStep === 2 && selectedCity && (
              <motion.div
                key="step-2"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Clock className="w-4 h-4 text-[#E63B30]" />
                      <span>Choose Training Slot in {selectedCity.name}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Continuous hourly slots from 6:30 AM to 10:30 PM with 30-min buffer between sessions.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="text-xs text-[#E63B30] hover:underline flex items-center gap-1 cursor-pointer"
                  >
                    <span>Change City ({selectedCity.name})</span>
                  </button>
                </div>

                {/* Slot Groups Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {TIME_SLOT_GROUPS.map((group, gIdx) => (
                    <div
                      key={gIdx}
                      className="p-4 rounded-xl bg-[#161616] border border-white/10 flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <h4 className="text-xs font-mono font-bold text-[#E63B30] uppercase">
                            {group.band}
                          </h4>
                          <span className="text-[10px] text-neutral-500 font-mono">1 hr / slot</span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mb-3">
                          {group.description}
                        </p>

                        <div className="space-y-2">
                          {group.slots.map((slot, sIdx) => {
                            const isSelected = selectedSlot === slot;

                            return (
                              <button
                                key={sIdx}
                                type="button"
                                onClick={() => handleSlotSelect(slot)}
                                className={`w-full py-2 px-3 rounded-lg text-xs font-medium text-left transition-all cursor-pointer flex items-center justify-between border ${
                                  isSelected
                                    ? 'bg-[#E63B30] text-white border-[#E63B30] shadow-md shadow-[#E63B30]/30 font-bold'
                                    : 'bg-[#1C1C1C] text-neutral-300 border-white/5 hover:border-white/20 hover:text-white hover:bg-[#202020]'
                                }`}
                              >
                                <span>{slot}</span>
                                {isSelected ? (
                                  <Check className="w-3.5 h-3.5 text-white" />
                                ) : (
                                  <ArrowRight className="w-3 h-3 text-neutral-500" />
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* =============================================================== */}
            {/* STEP 3: SELECT PACKAGE & CHECKOUT                               */}
            {/* =============================================================== */}
            {currentStep === 3 && selectedCity && selectedSlot && (
              <motion.div
                key="step-3"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-[#E63B30]" />
                      <span>Select Package for {selectedCity.name} · {selectedSlot}</span>
                    </h3>
                    <p className="text-xs text-neutral-400 mt-0.5">
                      Tailored specifically for {selectedCity.zone} delivery with 16 sessions monthly format.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-xs">
                    <button
                      type="button"
                      onClick={() => setCurrentStep(1)}
                      className="text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      City: {selectedCity.name}
                    </button>
                    <span className="text-neutral-600">/</span>
                    <button
                      type="button"
                      onClick={() => setCurrentStep(2)}
                      className="text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Slot: {selectedSlot.split(' ')[0]}
                    </button>
                  </div>
                </div>

                {/* 4 Compact Selectable Package Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                  {availablePackages.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => handlePackageSelect(pkg.id)}
                        className={`p-5 rounded-xl flex flex-col justify-between transition-all duration-200 cursor-pointer border ${
                          isSelected
                            ? 'bg-[#1C1C1C] border-2 border-[#E63B30] shadow-xl shadow-[#E63B30]/25 ring-1 ring-[#E63B30]'
                            : 'bg-[#161616] border-white/10 hover:border-white/30 hover:bg-[#1A1A1A]'
                        }`}
                      >
                        <div>
                          <div className="flex items-center justify-between gap-1 mb-2">
                            <span className="text-[9px] font-mono uppercase font-bold text-[#E63B30]">
                              {pkg.badge}
                            </span>
                            {isSelected ? (
                              <span className="px-2 py-0.5 rounded-full bg-[#E63B30] text-white text-[9px] font-mono font-bold flex items-center gap-0.5">
                                <Check className="w-2.5 h-2.5" /> SELECTED
                              </span>
                            ) : (
                              <span className="text-[10px] text-neutral-500 font-mono">SELECT</span>
                            )}
                          </div>

                          <h4 className="font-['Plus_Jakarta_Sans'] text-base font-bold text-white mb-1">
                            {pkg.name}
                          </h4>

                          <div className="flex items-baseline gap-1 mb-2">
                            <span className="text-2xl font-extrabold text-white">
                              ₹{pkg.price.toLocaleString('en-IN')}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                              {pkg.id === 'trial' ? ' (1-on-1)' : '/mo'}
                            </span>
                          </div>

                          <p className="text-[11px] text-neutral-400 mb-3 leading-relaxed">
                            {pkg.description}
                          </p>

                          <ul className="space-y-1.5 text-[11px] text-neutral-300 pt-2 border-t border-white/5">
                            {pkg.features.map((f, fIdx) => (
                              <li key={fIdx} className="flex items-start gap-1.5">
                                <Check className="w-3 h-3 text-[#E63B30] shrink-0 mt-0.5" />
                                <span>{f}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="pt-4">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handlePackageSelect(pkg.id);
                            }}
                            className={`w-full py-2.5 px-3 rounded-lg text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                              isSelected
                                ? 'bg-[#E63B30] text-white shadow-md shadow-[#E63B30]/30'
                                : 'bg-white/10 text-white hover:bg-[#E63B30]'
                            }`}
                          >
                            <span>{isSelected ? 'Ready to Book' : 'Select'}</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Final Compact Checkout & Action Bar (Appears once package is clicked) */}
                {activePackage && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 sm:p-5 rounded-xl bg-[#181818] border border-[#E63B30]/50 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-[#E63B30]/20 text-[#E63B30] flex items-center justify-center shrink-0">
                        <CheckCircle2 className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-[10px] font-mono uppercase text-neutral-400">
                          Confirmed Selection:
                        </p>
                        <p className="text-sm sm:text-base font-bold text-white">
                          {activePackage.name} — <span className="text-[#E63B30]">₹{activePackage.price.toLocaleString('en-IN')}</span>
                        </p>
                        <p className="text-xs text-neutral-300">
                          {selectedCity.name} · Slot: {selectedSlot} · 16 Sessions Alternate Days
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
                      <button
                        type="button"
                        onClick={handleConfirmBooking}
                        className="flex-1 md:flex-none px-6 py-3 bg-[#E63B30] hover:bg-[#D32F2F] text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-lg shadow-[#E63B30]/25 flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <span>Proceed to Book & Pay</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>

                      <button
                        type="button"
                        onClick={handleWhatsAppConfirm}
                        className="px-4 py-3 bg-[#25D366]/20 hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#25D366]/40 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <MessageCircle className="w-3.5 h-3.5 fill-current" />
                        <span>Confirm via WhatsApp</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
};
