declare global {
  interface Window {
    Razorpay: any;
  }
}

export interface RazorpayPaymentOptions {
  key?: string;
  amount: number; // in INR rupees
  name: string;
  description: string;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  notes?: Record<string, string>;
  onSuccess: (response: {
    razorpay_payment_id: string;
    razorpay_order_id?: string;
    razorpay_signature?: string;
  }) => void;
  onDismiss?: () => void;
  onError?: (error: any) => void;
}

export const loadRazorpayScript = (): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => {
      console.error('Failed to load Razorpay SDK');
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

export const openRazorpayPayment = async (options: RazorpayPaymentOptions) => {
  const isLoaded = await loadRazorpayScript();
  if (!isLoaded) {
    alert('Failed to initialize Razorpay payment gateway. Please check your internet connection.');
    return;
  }

  // Fallback to configured key or demo test key
  const razorpayKey =
    options.key ||
    import.meta.env.VITE_RAZORPAY_KEY_ID ||
    'rzp_test_51Z11122233344';

  const rzpOptions = {
    key: razorpayKey,
    amount: Math.round(options.amount * 100), // Razorpay takes amount in paise (1 INR = 100 paise)
    currency: 'INR',
    name: options.name || 'MMA Trainers Academy',
    description: options.description || 'Academy Registration Fee',
    image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=128&h=128&fit=crop&crop=faces',
    prefill: {
      name: options.prefill?.name || '',
      email: options.prefill?.email || '',
      contact: options.prefill?.contact || '',
    },
    notes: {
      ...options.notes,
      merchant: 'MMA Trainers Academy',
    },
    theme: {
      color: '#E63B30',
      backdrop_color: 'rgba(0, 0, 0, 0.85)',
    },
    modal: {
      ondismiss: () => {
        if (options.onDismiss) options.onDismiss();
      },
    },
    handler: (response: {
      razorpay_payment_id: string;
      razorpay_order_id?: string;
      razorpay_signature?: string;
    }) => {
      options.onSuccess(response);
    },
  };

  try {
    const rzpInstance = new window.Razorpay(rzpOptions);
    rzpInstance.on('payment.failed', function (response: any) {
      console.error('Razorpay payment failed:', response.error);
      if (options.onError) {
        options.onError(response.error);
      } else {
        alert(`Payment failed: ${response.error.description || response.error.reason}`);
      }
    });
    rzpInstance.open();
  } catch (err) {
    console.error('Error launching Razorpay modal:', err);
    if (options.onError) options.onError(err);
  }
};
