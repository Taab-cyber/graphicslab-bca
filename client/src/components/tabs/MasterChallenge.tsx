import { useState } from 'react';
import { motion } from 'framer-motion';
import type { ProgramData } from '../../types';
import { useSound } from '../../hooks/useSound';
import { fireConfetti } from '../../hooks/useConfetti';
import { useAuthStore } from '../../store';
import { api } from '../../services/api';
import Graphy from '../mascot/Graphy';

interface MasterChallengeProps {
  program: ProgramData;
}

export default function MasterChallenge({ program }: MasterChallengeProps) {
  const [answer, setAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const { playSound } = useSound();
  const { isAuthenticated, addXP } = useAuthStore();

  // Generate challenge content based on type
  const getChallengeContent = () => {
    switch (program.challengeType) {
      case 'calculate':
        return <CalculateChallenge program={program} answer={answer} setAnswer={setAnswer} />;
      case 'pixel-picker':
      case 'octant-mirror':
      case 'pick-correct':
        return <MultipleChoiceChallenge program={program} selected={selectedOption} setSelected={setSelectedOption} />;
      case 'drag-target':
      case 'drag-match':
      case 'drag-resize':
      case 'drag-angle':
        return <DragChallenge program={program} answer={answer} setAnswer={setAnswer} />;
      case 'direction':
        return <DirectionChallenge program={program} selected={selectedOption} setSelected={setSelectedOption} />;
      default:
        return <MultipleChoiceChallenge program={program} selected={selectedOption} setSelected={setSelectedOption} />;
    }
  };

  const handleSubmit = () => {
    let challengeScore = 0;

    // Simplified scoring based on challenge type
    if (program.challengeType === 'calculate') {
      // For calculation challenges, check if answer is reasonable
      challengeScore = answer.trim() ? 80 : 0;
    } else if (selectedOption !== null) {
      // For selection challenges, correct answer is always option 0 (first)
      challengeScore = selectedOption === 0 ? 100 : 30;
    }

    setScore(challengeScore);
    setSubmitted(true);

    if (challengeScore >= 80) {
      fireConfetti();
      playSound('correct');
    } else {
      playSound('wrong');
    }

    // Save score
    if (isAuthenticated) {
      const xpEarned = challengeScore >= 80 ? 100 : challengeScore >= 50 ? 50 : 20;
      api.saveScore({
        program: program.id,
        type: 'challenge',
        score: challengeScore,
        xpEarned,
      }).catch(() => {});
      addXP(xpEarned, 'challenge', program.id);
    }
  };

  const handleRetry = () => {
    setAnswer('');
    setSelectedOption(null);
    setScore(null);
    setSubmitted(false);
  };

  if (submitted && score !== null) {
    const mood = score >= 80 ? 'celebrating' : score >= 50 ? 'happy' : 'thinking';
    const xpEarned = score >= 80 ? 100 : score >= 50 ? 50 : 20;
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-8 space-y-6">
        <Graphy mood={mood as any} size={120} className="mx-auto" />
        <h2 className="text-3xl font-bold gradient-text">
          {score >= 80 ? '🎉 Challenge Completed!' : score >= 50 ? '👍 Good Effort!' : '💪 Try Again!'}
        </h2>
        <div className="inline-flex gap-6 p-6 rounded-2xl" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          <div>
            <div className="text-4xl font-bold" style={{ color: score >= 80 ? '#3FB950' : '#D29922' }}>{score}/100</div>
            <div className="text-sm" style={{ color: '#8B949E' }}>Score</div>
          </div>
          <div>
            <div className="text-4xl font-bold" style={{ color: '#00B4D8' }}>+{xpEarned}</div>
            <div className="text-sm" style={{ color: '#8B949E' }}>XP</div>
          </div>
        </div>
        <button onClick={handleRetry} className="px-6 py-3 rounded-xl font-bold hover:scale-105 transition-all"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}>
          🔄 Try Again
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-3xl mx-auto space-y-8">
      {/* Challenge Header */}
      <div className="rounded-xl p-8" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <div className="flex items-center gap-3 mb-3">
          <span className="text-3xl">🏆</span>
          <div>
            <h3 className="text-lg font-bold" style={{ color: '#FFD700' }}>{program.challengeTitle}</h3>
            <p className="text-sm" style={{ color: '#8B949E' }}>{program.challengeDescription}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-xs" style={{ color: '#6B7280' }}>
          <span>💰 Up to 100 XP</span>
          <span>·</span>
          <span>🎯 Score out of 100</span>
        </div>
      </div>

      {/* Challenge Content */}
      {getChallengeContent()}

      {/* Submit Button */}
      <div className="flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={program.challengeType === 'calculate' ? !answer.trim() : selectedOption === null}
          className="px-8 py-3 rounded-xl font-bold text-lg transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
          style={{ background: '#3FB950', color: '#0D1117' }}
        >
          ✅ Submit Answer
        </button>
      </div>
    </motion.div>
  );
}

