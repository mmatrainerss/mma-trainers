import { PaymentFormConfig, ClientSubmission, AdminStats, AgencySettings } from '../types/admin';
import { supabase } from '../lib/supabase';

const STORAGE_KEYS = {
  FORMS: 'mma_admin_payment_forms_v1',
  SUBMISSIONS: 'mma_admin_client_submissions_v1',
  DEFAULT_UPI: 'mma_admin_default_upi_v1',
  DEFAULT_PHONE: 'mma_admin_default_phone_v1',
  DEFAULT_RZP_KEY: 'mma_admin_default_rzp_key_v1',
  AGENCY_SETTINGS: 'mma_admin_agency_settings_v1',
};

const DEFAULT_AGENCY_SETTINGS: AgencySettings = {
  id: 'default',
  agencyName: 'MMA Trainers Academy',
  upiId: '7668598281@ybl',
  whatsappNumber: '917986851137',
  razorpayKeyId: import.meta.env.VITE_RAZORPAY_KEY_ID || 'rzp_test_51Z11122233344',
};

// Seed initial realistic data
const INITIAL_FORMS: PaymentFormConfig[] = [
  {
    id: 'mma-form-101',
    amount: 13000,
    upiId: '7668598281@ybl',
    payeeName: 'MMA Trainers Academy',
    programTitle: 'Monthly Training Plan (Chandigarh · Mohali · Kharar)',
    whatsappNumber: '917986851137',
    formType: 'full',
    clientName: 'Harpreet Singh',
    notes: 'Zone 1 Monthly Package. 16 Sessions on alternate days. Timings: 6:30 AM to 10:30 PM (Hourly format with 30m rest gap).',
    razorpayKeyId: 'rzp_test_51Z11122233344',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'active',
    submissionCount: 1,
  },
  {
    id: 'mma-form-102',
    amount: 15000,
    upiId: '7668598281@ybl',
    payeeName: 'MMA Trainers Academy',
    programTitle: 'Monthly Training Plan (Zirakpur · Panchkula · New Chandigarh)',
    whatsappNumber: '917986851137',
    formType: 'full',
    clientName: 'Aakriti Mahajan',
    notes: 'Zone 2 Monthly Package. 16 Sessions on alternate days. 6:30 AM to 10:30 PM hourly slots with 30m rest gap.',
    razorpayKeyId: 'rzp_test_51Z11122233344',
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: 'active',
    submissionCount: 1,
  },
  {
    id: 'mma-form-103',
    amount: 15000,
    upiId: '7668598281@ybl',
    payeeName: 'MMA Trainers Academy',
    programTitle: 'Elder Age Fitness Training (Senior Wellness Package)',
    whatsappNumber: '917986851137',
    formType: 'full',
    notes: 'Vishesh roop se design ki gayi senior mobility & vitality training. 16 gentle progressive sessions on alternate days.',
    razorpayKeyId: 'rzp_test_51Z11122233344',
    createdAt: new Date(Date.now() - 86400000 / 2).toISOString(),
    status: 'active',
    submissionCount: 0,
  },
  {
    id: 'mma-form-104',
    amount: 20000,
    upiId: '7668598281@ybl',
    payeeName: 'MMA Trainers Academy',
    programTitle: 'Family Group Training Plan (4 Members)',
    whatsappNumber: '917986851137',
    formType: 'full',
    notes: 'Complete package for up to 4 family members. 16 sessions on alternate days (MMA, Boxing, Kickboxing, or Self Defence).',
    razorpayKeyId: 'rzp_test_51Z11122233344',
    createdAt: new Date().toISOString(),
    status: 'active',
    submissionCount: 0,
  },
  {
    id: 'mma-quick-105',
    amount: 999,
    upiId: '7668598281@ybl',
    payeeName: 'MMA Trainers Academy',
    programTitle: 'Exclusive Trial Session (Entry-Level Testing & Consultation)',
    whatsappNumber: '917986851137',
    formType: 'quick',
    notes: 'Entry-level fitness assessment, movement screening, and 1-on-1 consultation with Head Coach.',
    createdAt: new Date().toISOString(),
    status: 'active',
    submissionCount: 0,
  },
];

