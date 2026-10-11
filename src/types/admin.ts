export interface PaymentFormConfig {
  id: string;
  amount: number;
  upiId: string;
  payeeName: string;
  programTitle: string;
  whatsappNumber: string;
  formType?: 'full' | 'quick';
  clientName?: string;
  notes?: string;
  razorpayKeyId?: string;
  createdAt: string;
  expiresAt?: string;
  status: 'active' | 'archived';
  submissionCount?: number;
}

export interface ClientSubmission {
  id: string;
  formId: string;
  programTitle: string;
  amount: number;
  upiId: string;
  fullName: string;
  phone: string;
  email: string;
  age?: string;
  gender?: string;
  emergencyContactName?: string;
  emergencyContactPhone?: string;
  experienceLevel?: string;
  fitnessGoals?: string;
  medicalConditions?: string;
  utrNumber?: string;
  screenshotUrl?: string; // base64 or object url
  screenshotFileName?: string;
  paymentMethod?: 'razorpay' | 'upi';
  razorpayPaymentId?: string;
  razorpayOrderId?: string;
  razorpaySignature?: string;
  status: 'pending' | 'verified' | 'rejected';
  adminNotes?: string;
  submittedAt: string;
}

export interface AdminStats {
  totalForms: number;
  totalSubmissions: number;
  totalRevenue: number;
  pendingVerifications: number;
}

export interface AgencySettings {
  id?: string;
  agencyName: string;
  upiId: string;
  whatsappNumber: string;
  razorpayKeyId?: string;
  updatedAt?: string;
}