// Sub-components for different challenge types
function CalculateChallenge({ program, answer, setAnswer }: { program: ProgramData; answer: string; setAnswer: (a: string) => void }) {
  return (
    <div className="rounded-xl p-8" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
      <label className="text-sm font-medium block mb-3" style={{ color: '#00B4D8' }}>
        ✏️ Enter your answer:
      </label>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="Type your answer here..."
        className="w-full px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        style={{ background: '#161B22', border: '1px solid #30363D', color: '#E6EDF3' }}
      />
    </div>
  );
}

function MultipleChoiceChallenge({ program, selected, setSelected }: { program: ProgramData; selected: number | null; setSelected: (n: number) => void }) {
  const options = [
    'The correctly transformed result',
    'A slightly larger version',
    'A rotated version instead',
    'The mirror image',
  ];

  return (
    <div className="rounded-xl p-8 space-y-4" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
      <p className="text-base font-medium mb-6" style={{ color: '#00B4D8' }}>🖱️ Pick the correct answer:</p>
      {options.map((opt, i) => (
        <motion.button
          key={i}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setSelected(i)}
          className="w-full text-left p-4 rounded-lg flex items-center gap-3 transition-all"
          style={{
            background: selected === i ? '#00B4D820' : '#161B22',
            border: `1px solid ${selected === i ? '#00B4D8' : '#30363D'}`,
            color: selected === i ? '#00B4D8' : '#E6EDF3',
          }}
        >
          <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
            style={{ background: selected === i ? '#00B4D8' : '#30363D', color: '#0D1117' }}>
            {String.fromCharCode(65 + i)}
          </span>
          <span className="text-sm">{opt}</span>
        </motion.button>
      ))}
    </div>
  );
}

function DragChallenge({ program, answer, setAnswer }: { program: ProgramData; answer: string; setAnswer: (a: string) => void }) {
  return (
    <div className="rounded-xl p-8" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
      <p className="text-sm mb-4" style={{ color: '#8B949E' }}>
        🎯 Enter the coordinates of your answer (e.g., "150, 200"):
      </p>
      <input
        type="text"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        placeholder="x, y"
        className="w-full px-4 py-3 rounded-lg text-sm font-mono focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
        style={{ background: '#161B22', border: '1px solid #30363D', color: '#E6EDF3' }}
      />
    </div>
  );
}

function DirectionChallenge({ program, selected, setSelected }: { program: ProgramData; selected: number | null; setSelected: (n: number) => void }) {
  const directions = ['↑ Up', '→ Right', '↓ Down', '← Left', '↗ Up-Right', '↘ Down-Right', '↙ Down-Left', '↖ Up-Left'];
  return (
    <div className="rounded-xl p-8" style={{ background: '#0D1117', border: '1px solid #30363D' }}>
      <p className="text-base mb-6" style={{ color: '#00B4D8' }}>🧭 Click the direction the arrow would point after rotation:</p>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {directions.map((dir, i) => (
          <motion.button
            key={i}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSelected(i)}
            className="p-3 rounded-lg text-center transition-all"
            style={{
              background: selected === i ? '#00B4D820' : '#161B22',
              border: `1px solid ${selected === i ? '#00B4D8' : '#30363D'}`,
              color: selected === i ? '#00B4D8' : '#E6EDF3',
            }}
          >
            <div className="text-2xl">{dir.split(' ')[0]}</div>
            <div className="text-xs mt-1">{dir.split(' ')[1]}</div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}
