import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import { PROGRAM_LIST } from '../data/programs';
import { LEVEL_THRESHOLDS, BADGES } from '../types';
import Graphy from '../components/mascot/Graphy';
import { api } from '../services/api';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

const HEX_COLORS: Record<string, string> = {
  'not-started': '#30363D',
  'viewed': '#00B4D8',
  'quiz-done': '#3FB950',
  'challenge-done': '#FFD700',
};

export default function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [activities, setActivities] = useState<any[]>([]);
  const [completedPrograms, setCompletedPrograms] = useState<Set<string>>(new Set());

  useEffect(() => {
    api.getActivity(10).then(res => setActivities(res.activities || [])).catch(() => {});
    api.getMyScores().then(res => {
      const completed = new Set<string>();
      (res.scores || []).forEach((s: any) => completed.add(s.program));
      setCompletedPrograms(completed);
    }).catch(() => {});
  }, []);

  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(user?.level || 1, 20)] || 70000;
  const prevLevelXP = LEVEL_THRESHOLDS[Math.max((user?.level || 1) - 1, 0)] || 0;
  const progress = user ? ((user.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100 : 0;

  const randomProgram = () => {
    const idx = Math.floor(Math.random() * PROGRAM_LIST.length);
    navigate(`/program/${PROGRAM_LIST[idx].id}`);
  };

  return (
    <div className="space-y-10">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 lg:p-12 flex flex-col md:flex-row items-center gap-8"
        style={{
          background: 'linear-gradient(135deg, #00B4D815, #7B2FBE15)',
          border: '1px solid #30363D',
        }}
      >
        <Graphy mood="happy" size={100} />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-1">
            Hey {user?.name || 'Explorer'}! Ready to draw some pixels today? 🎨
          </h1>
          <p style={{ color: '#8B949E' }}>
            You're Level {user?.level || 1} with {user?.xp || 0} XP. Keep going!
          </p>
        </div>
        <button
          onClick={randomProgram}
          className="px-6 py-3 rounded-xl font-bold transition-all hover:scale-105 flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}
        >
          🎲 Random Program
        </button>
      </motion.div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {[
          { icon: '📚', label: 'Programs Done', value: completedPrograms.size, color: '#3FB950' },
          { icon: '⭐', label: 'Total XP', value: user?.xp || 0, color: '#00B4D8' },
          { icon: '🔥', label: 'Day Streak', value: user?.streak || 0, color: '#F0883E' },
          { icon: '🏅', label: 'Badges', value: user?.badges?.length || 0, color: '#D29922' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * i }}
            className="rounded-xl p-6 text-center"
            style={{ background: '#161B22', border: '1px solid #30363D' }}
          >
            <div className="text-2xl mb-1">{stat.icon}</div>
            <div className="text-2xl font-bold" style={{ color: stat.color }}>{stat.value}</div>
            <div className="text-xs" style={{ color: '#8B949E' }}>{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* XP Progress Bar */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <div className="flex justify-between items-center mb-4">
          <span className="text-sm font-medium">Level {user?.level || 1} → Level {Math.min((user?.level || 1) + 1, 20)}</span>
          <span className="text-xs font-mono" style={{ color: '#8B949E' }}>
            {user?.xp || 0} / {nextLevelXP} XP
          </span>
        </div>
        <div className="h-3 rounded-full overflow-hidden" style={{ background: '#30363D' }}>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #00B4D8, #7B2FBE)' }}
          />
        </div>
      </div>

      {/* Progress Map — Hex Grid */}
      <div className="rounded-xl p-8" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h2 className="text-xl font-bold mb-8 gradient-text text-center">🗺️ Your Progress Map</h2>
        <div className="flex flex-wrap gap-4 lg:gap-6 justify-center max-w-4xl mx-auto">
          {PROGRAM_LIST.map((prog, i) => {
            const status = completedPrograms.has(prog.id) ? 'quiz-done' : 'not-started';
            return (
              <motion.div
                key={prog.id}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.02 * i }}
                whileHover={{ scale: 1.15 }}
              >
                <Link
                  to={`/program/${prog.id}`}
                  className="hex-node w-20 h-20 flex flex-col items-center justify-center text-center"
                  style={{ background: HEX_COLORS[status] }}
                  title={prog.shortTitle}
                >
                  <span className="text-2xl">{prog.icon}</span>
                  <span className="text-[10px] font-bold mt-1 leading-none">{i + 1}</span>
                </Link>
              </motion.div>
            );
          })}
        </div>
        <div className="flex gap-6 justify-center mt-8 text-sm" style={{ color: '#8B949E' }}>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#30363D' }}></span> Not Started</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#00B4D8' }}></span> Viewed</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#3FB950' }}></span> Quiz Done</span>
          <span className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm" style={{ background: '#FFD700' }}></span> Challenge Done</span>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="rounded-xl p-8" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h2 className="text-xl font-bold mb-6">📋 Recent Activity</h2>
        {activities.length === 0 ? (
          <p className="text-sm text-center py-4" style={{ color: '#8B949E' }}>
            No activity yet. Start a program to see your progress here! 🚀
          </p>
        ) : (
          <div className="space-y-2">
            {activities.slice(0, 8).map((a: any, i: number) => (
              <div key={i} className="flex items-center gap-3 p-2 rounded-lg" style={{ background: '#0D1117' }}>
                <span className="text-lg">
                  {a.type === 'quiz' ? '❓' : a.type === 'challenge' ? '🏆' : '👁️'}
                </span>
                <span className="flex-1 text-sm">{a.type} — {a.program}</span>
                <span className="text-sm font-bold" style={{ color: '#00B4D8' }}>+{a.xpEarned} XP</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
