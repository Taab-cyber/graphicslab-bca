import { useAuthStore } from '../store';
import { BADGES, LEVEL_THRESHOLDS } from '../types';
import Graphy from '../components/mascot/Graphy';
import { motion } from 'framer-motion';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

export default function Profile() {
  const { user } = useAuthStore();
  if (!user) return null;

  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(user.level, 20)] || 70000;
  const prevLevelXP = LEVEL_THRESHOLDS[Math.max(user.level - 1, 0)] || 0;
  const progress = ((user.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-2xl p-8 text-center"
        style={{
          background: 'linear-gradient(135deg, #00B4D815, #7B2FBE15)',
          border: '1px solid #30363D',
        }}
      >
        <div className="text-6xl mb-4">{AVATAR_EMOJIS[user.avatar] || '🤖'}</div>
        <h1 className="text-2xl font-bold">{user.name}</h1>
        <p className="text-sm" style={{ color: '#8B949E' }}>{user.email}</p>

        <div className="flex justify-center gap-8 mt-6">
          <div>
            <div className="text-3xl font-bold" style={{ color: '#00B4D8' }}>{user.xp}</div>
            <div className="text-xs" style={{ color: '#8B949E' }}>Total XP</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: '#7B2FBE' }}>{user.level}</div>
            <div className="text-xs" style={{ color: '#8B949E' }}>Level</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: '#F0883E' }}>{user.streak}</div>
            <div className="text-xs" style={{ color: '#8B949E' }}>Day Streak 🔥</div>
          </div>
          <div>
            <div className="text-3xl font-bold" style={{ color: '#3FB950' }}>{user.badges.length}</div>
            <div className="text-xs" style={{ color: '#8B949E' }}>Badges</div>
          </div>
        </div>

        {/* XP progress */}
        <div className="mt-6 max-w-md mx-auto">
          <div className="flex justify-between text-xs mb-1" style={{ color: '#8B949E' }}>
            <span>Level {user.level}</span>
            <span>{user.xp} / {nextLevelXP} XP</span>
            <span>Level {Math.min(user.level + 1, 20)}</span>
          </div>
          <div className="h-3 rounded-full overflow-hidden" style={{ background: '#30363D' }}>
            <div className="h-full rounded-full" style={{
              width: `${Math.min(progress, 100)}%`,
              background: 'linear-gradient(90deg, #00B4D8, #7B2FBE)',
            }} />
          </div>
        </div>
      </motion.div>

      {/* Badges */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h2 className="text-lg font-bold mb-4">🏅 Badges Collection</h2>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {Object.entries(BADGES).map(([key, badge]) => {
            const earned = user.badges.includes(key);
            return (
              <motion.div
                key={key}
                whileHover={{ scale: 1.05 }}
                className={`rounded-xl p-4 text-center transition-all ${earned ? 'badge-shine' : ''}`}
                style={{
                  background: earned ? '#0D1117' : '#0D1117',
                  border: `1px solid ${earned ? '#FFD700' : '#30363D'}`,
                  opacity: earned ? 1 : 0.4,
                }}
              >
                <div className="text-3xl mb-1">{badge.icon}</div>
                <div className="text-xs font-bold" style={{ color: earned ? '#FFD700' : '#6B7280' }}>
                  {badge.name}
                </div>
                <div className="text-[10px] mt-1" style={{ color: '#6B7280' }}>
                  {badge.description}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Graphy */}
      <div className="text-center">
        <Graphy mood={user.badges.length > 5 ? 'celebrating' : 'happy'} size={80} className="mx-auto" />
        <p className="text-sm mt-2" style={{ color: '#8B949E' }}>
          {user.badges.length > 5 ? "You're amazing! Keep collecting! 🌟" : "Keep earning badges! You can do it! 💪"}
        </p>
      </div>
    </div>
  );
}
