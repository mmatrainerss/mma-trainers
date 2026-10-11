import React from 'react';
import { motion } from 'motion/react';
import { Shield, Sparkles, User, Dumbbell, Award, Flame } from 'lucide-react';

interface MediaPlaceholderProps {
  aspectRatio?: string; // e.g. 'aspect-[4/3]', 'aspect-[16/9]', 'aspect-[3/4]'
  className?: string;
  badge?: string;
  label?: string;
  sublabel?: string;
  type?: 'hero' | 'program' | 'coach' | 'about' | 'review' | 'map' | 'facility';
  icon?: 'shield' | 'flame' | 'award' | 'user' | 'dumbbell';
  hoverZoom?: boolean;
}

export const MediaPlaceholder: React.FC<MediaPlaceholderProps> = ({
  aspectRatio = 'aspect-[4/3]',
  className = '',
  badge,
  label,
  sublabel,
  type = 'program',
  icon = 'shield',
  hoverZoom = true
}) => {
  const getIcon = () => {
    switch (icon) {
      case 'flame':
        return <Flame className="w-8 h-8 text-[#E63B30]/80 stroke-[1.5]" />;
      case 'award':
        return <Award className="w-8 h-8 text-[#E63B30]/80 stroke-[1.5]" />;
      case 'user':
        return <User className="w-8 h-8 text-[#E63B30]/80 stroke-[1.5]" />;
      case 'dumbbell':
        return <Dumbbell className="w-8 h-8 text-[#E63B30]/80 stroke-[1.5]" />;
      case 'shield':
      default:
        return <Shield className="w-8 h-8 text-[#E63B30]/80 stroke-[1.5]" />;
    }
  };

  return (
    <motion.div
      whileHover={hoverZoom ? { scale: 1.025 } : undefined}
      transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      className={`relative overflow-hidden bg-neutral-900 border border-white/10 rounded-xl group select-none ${aspectRatio} ${className}`}
    >
      {/* Background Graphic Pattern: subtle athletic dot/diagonal mesh */}
      <div className="absolute inset-0 bg-[radial-gradient(#262626_1px,transparent_1px)] [background-size:16px_16px] opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
      
      {/* Dynamic lighting gradients */}
      <div className="absolute inset-0 bg-gradient-to-tr from-black/90 via-neutral-900/60 to-black/40" />
      <div className="absolute -bottom-16 -right-16 w-48 h-48 bg-[#E63B30]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#E63B30]/20 transition-all duration-500" />
      
      {/* Subtle martial arts watermark silhouette */}
      <div className="absolute right-4 bottom-4 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
        <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor" className="text-white">
          <polygon points="50,5 95,27 95,73 50,95 5,73 5,27" stroke="currentColor" strokeWidth="2" fill="none" />
          <path d="M50 20 L50 80 M25 35 L75 65 M25 65 L75 35" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>

      {/* Top badges if present */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold tracking-wider uppercase bg-black/80 backdrop-blur-md text-neutral-300 border border-white/10">
            {badge}
          </span>
        </div>
      )}

      {/* Center martial arts placeholder representation */}
      <div className="relative h-full w-full flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center mb-3 group-hover:border-[#E63B30]/40 group-hover:bg-[#E63B30]/10 transition-colors duration-300 shadow-inner">
          {getIcon()}
        </div>
        {label && (
          <p className="text-sm font-semibold tracking-wide text-neutral-200 group-hover:text-white transition-colors">
            {label}
          </p>
        )}
        {sublabel && (
          <p className="text-xs text-neutral-500 mt-1 max-w-[200px] leading-relaxed">
            {sublabel}
          </p>
        )}
        <div className="mt-3 inline-flex items-center gap-1.5 text-[11px] font-mono text-neutral-500 uppercase tracking-widest bg-black/40 px-2 py-0.5 rounded border border-white/5">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E63B30] animate-pulse" />
          IMAGE PLACEHOLDER
        </div>
      </div>
    </motion.div>
  );
};
