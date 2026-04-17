import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useSound } from '../hooks/useSound';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

export default function Friends() {
  const [friends, setFriends] = useState<any[]>([]);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { playSound } = useSound();

  useEffect(() => {
    api.getFriends().then(res => setFriends(res.friends || [])).catch(() => {});
  }, []);

  const handleAddFriend = async () => {
    setMessage('');
    setError('');
    if (!email.trim()) return;
    try {
      const res = await api.addFriend(email);
      setMessage(`Added ${res.friend.name}! 🎉`);
      setFriends(prev => [...prev, res.friend]);
      setEmail('');
      playSound('correct');
    } catch (err: any) {
      setError(err.message || 'Failed to add friend');
      playSound('wrong');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold gradient-text">🤝 Friends</h1>

      {/* Add Friend */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="font-bold mb-3">Add Friend by Email</h3>
        <div className="flex gap-3">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="friend@example.com"
            className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' }}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFriend()}
          />
          <button
            onClick={handleAddFriend}
            className="px-4 py-2 rounded-lg font-medium text-sm"
            style={{ background: '#00B4D8', color: '#0D1117' }}
          >
            ➕ Add
          </button>
        </div>
        {message && <p className="text-sm mt-2" style={{ color: '#3FB950' }}>{message}</p>}
        {error && <p className="text-sm mt-2" style={{ color: '#F85149' }}>{error}</p>}
      </div>

      {/* Friends List */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="font-bold mb-4">Your Friends ({friends.length})</h3>
        {friends.length === 0 ? (
          <p className="text-center py-8 text-sm" style={{ color: '#8B949E' }}>
            No friends yet. Add someone by email! 📧
          </p>
        ) : (
          <div className="space-y-2">
            {friends.map((f: any, i: number) => (
              <motion.div
                key={f.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg"
                style={{ background: '#0D1117' }}
              >
                <span className="text-2xl">{AVATAR_EMOJIS[f.avatar] || '🤖'}</span>
                <div className="flex-1">
                  <span className="font-medium text-sm">{f.name}</span>
                  <div className="flex gap-3 text-xs" style={{ color: '#8B949E' }}>
                    <span>LVL {f.level}</span>
                    <span>{f.xp} XP</span>
                    <span>{f.badges?.length || 0} badges</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
