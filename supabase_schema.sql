-- ==============================================================================
-- MMA TRAINERS ACADEMY: SUPABASE DATABASE INITIALIZATION SCRIPT
-- Run this complete script in your Supabase SQL Editor (Dashboard > SQL Editor)
-- ==============================================================================

-- 1. Create payment_forms table
CREATE TABLE IF NOT EXISTS public.payment_forms (
    id TEXT PRIMARY KEY,
    amount NUMERIC(10, 2) NOT NULL,
    upi_id TEXT DEFAULT 'mmatrainers@upi',
    payee_name TEXT DEFAULT 'MMA Trainers Academy',
    program_title TEXT NOT NULL,
    whatsapp_number TEXT NOT NULL DEFAULT '919876543210',
    client_name TEXT,
    notes TEXT,
    razorpay_key_id TEXT,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived')),
    submission_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create client_submissions table
CREATE TABLE IF NOT EXISTS public.client_submissions (
    id TEXT PRIMARY KEY,
    form_id TEXT REFERENCES public.payment_forms(id) ON DELETE SET NULL,
    program_title TEXT NOT NULL,
    amount NUMERIC(10, 2) NOT NULL,
    upi_id TEXT,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    email TEXT NOT NULL,
    age TEXT,
    gender TEXT,
    emergency_contact_name TEXT,
    emergency_contact_phone TEXT,
    experience_level TEXT,
    fitness_goals TEXT,
    medical_conditions TEXT,
    utr_number TEXT,
    screenshot_url TEXT,
    screenshot_file_name TEXT,
    payment_method TEXT DEFAULT 'razorpay',
    razorpay_payment_id TEXT,
    razorpay_order_id TEXT,
    razorpay_signature TEXT,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'verified', 'rejected')),
    admin_notes TEXT,
    submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Indexes for fast queries
CREATE INDEX IF NOT EXISTS idx_payment_forms_status ON public.payment_forms(status);
CREATE INDEX IF NOT EXISTS idx_client_submissions_form_id ON public.client_submissions(form_id);
CREATE INDEX IF NOT EXISTS idx_client_submissions_status ON public.client_submissions(status);
CREATE INDEX IF NOT EXISTS idx_client_submissions_submitted_at ON public.client_submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_client_submissions_email ON public.client_submissions(email);
CREATE INDEX IF NOT EXISTS idx_client_submissions_phone ON public.client_submissions(phone);
CREATE INDEX IF NOT EXISTS idx_client_submissions_razorpay ON public.client_submissions(razorpay_payment_id);

-- 4. Enable Row Level Security (RLS)
ALTER TABLE public.payment_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.client_submissions ENABLE ROW LEVEL SECURITY;

-- 5. RLS Policies
-- Payment Forms: Allow anyone to read active forms so shared links load
DROP POLICY IF EXISTS "Public can view payment forms" ON public.payment_forms;
CREATE POLICY "Public can view payment forms" 
ON public.payment_forms FOR SELECT 
USING (true);

-- Payment Forms: Allow management (insert, update, delete)
DROP POLICY IF EXISTS "Allow manage payment forms" ON public.payment_forms;
CREATE POLICY "Allow manage payment forms" 
ON public.payment_forms FOR ALL 
USING (true);

-- Client Submissions: Anyone can submit registration details (Client Form submission)
DROP POLICY IF EXISTS "Public can submit registration" ON public.client_submissions;
CREATE POLICY "Public can submit registration" 
ON public.client_submissions FOR INSERT 
WITH CHECK (true);

-- Client Submissions: Allow select, update, delete for viewing in admin panel
DROP POLICY IF EXISTS "Allow manage submissions" ON public.client_submissions;
CREATE POLICY "Allow manage submissions" 
ON public.client_submissions FOR ALL 
USING (true);

-- 6. Trigger to automatically increment submission_count when a client submits
CREATE OR REPLACE FUNCTION public.handle_submission_count_increment()
RETURNS TRIGGER AS $$
BEGIN
    IF NEW.form_id IS NOT NULL THEN
        UPDATE public.payment_forms
        SET submission_count = submission_count + 1
        WHERE id = NEW.form_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trigger_increment_submission_count ON public.client_submissions;
CREATE TRIGGER trigger_increment_submission_count
AFTER INSERT ON public.client_submissions
FOR EACH ROW
EXECUTE FUNCTION public.handle_submission_count_increment();

-- 7. Enable Realtime Replication for instant multi-tab & multi-device sync
ALTER PUBLICATION supabase_realtime ADD TABLE public.payment_forms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.client_submissions;

-- 8. Seed Sample Starter Forms
INSERT INTO public.payment_forms (id, amount, upi_id, payee_name, program_title, whatsapp_number, client_name, notes, status, submission_count)
VALUES 
(
    'mma-form-101', 
    3500.00, 
    'mmatrainers@upi', 
    'MMA Trainers Academy', 
    'Brazilian Jiu-Jitsu (Monthly Unlimited)', 
    '919876543210', 
    'Rahul Sharma', 
    'Includes loaner Gi, locker access, and 6 days/week open mat sessions.', 
    'active', 
    1
),
(
    'mma-form-102', 
    4500.00, 
    'mmatrainers@upi', 
    'MMA Trainers Academy', 
    'Muay Thai & Kickboxing - Fighter Bootcamp', 
    '919876543210', 
    NULL, 
    'Includes hand wraps loaner, 5 sessions per week with head striking coach.', 
    'active', 
    1
),
(
    'mma-form-103', 
    7500.00, 
    'mmatrainers@upi', 
    'MMA Trainers Academy', 
    'All-Access MMA Championship Quarterly Pass', 
    '919876543210', 
    NULL, 
    '3 months full access to BJJ, Striking, Wrestling & Conditioning.', 
    'active', 
    0
)
ON CONFLICT (id) DO NOTHING;

-- 9. Seed Sample Starter Submissions
INSERT INTO public.client_submissions (id, form_id, program_title, amount, upi_id, full_name, phone, email, age, gender, emergency_contact_name, emergency_contact_phone, experience_level, fitness_goals, medical_conditions, utr_number, payment_method, razorpay_payment_id, status, admin_notes)
VALUES 
(
    'sub-2026-001',
    'mma-form-101',
    'Brazilian Jiu-Jitsu (Monthly Unlimited)',
    3500.00,
    'mmatrainers@upi',
    'Rahul Sharma',
    '+91 98765 43210',
    'rahul.sharma@example.com',
    '28',
    'Male',
    'Priya Sharma (Spouse)',
    '+91 98765 11223',
    'Beginner (< 1 Year)',
    'Learn self defense, build core endurance',
    'Minor lower back tightness',
    '428910394821',
    'razorpay',
    'pay_RzpSample001',
    'verified',
    'Verified via Razorpay. Gi size A2 assigned. Batch: Evening 7 PM.'
),
(
    'sub-2026-002',
    'mma-form-102',
    'Muay Thai & Kickboxing - Fighter Bootcamp',
    4500.00,
    'mmatrainers@upi',
    'Ananya Verma',
    '+91 98234 56789',
    'ananya.v@example.com',
    '24',
    'Female',
    'Kunal Verma (Brother)',
    '+91 98234 99887',
    'No Experience',
    'Cardio conditioning, striking technique & agility',
    'None',
    '428987110023',
    'razorpay',
    'pay_RzpSample002',
    'pending',
    'Paid via Razorpay. Need to assign glove size.'
)
ON CONFLICT (id) DO NOTHING;
