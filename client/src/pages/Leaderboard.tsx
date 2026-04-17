import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuthStore } from '../store';
import type { LeaderboardEntry } from '../types';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

const FILTERS = [
  { id: 'xp', label: 'Overall XP' },
  { id: 'level', label: 'Level' },
];

export default function Leaderboard() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [filter, setFilter] = useState('xp');
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchLeaderboard = async () => {
    setLoading(true);
    try {
      const res = await api.getLeaderboard(filter);
      setLeaderboard(res.leaderboard || []);
    } catch {
      setLeaderboard([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 30000); // Poll every 30s
    return () => clearInterval(interval);
  }, [filter]);

  const getRankIcon = (rank: number) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold gradient-text">🏆 Leaderboard</h1>
        <div className="flex gap-2">
          {FILTERS.map(f => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className="px-3 py-1.5 rounded-lg text-sm transition-all"
              style={{
                background: filter === f.id ? '#00B4D8' : '#161B22',
                color: filter === f.id ? '#0D1117' : '#8B949E',
                border: '1px solid #30363D',
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-xl overflow-hidden" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        {/* Header */}
        <div className="grid grid-cols-12 gap-2 px-4 py-3 text-xs font-medium" style={{ color: '#8B949E', borderBottom: '1px solid #30363D' }}>
          <div className="col-span-1">Rank</div>
          <div className="col-span-4">Player</div>
          <div className="col-span-2 text-center">Level</div>
          <div className="col-span-2 text-center">XP</div>
          <div className="col-span-1 text-center">🏅</div>
          <div className="col-span-2 text-center">Programs</div>
        </div>

        {loading ? (
          <div className="py-12 text-center" style={{ color: '#8B949E' }}>Loading...</div>
        ) : leaderboard.length === 0 ? (
          <div className="py-12 text-center" style={{ color: '#8B949E' }}>No users yet. Be the first! 🚀</div>
        ) : (
          leaderboard.map((entry, i) => {
            const isMe = entry.id === user?.id;
            return (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.03 }}
                className={`grid grid-cols-12 gap-2 px-4 py-3 items-center transition-colors ${
                  isMe ? 'ring-1 ring-[#00B4D8]' : 'hover:bg-[#0D1117]'
                }`}
                style={{
                  background: isMe ? '#00B4D810' : i % 2 === 0 ? '#161B22' : '#1C2333',
                  borderBottom: '1px solid #30363D20',
                }}
              >
                <div className="col-span-1 font-bold text-lg">
                  {entry.rank <= 3 ? getRankIcon(entry.rank) : (
                    <span style={{ color: '#8B949E' }}>#{entry.rank}</span>
                  )}
                </div>
                <div className="col-span-4 flex items-center gap-2">
                  <span className="text-xl">{AVATAR_EMOJIS[entry.avatar] || '🤖'}</span>
                  <span className="font-medium text-sm truncate">
                    {entry.name} {isMe && <span style={{ color: '#00B4D8' }}>(You)</span>}
                  </span>
                </div>
                <div className="col-span-2 text-center">
                  <span className="px-2 py-0.5 rounded-full text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}>
                    LVL {entry.level}
                  </span>
                </div>
                <div className="col-span-2 text-center font-mono text-sm font-bold" style={{ color: '#FFD700' }}>
                  {entry.xp.toLocaleString()}
                </div>
                <div className="col-span-1 text-center text-sm">{entry.badgesCount}</div>
                <div className="col-span-2 text-center text-sm" style={{ color: '#3FB950' }}>
                  {entry.programsCompleted}/20
                </div>
              </motion.div>
            );
          })
        )}
      </div>
    </div>
  );
}