const INITIAL_SUBMISSIONS: ClientSubmission[] = [
  {
    id: 'sub-2026-001',
    formId: 'mma-form-101',
    programTitle: 'Brazilian Jiu-Jitsu (Monthly Unlimited)',
    amount: 3500,
    upiId: 'mmatrainers@upi',
    fullName: 'Rahul Sharma',
    phone: '+919876543210',
    email: 'rahul.sharma@example.com',
    age: '28',
    gender: 'Male',
    emergencyContactName: 'Priya Sharma (Spouse)',
    emergencyContactPhone: '+919876511223',
    experienceLevel: 'Beginner (< 1 Year)',
    fitnessGoals: 'Learn self defense, build core endurance, weight loss',
    medicalConditions: 'Minor lower back tightness, no surgeries',
    utrNumber: '428910394821',
    paymentMethod: 'razorpay',
    razorpayPaymentId: 'pay_RzpSample001',
    status: 'verified',
    adminNotes: 'Verified via Razorpay (pay_RzpSample001). Gi size A2 assigned. Batch: Evening 7 PM.',
    submittedAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'sub-2026-002',
    formId: 'mma-form-102',
    programTitle: 'Muay Thai & Kickboxing - Fighter Bootcamp',
    amount: 4500,
    upiId: 'mmatrainers@upi',
    fullName: 'Ananya Verma',
    phone: '+919823456789',
    email: 'ananya.v@example.com',
    age: '24',
    gender: 'Female',
    emergencyContactName: 'Kunal Verma (Brother)',
    emergencyContactPhone: '+919823499887',
    experienceLevel: 'No Experience',
    fitnessGoals: 'Cardio conditioning, striking technique & agility',
    medicalConditions: 'None',
    utrNumber: '428987110023',
    paymentMethod: 'razorpay',
    razorpayPaymentId: 'pay_RzpSample002',
    status: 'pending',
    adminNotes: 'Paid via Razorpay. Need to verify medical check.',
    submittedAt: new Date(Date.now() - 3600000 * 4).toISOString(),
  },
];

