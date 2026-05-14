import React from 'react';
import { motion } from 'motion/react';
import { cn } from '@/src/lib/utils';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: string;
  vertical?: boolean;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 32, 
  className = "", 
  showText = true,
  textSize = "text-xl",
  vertical = false
}) => {
  return (
    <div className={cn(
      "flex items-center gap-3",
      vertical && "flex-col",
      className
    )}>
      <motion.div 
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          viewBox="0 0 40 40"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full"
        >
          <defs>
            <linearGradient id="logo-grad" x1="0" y1="0" x2="40" y2="40">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>
          <rect width="40" height="40" rx="10" fill="#0a0b0d" />
          <path
            d="M12 10L20 22L28 10"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#glow)"
          />
          <path
            d="M20 22V32"
            stroke="url(#logo-grad)"
            strokeWidth="4"
            strokeLinecap="round"
            filter="url(#glow)"
          />
          <rect x="24" y="22" width="2" height="6" rx="1" fill="#10b981" />
          <rect x="28" y="18" width="2" height="10" rx="1" fill="#10b981" />
          <rect x="32" y="24" width="2" height="4" rx="1" fill="#ef4444" />
        </svg>
        
        {/* Subtle Glow effect */}
        <div className="absolute inset-0 bg-blue-500/10 blur-xl rounded-full -z-10" />
      </motion.div>

      {showText && (
        <span className={cn(
          "font-display font-bold text-white tracking-tighter uppercase italic",
          textSize
        )}>
          YURIKA
        </span>
      )}
    </div>
  );
};
