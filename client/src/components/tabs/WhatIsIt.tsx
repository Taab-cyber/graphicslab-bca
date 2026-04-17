import { motion } from 'framer-motion';
import SpeechBubble from '../mascot/SpeechBubble';
import type { ProgramData } from '../../types';

interface WhatIsItProps {
  program: ProgramData;
}

export default function WhatIsIt({ program }: WhatIsItProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      {/* Graphy explains */}
      <div className="mb-4">
        <SpeechBubble text={program.analogy} mood="happy" graphySize={120} />
      </div>

      {/* Theory card */}
      <div className="rounded-xl p-8" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="text-xl font-bold mb-4 flex items-center gap-3">
          <span>📖</span>
          <span className="gradient-text">The Theory</span>
        </h3>
        <p className="leading-relaxed text-base" style={{ color: '#8B949E' }}>
          {program.theory}
        </p>
      </div>

      {/* Algorithm Steps */}
      <div className="rounded-xl p-8" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="text-xl font-bold mb-6 flex items-center gap-3">
          <span>📋</span>
          <span className="gradient-text">Algorithm Steps</span>
        </h3>
        <div className="space-y-4">
          {program.algorithmSteps.map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1 }}
              className="flex gap-4 items-start"
            >
              <div
                className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-base font-bold"
                style={{
                  background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)',
                  color: '#0D1117',
                }}
              >
                {i + 1}
              </div>
              <div
                className="flex-1 p-4 rounded-lg text-base font-mono"
                style={{ background: '#0D1117', color: '#E6EDF3', border: '1px solid #30363D' }}
              >
                {step}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Complexity badge */}
      <div className="flex items-center gap-3 p-4 rounded-xl" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <span className="text-2xl">⏱️</span>
        <div>
          <span className="text-sm" style={{ color: '#8B949E' }}>Time Complexity</span>
          <p className="font-mono font-bold text-lg" style={{ color: '#00B4D8' }}>
            {program.complexity}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
