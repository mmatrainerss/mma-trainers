import React from 'react';

interface RaiLogoProps {
  className?: string;
  theme?: 'dark' | 'light';
}

export const RaiLogo: React.FC<RaiLogoProps> = ({ className = '', theme = 'light' }) => {
  const isLight = theme === 'light';

  return (
    <div className={`flex items-center select-none ${className}`}>
      <div
        className={`flex flex-col items-center justify-center px-2 py-1 rounded border-2 ${
          isLight
            ? 'border-black bg-white text-black'
            : 'border-white bg-black text-white'
        }`}
      >
        <span className="font-['Oswald'] font-black text-lg sm:text-xl tracking-tight leading-none uppercase">
          MMA
        </span>
        <div
          className={`w-full text-center px-1.5 py-[1px] mt-[1px] ${
            isLight ? 'bg-black text-white' : 'bg-[#E63B30] text-white'
          }`}
        >
          <span className="text-[7px] sm:text-[8px] font-black tracking-wider uppercase block leading-none font-sans">
            TRAINERS
          </span>
        </div>
        <span
          className={`text-[5px] sm:text-[6px] tracking-widest uppercase mt-[2px] font-bold ${
            isLight ? 'text-neutral-700' : 'text-neutral-400'
          }`}
        >
          MODERN TRAINING CENTER
        </span>
      </div>
    </div>
  );
};
