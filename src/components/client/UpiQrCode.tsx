import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Download, ExternalLink, ShieldCheck, Copy, Check } from 'lucide-react';

interface UpiQrCodeProps {
  upiId?: string;
  payeeName?: string;
  amount?: number;
  note?: string;
  size?: number;
  showDirectPayButton?: boolean;
}

export const UpiQrCode: React.FC<UpiQrCodeProps> = ({
  upiId = 'mmatrainers@upi',
  payeeName = 'MMA Trainers Academy',
  amount = 3500,
  note = 'MMA Academy Registration',
  size = 220,
  showDirectPayButton = true,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);

  const safeAmount = Number(amount) || 0;
  const safeUpiId = upiId || 'mmatrainers@upi';
  const safePayeeName = payeeName || 'MMA Trainers Academy';
  const safeNote = note || 'MMA Registration';

  // Construct standard UPI URI
  const upiUri = `upi://pay?pa=${encodeURIComponent(safeUpiId)}&pn=${encodeURIComponent(
    safePayeeName
  )}&am=${safeAmount.toFixed(2)}&cu=INR&tn=${encodeURIComponent(safeNote)}`;

  useEffect(() => {
    try {
      QRCode.toDataURL(upiUri, {
        width: size * 2, // High resolution for retina/mobile displays
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
        errorCorrectionLevel: 'H',
      })
        .then((url) => setQrDataUrl(url))
        .catch((err) => console.error('Failed to generate QR Code:', err));
    } catch (err) {
      console.error('QRCode generation error:', err);
    }
  }, [upiUri, size]);

  const handleCopyUpi = () => {
    navigator.clipboard.writeText(safeUpiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `UPI_QR_${safeAmount}INR_${safeUpiId.replace(/[^a-zA-Z0-9]/g, '_')}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col items-center">
      {/* QR Code Container with sleek sports styling */}
      <div className="relative p-4 sm:p-5 bg-white rounded-2xl shadow-2xl shadow-[#E63B30]/10 border-2 border-[#E63B30]/30 transition-all hover:border-[#E63B30]/70 group">
        {/* Modern Corner Accents */}
        <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-[#E63B30] rounded-tl-sm pointer-events-none" />
        <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-[#E63B30] rounded-tr-sm pointer-events-none" />
        <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-[#E63B30] rounded-bl-sm pointer-events-none" />
        <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-[#E63B30] rounded-br-sm pointer-events-none" />

        {/* QR Image */}
        {qrDataUrl ? (
          <div className="relative">
            <img
              src={qrDataUrl}
              alt={`UPI QR code for ₹${safeAmount}`}
              width={size}
              height={size}
              className="block rounded-lg mx-auto"
            />
            {/* Center Gym Brand Watermark Icon */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-10 h-10 bg-black/90 text-white rounded-lg border border-[#E63B30] flex items-center justify-center font-['Oswald'] font-black text-xs tracking-wider shadow-lg">
                MMA
              </div>
            </div>
          </div>
        ) : (
          <div
            style={{ width: size, height: size }}
            className="flex items-center justify-center bg-neutral-100 rounded-lg animate-pulse text-xs text-neutral-400 font-medium"
          >
            Generating UPI QR...
          </div>
        )}

        {/* Amount Pill below QR */}
        <div className="mt-3 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#0D0D0D] text-white rounded-full text-xs font-bold font-mono tracking-wide border border-black/10">
            <span className="text-neutral-400">PAY:</span>
            <span className="text-[#E63B30] font-black text-sm">
              ₹{safeAmount.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Payee Info & Copy UPI ID */}
      <div className="mt-4 w-full max-w-sm text-center">
        <div className="flex items-center justify-between gap-2 px-3.5 py-2 bg-white/5 border border-white/10 rounded-xl">
          <div className="text-left overflow-hidden">
            <span className="block text-[10px] uppercase tracking-wider text-neutral-400 font-medium">
              UPI ID ({safePayeeName})
            </span>
            <span className="font-mono text-xs sm:text-sm font-semibold text-white truncate block">
              {safeUpiId}
            </span>
          </div>
          <button
            type="button"
            onClick={handleCopyUpi}
            className="shrink-0 p-2 hover:bg-white/10 text-neutral-300 hover:text-white rounded-lg transition-colors flex items-center gap-1 text-xs cursor-pointer"
            title="Copy UPI ID"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" />
                <span className="text-emerald-400 text-[11px] font-medium hidden sm:inline">Copied</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span className="text-[11px] font-medium hidden sm:inline">Copy</span>
              </>
            )}
          </button>
        </div>

        {/* Accepted UPI Apps Strip */}
        <div className="mt-3 flex items-center justify-center gap-2 flex-wrap text-[11px] text-neutral-400">
          <span className="flex items-center gap-1 text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" /> Instant UPI:
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
            Google Pay
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
            PhonePe
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
            Paytm
          </span>
          <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-neutral-300 font-mono text-[10px]">
            BHIM
          </span>
        </div>

        {/* Mobile Deep Link Button & Download */}
        <div className="mt-3 flex items-center justify-center gap-2">
          {showDirectPayButton && (
            <a
              href={upiUri}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2.5 px-4 bg-[#E63B30] hover:bg-[#D32F2F] text-white rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-md shadow-[#E63B30]/30 active:scale-95"
            >
              <span>Pay via UPI App</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={handleDownloadQr}
            className="p-2.5 bg-white/10 hover:bg-white/15 text-white rounded-xl transition-colors border border-white/10 cursor-pointer"
            title="Download QR Code"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
