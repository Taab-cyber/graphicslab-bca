import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getProgramById, PROGRAM_LIST } from '../data/programs';
import WhatIsIt from '../components/tabs/WhatIsIt';
import SeeItLive from '../components/tabs/SeeItLive';
import TheCode from '../components/tabs/TheCode';
import QuickQuiz from '../components/tabs/QuickQuiz';
import MasterChallenge from '../components/tabs/MasterChallenge';
import { useAuthStore } from '../store';
import { api } from '../services/api';

const TABS = [
  { id: 'what', label: 'What Is It? 🤔', icon: '🤔' },
  { id: 'live', label: 'See It Live! ▶️', icon: '▶️' },
  { id: 'code', label: 'The Code 💻', icon: '💻' },
  { id: 'quiz', label: 'Quick Quiz ❓', icon: '❓' },
  { id: 'challenge', label: 'Master Challenge 🏆', icon: '🏆' },
];

export default function Program() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('what');
  const { isAuthenticated, addXP } = useAuthStore();

  const program = id ? getProgramById(id) : undefined;

  // Find prev/next programs
  const currentIndex = PROGRAM_LIST.findIndex(p => p.id === id);
  const prevProgram = currentIndex > 0 ? PROGRAM_LIST[currentIndex - 1] : null;
  const nextProgram = currentIndex < PROGRAM_LIST.length - 1 ? PROGRAM_LIST[currentIndex + 1] : null;

  // Log "viewed" activity
  useEffect(() => {
    if (program && isAuthenticated) {
      api.logActivity({ type: 'viewed', program: program.id, xpEarned: 5 }).catch(() => {});
      addXP(5, 'viewed', program.id);
    }
  }, [program?.id]);

  if (!program) {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-bold mb-4">Program not found</h1>
        <button onClick={() => navigate('/dashboard')} className="px-6 py-2 rounded-lg" style={{ background: '#00B4D8', color: '#0D1117' }}>
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 min-h-[80vh]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-[#30363D]">
        <div>
          <div className="flex items-center gap-2 text-sm mb-2" style={{ color: '#8B949E' }}>
            <span className="capitalize">{program.category}</span>
            <span>·</span>
            <span>Program {currentIndex + 1} of 20</span>
          </div>
          <h1 className="text-3xl lg:text-4xl font-bold flex items-center gap-3">
            <span>{program.icon}</span>
            <span>{program.title}</span>
          </h1>
        </div>

        {/* Prev/Next nav */}
        <div className="flex gap-4">
          {prevProgram && (
            <button
              onClick={() => navigate(`/program/${prevProgram.id}`)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-[#1C2333]"
              style={{ border: '1px solid #30363D' }}
            >
              ← {prevProgram.shortTitle}
            </button>
          )}
          {nextProgram && (
            <button
              onClick={() => navigate(`/program/${nextProgram.id}`)}
              className="px-4 py-2.5 rounded-lg text-sm font-medium transition-all hover:bg-[#1C2333]"
              style={{ border: '1px solid #30363D' }}
            >
              {nextProgram.shortTitle} →
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1.5 rounded-xl overflow-x-auto shadow-sm" style={{ background: '#161B22' }}>
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-shrink-0 px-6 py-3 rounded-lg text-[15px] font-bold transition-all ${
              activeTab === tab.id ? 'text-[#0D1117]' : 'hover:bg-[#1C2333]'
            }`}
            style={{
              background: activeTab === tab.id ? '#00B4D8' : 'transparent',
              color: activeTab === tab.id ? '#0D1117' : '#8B949E',
            }}
          >
            <span className="hidden sm:inline">{tab.label}</span>
            <span className="sm:hidden">{tab.icon}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="pt-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeTab === 'what' && <WhatIsIt program={program} />}
            {activeTab === 'live' && <SeeItLive program={program} />}
            {activeTab === 'code' && <TheCode program={program} />}
            {activeTab === 'quiz' && <QuickQuiz program={program} />}
            {activeTab === 'challenge' && <MasterChallenge program={program} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
