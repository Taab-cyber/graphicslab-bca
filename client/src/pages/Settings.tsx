import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuthStore, useAppStore } from '../store';
import { AVATARS } from '../types';
import { api } from '../services/api';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

export default function Settings() {
  const { user, updateUser } = useAuthStore();
  const { soundEnabled, setSoundEnabled, animationsEnabled, setAnimationsEnabled } = useAppStore();
  const [name, setName] = useState(user?.name || '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSaveName = async () => {
    setSaving(true);
    try {
      await api.updateProfile({ name });
      updateUser({ name });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {}
    setSaving(false);
  };

  const handleAvatarChange = async (avatar: string) => {
    try {
      await api.updateProfile({ avatar });
      updateUser({ avatar });
    } catch {}
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold gradient-text">⚙️ Settings</h1>

      {/* Display Name */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="font-bold mb-3">Display Name</h3>
        <div className="flex gap-3">
          <input
            type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="flex-1 px-4 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
            style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' }}
          />
          <button
            onClick={handleSaveName} disabled={saving}
            className="px-4 py-2 rounded-lg font-medium text-sm"
            style={{ background: saved ? '#3FB950' : '#00B4D8', color: '#0D1117' }}
          >
            {saved ? '✓ Saved!' : saving ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>

      {/* Avatar */}
      <div className="rounded-xl p-6" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="font-bold mb-3">Choose Avatar</h3>
        <div className="grid grid-cols-4 gap-3">
          {AVATARS.map(a => (
            <motion.button
              key={a}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleAvatarChange(a)}
              className="p-4 rounded-xl text-3xl text-center transition-all"
              style={{
                background: user?.avatar === a ? '#00B4D820' : '#0D1117',
                border: `2px solid ${user?.avatar === a ? '#00B4D8' : '#30363D'}`,
              }}
            >
              {AVATAR_EMOJIS[a]}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Toggles */}
      <div className="rounded-xl p-6 space-y-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <h3 className="font-bold mb-1">Preferences</h3>

        {[
          { label: '🔊 Sound Effects', value: soundEnabled, setter: setSoundEnabled },
          { label: '✨ Animations', value: animationsEnabled, setter: setAnimationsEnabled },
        ].map(toggle => (
          <div key={toggle.label} className="flex items-center justify-between py-2">
            <span className="text-sm">{toggle.label}</span>
            <button
              onClick={() => toggle.setter(!toggle.value)}
              className="w-12 h-6 rounded-full transition-all relative"
              style={{ background: toggle.value ? '#00B4D8' : '#30363D' }}
            >
              <motion.div
                animate={{ x: toggle.value ? 24 : 2 }}
                className="absolute top-0.5 w-5 h-5 rounded-full"
                style={{ background: '#E6EDF3' }}
              />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