export const formStorage = {
  // Sync state from Supabase in the background
  async syncFromSupabase(): Promise<void> {
    try {
      // 1. Sync Forms
      const { data: dbForms, error: formsError } = await supabase
        .from('payment_forms')
        .select('*')
        .order('created_at', { ascending: false });

      if (!formsError && dbForms && dbForms.length > 0) {
        const mappedForms: PaymentFormConfig[] = dbForms.map((row: any) => {
          const isQuick = row.form_type === 'quick' || (typeof row.notes === 'string' && row.notes.includes('[QUICK_PAY]'));
          const cleanNotes = row.notes ? row.notes.replace('[QUICK_PAY] ', '').replace('[QUICK_PAY]', '').trim() : undefined;
          return {
            id: row.id,
            amount: Number(row.amount),
            upiId: row.upi_id || 'mmatrainers@upi',
            payeeName: row.payee_name || 'MMA Trainers Academy',
            programTitle: row.program_title,
            whatsappNumber: row.whatsapp_number || '919876543210',
            formType: isQuick ? 'quick' : 'full',
            clientName: row.client_name || undefined,
            notes: cleanNotes || undefined,
            razorpayKeyId: row.razorpay_key_id || undefined,
            status: row.status || 'active',
            submissionCount: row.submission_count || 0,
            createdAt: row.created_at,
          };
        });
        localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(mappedForms));
      }

      // 2. Sync Submissions
      const { data: dbSubmissions, error: subsError } = await supabase
        .from('client_submissions')
        .select('*')
        .order('submitted_at', { ascending: false });

      if (!subsError && dbSubmissions && dbSubmissions.length > 0) {
        const mappedSubs: ClientSubmission[] = dbSubmissions.map((row: any) => ({
          id: row.id,
          formId: row.form_id,
          programTitle: row.program_title,
          amount: Number(row.amount),
          upiId: row.upi_id || 'mmatrainers@upi',
          fullName: row.full_name,
          phone: row.phone,
          email: row.email,
          age: row.age || undefined,
          gender: row.gender || undefined,
          emergencyContactName: row.emergency_contact_name || undefined,
          emergencyContactPhone: row.emergency_contact_phone || undefined,
          experienceLevel: row.experience_level || undefined,
          fitnessGoals: row.fitness_goals || undefined,
          medicalConditions: row.medical_conditions || undefined,
          utrNumber: row.utr_number || undefined,
          screenshotUrl: row.screenshot_url || undefined,
          screenshotFileName: row.screenshot_file_name || undefined,
          paymentMethod: row.payment_method || 'razorpay',
          razorpayPaymentId: row.razorpay_payment_id || undefined,
          razorpayOrderId: row.razorpay_order_id || undefined,
          razorpaySignature: row.razorpay_signature || undefined,
          status: row.status || 'pending',
          adminNotes: row.admin_notes || undefined,
          submittedAt: row.submitted_at,
        }));
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(mappedSubs));
      }

      // 3. Sync Agency Settings
      const { data: dbSettings, error: settingsError } = await supabase
        .from('agency_settings')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (!settingsError && dbSettings) {
        const mappedSettings: AgencySettings = {
          id: dbSettings.id || 'default',
          agencyName: dbSettings.agency_name || 'MMA Trainers Academy',
          upiId: dbSettings.upi_id || '7668598281@ybl',
          whatsappNumber: dbSettings.whatsapp_number || '917986851137',
          razorpayKeyId: dbSettings.razorpay_key_id || undefined,
          updatedAt: dbSettings.updated_at,
        };
        localStorage.setItem(STORAGE_KEYS.AGENCY_SETTINGS, JSON.stringify(mappedSettings));
        localStorage.setItem(STORAGE_KEYS.DEFAULT_UPI, mappedSettings.upiId);
        localStorage.setItem(STORAGE_KEYS.DEFAULT_PHONE, mappedSettings.whatsappNumber);
        if (mappedSettings.razorpayKeyId) {
          localStorage.setItem(STORAGE_KEYS.DEFAULT_RZP_KEY, mappedSettings.razorpayKeyId);
        }
      }

      this.notifySubscribers();
    } catch (e) {
      console.warn('Supabase sync skipped or tables not yet created:', e);
    }
  },

  // Get all forms (instant from local cache, triggers async Supabase check)
  getForms(): PaymentFormConfig[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.FORMS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(INITIAL_FORMS));
        return INITIAL_FORMS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading forms from localStorage', e);
      return INITIAL_FORMS;
    }
  },

  // Get specific form by ID from local cache
  getFormById(id: string): PaymentFormConfig | null {
    const forms = this.getForms();
    return forms.find((f) => f.id === id) || null;
  },

  // Get specific form by ID asynchronously (checks cache first, then fetches directly from Supabase)
  async getFormByIdAsync(id: string): Promise<PaymentFormConfig | null> {
    // 1. Check local cache first
    const cached = this.getFormById(id);
    if (cached) return cached;

    // 2. Fetch directly from Supabase payment_forms table
    try {
      const { data, error } = await supabase
        .from('payment_forms')
        .select('*')
        .eq('id', id)
        .maybeSingle();

      if (!error && data) {
        const isQuick =
          data.form_type === 'quick' ||
          (typeof data.notes === 'string' && data.notes.includes('[QUICK_PAY]'));
        const cleanNotes = data.notes
          ? data.notes.replace('[QUICK_PAY] ', '').replace('[QUICK_PAY]', '').trim()
          : undefined;

        const config: PaymentFormConfig = {
          id: data.id,
          amount: Number(data.amount),
          upiId: data.upi_id || 'mmatrainers@upi',
          payeeName: data.payee_name || 'MMA Trainers Academy',
          programTitle: data.program_title,
          whatsappNumber: data.whatsapp_number || '919876543210',
          formType: isQuick ? 'quick' : 'full',
          clientName: data.client_name || undefined,
          notes: cleanNotes || undefined,
          razorpayKeyId: data.razorpay_key_id || undefined,
          status: data.status || 'active',
          submissionCount: data.submission_count || 0,
          createdAt: data.created_at,
        };

        // Cache it in localStorage so future lookups are instant
        const forms = this.getForms();
        const existingIdx = forms.findIndex((f) => f.id === config.id);
        if (existingIdx >= 0) {
          forms[existingIdx] = config;
        } else {
          forms.unshift(config);
        }
        localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
        this.notifySubscribers();

        return config;
      }
    } catch (err) {
      console.warn('Error fetching form directly from Supabase:', err);
    }

    return null;
  },

  // Create and save new form
  createForm(
    formData: Omit<PaymentFormConfig, 'id' | 'createdAt' | 'status' | 'submissionCount'>
  ): PaymentFormConfig {
    const forms = this.getForms();
    const formType = formData.formType || 'full';
    const newForm: PaymentFormConfig = {
      ...formData,
      formType,
      id: `mma-${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 6)}`,
      createdAt: new Date().toISOString(),
      status: 'active',
      submissionCount: 0,
    };
    forms.unshift(newForm);
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));

    // Save defaults for future forms
    if (formData.upiId) localStorage.setItem(STORAGE_KEYS.DEFAULT_UPI, formData.upiId);
    if (formData.whatsappNumber) localStorage.setItem(STORAGE_KEYS.DEFAULT_PHONE, formData.whatsappNumber);
    if (formData.razorpayKeyId) localStorage.setItem(STORAGE_KEYS.DEFAULT_RZP_KEY, formData.razorpayKeyId);

    // Asynchronously push to Supabase (prefix [QUICK_PAY] in notes for schema resilience)
    const dbNotes = formType === 'quick' 
      ? `[QUICK_PAY] ${newForm.notes || ''}`.trim() 
      : newForm.notes || null;

    supabase
      .from('payment_forms')
      .insert({
        id: newForm.id,
        amount: newForm.amount,
        upi_id: newForm.upiId,
        payee_name: newForm.payeeName,
        program_title: newForm.programTitle,
        whatsapp_number: newForm.whatsappNumber,
        client_name: newForm.clientName || null,
        notes: dbNotes,
        razorpay_key_id: newForm.razorpayKeyId || null,
        status: newForm.status,
        submission_count: 0,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase form insert note:', error.message);
      });

    this.notifySubscribers();
    return newForm;
  },

  // Delete a form
  deleteForm(id: string): void {
    const forms = this.getForms().filter((f) => f.id !== id);
    localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));

    // Delete in Supabase
    supabase.from('payment_forms').delete().eq('id', id).then();

    this.notifySubscribers();
  },

  // Get all submissions
  getSubmissions(): ClientSubmission[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SUBMISSIONS);
      if (!data) {
        localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(INITIAL_SUBMISSIONS));
        return INITIAL_SUBMISSIONS;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading submissions from localStorage', e);
      return INITIAL_SUBMISSIONS;
    }
  },

  // Save a client submission
  saveSubmission(
    submissionData: Omit<ClientSubmission, 'id' | 'submittedAt' | 'status'> & {
      status?: 'pending' | 'verified' | 'rejected';
    }
  ): ClientSubmission {
    const submissions = this.getSubmissions();
    const newSubmission: ClientSubmission = {
      ...submissionData,
      id: `sub-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      submittedAt: new Date().toISOString(),
      status: submissionData.status || (submissionData.razorpayPaymentId ? 'verified' : 'pending'),
    };

    submissions.unshift(newSubmission);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    // Increment form submission count in local cache
    const forms = this.getForms();
    const targetForm = forms.find((f) => f.id === submissionData.formId);
    if (targetForm) {
      targetForm.submissionCount = (targetForm.submissionCount || 0) + 1;
      localStorage.setItem(STORAGE_KEYS.FORMS, JSON.stringify(forms));
    }

    // Push to Supabase client_submissions table
    supabase
      .from('client_submissions')
      .insert({
        id: newSubmission.id,
        form_id: newSubmission.formId,
        program_title: newSubmission.programTitle,
        amount: newSubmission.amount,
        upi_id: newSubmission.upiId || null,
        full_name: newSubmission.fullName,
        phone: newSubmission.phone,
        email: newSubmission.email,
        age: newSubmission.age || null,
        gender: newSubmission.gender || null,
        emergency_contact_name: newSubmission.emergencyContactName || null,
        emergency_contact_phone: newSubmission.emergencyContactPhone || null,
        experience_level: newSubmission.experienceLevel || null,
        fitness_goals: newSubmission.fitnessGoals || null,
        medical_conditions: newSubmission.medicalConditions || null,
        utr_number: newSubmission.utrNumber || null,
        screenshot_url: newSubmission.screenshotUrl || null,
        screenshot_file_name: newSubmission.screenshotFileName || null,
        payment_method: newSubmission.paymentMethod || 'razorpay',
        razorpay_payment_id: newSubmission.razorpayPaymentId || null,
        razorpay_order_id: newSubmission.razorpayOrderId || null,
        razorpay_signature: newSubmission.razorpaySignature || null,
        status: newSubmission.status,
        admin_notes: newSubmission.adminNotes || null,
        submitted_at: newSubmission.submittedAt,
      })
      .then(({ error }) => {
        if (error) console.warn('Supabase submission insert note:', error.message);
      });

    this.notifySubscribers();
    return newSubmission;
  },

  // Update submission status / admin notes
  updateSubmission(
    id: string,
    updates: Partial<Pick<ClientSubmission, 'status' | 'adminNotes'>>
  ): void {
    const submissions = this.getSubmissions().map((sub) => {
      if (sub.id === id) {
        return { ...sub, ...updates };
      }
      return sub;
    });
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    // Update in Supabase
    supabase
      .from('client_submissions')
      .update({
        status: updates.status,
        admin_notes: updates.adminNotes,
      })
      .eq('id', id)
      .then();

    this.notifySubscribers();
  },

  // Delete submission
  deleteSubmission(id: string): void {
    const submissions = this.getSubmissions().filter((s) => s.id !== id);
    localStorage.setItem(STORAGE_KEYS.SUBMISSIONS, JSON.stringify(submissions));

    // Delete in Supabase
    supabase.from('client_submissions').delete().eq('id', id).then();

    this.notifySubscribers();
  },

  // Get Admin statistics
  getStats(): AdminStats {
    const forms = this.getForms();
    const submissions = this.getSubmissions();

    const totalRevenue = submissions
      .filter((s) => s.status !== 'rejected')
      .reduce((sum, s) => sum + (s.amount || 0), 0);

    const pendingVerifications = submissions.filter((s) => s.status === 'pending').length;

    return {
      totalForms: forms.length,
      totalSubmissions: submissions.length,
      totalRevenue,
      pendingVerifications,
    };
  },

  // Get Agency Settings (Instant from local cache)
  getAgencySettings(): AgencySettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.AGENCY_SETTINGS);
      if (data) {
        return JSON.parse(data);
      }
      const upi = localStorage.getItem(STORAGE_KEYS.DEFAULT_UPI) || DEFAULT_AGENCY_SETTINGS.upiId;
      const phone = localStorage.getItem(STORAGE_KEYS.DEFAULT_PHONE) || DEFAULT_AGENCY_SETTINGS.whatsappNumber;
      const rzp = localStorage.getItem(STORAGE_KEYS.DEFAULT_RZP_KEY) || DEFAULT_AGENCY_SETTINGS.razorpayKeyId;
      const merged: AgencySettings = {
        ...DEFAULT_AGENCY_SETTINGS,
        upiId: upi,
        whatsappNumber: phone,
        razorpayKeyId: rzp,
      };
      localStorage.setItem(STORAGE_KEYS.AGENCY_SETTINGS, JSON.stringify(merged));
      return merged;
    } catch (e) {
      return DEFAULT_AGENCY_SETTINGS;
    }
  },

  // Save Agency Settings (both in localStorage and Supabase database)
  async saveAgencySettings(settings: Partial<AgencySettings>): Promise<AgencySettings> {
    const current = this.getAgencySettings();
    const updated: AgencySettings = {
      ...current,
      ...settings,
      updatedAt: new Date().toISOString(),
    };

    localStorage.setItem(STORAGE_KEYS.AGENCY_SETTINGS, JSON.stringify(updated));
    if (updated.upiId) localStorage.setItem(STORAGE_KEYS.DEFAULT_UPI, updated.upiId);
    if (updated.whatsappNumber) localStorage.setItem(STORAGE_KEYS.DEFAULT_PHONE, updated.whatsappNumber);
    if (updated.razorpayKeyId) localStorage.setItem(STORAGE_KEYS.DEFAULT_RZP_KEY, updated.razorpayKeyId);

    // Asynchronously push to Supabase agency_settings table
    try {
      await supabase.from('agency_settings').upsert({
        id: 'default',
        agency_name: updated.agencyName,
        upi_id: updated.upiId,
        whatsapp_number: updated.whatsappNumber,
        razorpay_key_id: updated.razorpayKeyId || null,
        updated_at: updated.updatedAt,
      });
    } catch (err) {
      console.warn('Supabase agency_settings upsert note:', err);
    }

    this.notifySubscribers();
    return updated;
  },

  // Get default saved values
  getDefaults() {
    const agency = this.getAgencySettings();
    return {
      defaultAgencyName: agency.agencyName || 'MMA Trainers Academy',
      defaultUpi: agency.upiId || '7668598281@ybl',
      defaultPhone: agency.whatsappNumber || '917986851137',
      defaultRazorpayKey: agency.razorpayKeyId || 'rzp_test_51Z11122233344',
    };
  },

  // Cross-tab and Cloud Realtime synchronization
  notifySubscribers() {
    window.dispatchEvent(new Event('mma_storage_updated'));
  },

  subscribeToUpdates(callback: () => void): () => void {
    const handleStorage = (e: StorageEvent) => {
      if (
        e.key === STORAGE_KEYS.FORMS ||
        e.key === STORAGE_KEYS.SUBMISSIONS ||
        e.key === STORAGE_KEYS.AGENCY_SETTINGS
      ) {
        callback();
      }
    };
    const handleCustom = () => callback();

    window.addEventListener('storage', handleStorage);
    window.addEventListener('mma_storage_updated', handleCustom);

    // Initial background sync from Supabase
    this.syncFromSupabase();

    return () => {
      window.removeEventListener('storage', handleStorage);
      window.removeEventListener('mma_storage_updated', handleCustom);
    };
  },

  // Export submissions to CSV download
  exportSubmissionsCSV(): void {
    const submissions = this.getSubmissions();
    if (submissions.length === 0) {
      alert('No submissions to export');
      return;
    }

    const headers = [
      'Submission ID',
      'Date',
      'Customer Name',
      'Phone',
      'Email',
      'Age',
      'Gender',
      'Program',
      'Amount (INR)',
      'Payment Method',
      'Razorpay Payment ID',
      'UPI ID',
      'UTR Number',
      'Status',
      'Emergency Contact',
      'Emergency Phone',
      'Experience',
      'Fitness Goals',
      'Medical Notes',
      'Admin Notes',
    ];

    const rows = submissions.map((s) => [
      s.id,
      new Date(s.submittedAt).toLocaleString(),
      `"${(s.fullName || '').replace(/"/g, '""')}"`,
      `"${s.phone || ''}"`,
      `"${s.email || ''}"`,
      s.age || '',
      s.gender || '',
      `"${(s.programTitle || '').replace(/"/g, '""')}"`,
      s.amount,
      s.paymentMethod || 'razorpay',
      `"${s.razorpayPaymentId || ''}"`,
      s.upiId,
      `"${s.utrNumber || ''}"`,
      s.status,
      `"${(s.emergencyContactName || '').replace(/"/g, '""')}"`,
      `"${s.emergencyContactPhone || ''}"`,
      `"${(s.experienceLevel || '').replace(/"/g, '""')}"`,
      `"${(s.fitnessGoals || '').replace(/"/g, '""')}"`,
      `"${(s.medicalConditions || '').replace(/"/g, '""')}"`,
      `"${(s.adminNotes || '').replace(/"/g, '""')}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mma_client_submissions_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  // Export complete JSON backup
  exportAllJSON(): void {
    const data = {
      forms: this.getForms(),
      submissions: this.getSubmissions(),
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `mma_database_backup_${new Date().toISOString().slice(0, 10)}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },
};
