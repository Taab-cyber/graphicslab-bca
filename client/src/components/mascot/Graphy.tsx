import { motion } from 'framer-motion';
import type { GraphyMood } from '../../types';

interface GraphyProps {
  mood?: GraphyMood;
  size?: number;
  className?: string;
}

export default function Graphy({ mood = 'happy', size = 120, className = '' }: GraphyProps) {
  const bodyColor = mood === 'celebrating' ? '#00B4D8' : mood === 'thinking' ? '#7B2FBE' : '#3FB950';
  const eyeAnim = mood === 'happy' ? { scaleY: [1, 0.1, 1] } : {};
  const eyeTransition = mood === 'happy' ? { repeat: Infinity, repeatDelay: 3, duration: 0.2 } : {};

  return (
    <motion.svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={className}
      animate={
        mood === 'celebrating'
          ? { y: [0, -8, 0], rotate: [0, -5, 5, 0] }
          : mood === 'thinking'
          ? { rotate: [0, 3, -3, 0] }
          : { y: [0, -4, 0] }
      }
      transition={{
        repeat: Infinity,
        duration: mood === 'celebrating' ? 0.6 : 2,
        ease: 'easeInOut',
      }}
    >
      {/* Body */}
      <rect x="30" y="35" width="60" height="55" rx="12" fill={bodyColor} />
      <rect x="30" y="35" width="60" height="55" rx="12" fill="url(#bodyGrad)" opacity="0.3" />

      {/* Head */}
      <rect x="25" y="10" width="70" height="50" rx="14" fill={bodyColor} />
      <rect x="25" y="10" width="70" height="50" rx="14" fill="url(#headGrad)" opacity="0.3" />

      {/* Antenna */}
      <line x1="60" y1="10" x2="60" y2="2" stroke={bodyColor} strokeWidth="3" />
      <motion.circle
        cx="60" cy="2" r="4"
        fill="#FFD700"
        animate={{ opacity: [1, 0.3, 1] }}
        transition={{ repeat: Infinity, duration: 1 }}
      />

      {/* Eyes */}
      <motion.rect
        x="40" y="24" width="12" height="14" rx="4"
        fill="#0D1117"
        animate={eyeAnim}
        transition={eyeTransition}
      />
      <motion.rect
        x="68" y="24" width="12" height="14" rx="4"
        fill="#0D1117"
        animate={eyeAnim}
        transition={eyeTransition}
      />

      {/* Eye shine */}
      <circle cx="44" cy="27" r="3" fill="white" opacity="0.8" />
      <circle cx="72" cy="27" r="3" fill="white" opacity="0.8" />

      {/* Mouth */}
      {mood === 'happy' || mood === 'celebrating' ? (
        <path d="M 45 44 Q 60 56 75 44" fill="none" stroke="#0D1117" strokeWidth="3" strokeLinecap="round" />
      ) : (
        <rect x="48" y="42" width="24" height="4" rx="2" fill="#0D1117" />
      )}

      {/* Arms */}
      {mood === 'celebrating' ? (
        <>
          <motion.rect
            x="12" y="30" width="18" height="8" rx="4" fill={bodyColor}
            animate={{ rotate: [0, -20, 0] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            style={{ transformOrigin: '30px 34px' }}
          />
          <motion.rect
            x="90" y="30" width="18" height="8" rx="4" fill={bodyColor}
            animate={{ rotate: [0, 20, 0] }}
            transition={{ repeat: Infinity, duration: 0.4 }}
            style={{ transformOrigin: '90px 34px' }}
          />
        </>
      ) : mood === 'thinking' ? (
        <>
          <rect x="14" y="50" width="18" height="8" rx="4" fill={bodyColor} />
          <rect x="90" y="38" width="18" height="8" rx="4" fill={bodyColor} transform="rotate(-30 90 42)" />
        </>
      ) : (
        <>
          <rect x="14" y="50" width="18" height="8" rx="4" fill={bodyColor} />
          <rect x="88" y="50" width="18" height="8" rx="4" fill={bodyColor} />
        </>
      )}

      {/* Legs */}
      <rect x="38" y="88" width="12" height="18" rx="4" fill={bodyColor} />
      <rect x="70" y="88" width="12" height="18" rx="4" fill={bodyColor} />

      {/* Feet */}
      <rect x="34" y="102" width="20" height="8" rx="4" fill={bodyColor} />
      <rect x="66" y="102" width="20" height="8" rx="4" fill={bodyColor} />

      {/* Belly screen */}
      <rect x="42" y="48" width="36" height="24" rx="4" fill="#0D1117" />
      <motion.rect
        x="46" y="52" width="8" height="3" rx="1" fill="#00B4D8"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}
      />
      <motion.rect
        x="58" y="52" width="16" height="3" rx="1" fill="#3FB950"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.3 }}
      />
      <motion.rect
        x="46" y="58" width="28" height="3" rx="1" fill="#7B2FBE"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
      />
      <motion.rect
        x="46" y="64" width="14" height="3" rx="1" fill="#D29922"
        animate={{ opacity: [1, 0, 1] }}
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.9 }}
      />

      {/* Gradients */}
      <defs>
        <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
        <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="transparent" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}
