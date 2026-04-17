import { useAuthStore, useAppStore } from '../../store';
import { LEVEL_THRESHOLDS } from '../../types';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

export default function TopBar() {
  const { user, isAuthenticated } = useAuthStore();
  const { sidebarOpen, setSidebarOpen } = useAppStore();

  if (!isAuthenticated || !user) return null;

  const nextLevelXP = LEVEL_THRESHOLDS[Math.min(user.level, 20)] || 70000;
  const prevLevelXP = LEVEL_THRESHOLDS[Math.max(user.level - 1, 0)] || 0;
  const progress = ((user.xp - prevLevelXP) / (nextLevelXP - prevLevelXP)) * 100;

  return (
    <header
      className="fixed top-0 z-30 flex items-center gap-4 px-[5%] py-3 backdrop-blur-md"
      style={{
        width: sidebarOpen ? 'calc(100% - 260px)' : '100%',
        background: 'rgba(13, 17, 23, 0.85)',
        borderBottom: '1px solid #30363D',
        left: sidebarOpen ? '260px' : '0',
        transition: 'left 0.3s ease, width 0.3s ease',
      }}
    >
      {/* Hamburger */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="p-2 rounded-lg hover:bg-[#1C2333] transition-colors"
      >
        <span className="text-lg">{sidebarOpen ? '✕' : '☰'}</span>
      </button>

      {/* XP Display */}
      <div className="flex items-center gap-3 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-bold px-2 py-0.5 rounded-full"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', fontSize: '11px' }}>
            LVL {user.level}
          </span>
          <div className="w-32 h-2 rounded-full overflow-hidden" style={{ background: '#30363D' }}>
            <div
              className="h-full rounded-full xp-bar-fill transition-all duration-500"
              style={{
                width: `${Math.min(progress, 100)}%`,
                background: 'linear-gradient(90deg, #00B4D8, #7B2FBE)',
              }}
            />
          </div>
          <span className="text-xs font-mono" style={{ color: '#8B949E' }}>
            {user.xp} XP
          </span>
        </div>

        {/* Streak */}
        {user.streak > 0 && (
          <div className="flex items-center gap-1 text-sm">
            <span>🔥</span>
            <span className="font-bold" style={{ color: '#F0883E' }}>{user.streak}</span>
          </div>
        )}
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3">
        {/* Notification bell */}
        <button className="p-2 rounded-lg hover:bg-[#1C2333] transition-colors relative">
          <span className="text-lg">🔔</span>
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: '#1C2333' }}>
          <span className="text-xl">{AVATAR_EMOJIS[user.avatar] || '🤖'}</span>
          <span className="text-sm font-medium hidden sm:block">{user.name}</span>
        </div>
      </div>
    </header>
  );
}
