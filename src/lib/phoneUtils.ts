/**
 * Indian Phone Number & WhatsApp Optimization Utilities
 * 
 * Ensures:
 * - 10-digit Indian mobile numbers (starts with 6, 7, 8, 9)
 * - Strict removal of whitespace, gaps, dashes, and invalid characters
 * - Proper international format (91XXXXXXXXXX) required by WhatsApp wa.me links
 * - Clean storage (+919876543210 with zero spaces)
 */

/**
 * Cleans user input as they type or paste into a 10-digit mobile input.
 * Strips all spaces, gaps, dashes, +91 prefixes, or leading zeroes.
 * Returns up to 10 pure digits.
 */
export function cleanIndianMobileInput(raw: string): string {
  if (!raw) return '';

  // 1. Remove all non-digits (spaces, dashes, parens, plus, letters)
  let digits = raw.replace(/\D/g, '');

  // 2. If user pasted a 12-digit number starting with 91 (e.g., from +919876543210 or 91 9876543210)
  if (digits.length >= 12 && digits.startsWith('91')) {
    digits = digits.slice(2);
  }

  // 3. If user pasted an 11-digit number starting with 0 (e.g., 09876543210)
  if (digits.length >= 11 && digits.startsWith('0')) {
    digits = digits.slice(1);
  }

  // 4. Limit to max 10 digits
  return digits.slice(0, 10);
}

/**
 * Validates if the given string is a valid 10-digit Indian mobile number.
 * Indian mobile numbers must be 10 digits and start with 6, 7, 8, or 9.
 */
export function isValidIndianMobile(phone: string): boolean {
  if (!phone) return false;
  const digits = cleanIndianMobileInput(phone);
  return /^[6-9]\d{9}$/.test(digits);
}

/**
 * Normalizes any phone number into a 100% valid WhatsApp API number (e.g. 919876543210).
 * WhatsApp requires purely numeric country code + number without spaces, '+', or dashes.
 */
export function getWhatsAppDigits(rawPhone: string | undefined | null): string {
  if (!rawPhone) return '';
  const pureDigits = rawPhone.replace(/\D/g, '');
  if (!pureDigits) return '';

  // Case 1: 10 digits (standard Indian mobile) -> prepend 91
  if (pureDigits.length === 10) {
    return `91${pureDigits}`;
  }

  // Case 2: 11 digits starting with 0 (e.g. 09876543210) -> strip 0 and prepend 91
  if (pureDigits.length === 11 && pureDigits.startsWith('0')) {
    return `91${pureDigits.slice(1)}`;
  }

  // Case 3: 12 digits starting with 91 (e.g. 919876543210) -> already valid
  if (pureDigits.length === 12 && pureDigits.startsWith('91')) {
    return pureDigits;
  }

  // Case 4: Longer than 10 digits, take the last 10 digits and prepend 91
  if (pureDigits.length > 10) {
    const last10 = pureDigits.slice(-10);
    return `91${last10}`;
  }

  // Fallback: prepend 91 if less than 10
  return `91${pureDigits}`;
}

/**
 * Generates an optimized, gapless WhatsApp wa.me link.
 * Example output: https://wa.me/919876543210?text=Hello
 */
export function formatWhatsAppLink(rawPhone: string | undefined | null, messageText?: string): string {
  const cleanNumber = getWhatsAppDigits(rawPhone);
  const encodedText = messageText ? encodeURIComponent(messageText) : '';

  // If no phone number provided, open generic WhatsApp share (NO empty phone param)
  if (!cleanNumber || cleanNumber.length < 10) {
    return encodedText
      ? `https://api.whatsapp.com/send?text=${encodedText}`
      : 'https://api.whatsapp.com/send';
  }

  // With clean numeric phone number (e.g. 919876543210)
  return encodedText
    ? `https://api.whatsapp.com/send?phone=${cleanNumber}&text=${encodedText}`
    : `https://api.whatsapp.com/send?phone=${cleanNumber}`;
}

/**
 * Formats a phone number for clean, standard display without awkward gaps.
 * Example: "+91 9876543210"
 */
export function formatDisplayIndianPhone(rawPhone: string | undefined | null): string {
  if (!rawPhone) return '';
  const digits = rawPhone.replace(/\D/g, '');

  if (digits.length === 10) {
    return `+91 ${digits}`;
  }
  if (digits.length === 12 && digits.startsWith('91')) {
    return `+91 ${digits.slice(2)}`;
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return `+91 ${digits.slice(1)}`;
  }

  return rawPhone.trim();
}

/**
 * Formats a phone number for saving to Supabase / database with zero spaces.
 * Example: "+919876543210"
 */
export function formatPhoneForStorage(rawPhone: string): string {
  if (!rawPhone) return '';
  const digits = cleanIndianMobileInput(rawPhone);
  if (digits.length === 10) {
    return `+91${digits}`;
  }
  const clean = rawPhone.replace(/\s+/g, '');
  return clean.startsWith('+') ? clean : `+91${digits}`;
}
