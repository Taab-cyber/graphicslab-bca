import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuthStore } from '../store';
import Graphy from '../components/mascot/Graphy';
import { AVATARS } from '../types';

const AVATAR_EMOJIS: Record<string, string> = {
  robot1: '🤖', robot2: '👾', robot3: '🎮', robot4: '🕹️',
  robot5: '🧠', robot6: '⚡', robot7: '🌟', robot8: '🎯',
};

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [avatar, setAvatar] = useState('robot1');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      await signup(name, email, password, avatar);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Signup failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full max-w-[1200px] mx-auto px-[5%] py-[80px] pixel-grid" style={{ background: '#0D1117' }}>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <div className="text-center mb-6">
          <Graphy mood="celebrating" size={80} className="mx-auto mb-4" />
          <h1 className="text-2xl font-bold gradient-text">Join GraphicsLab!</h1>
          <p className="text-sm mt-1" style={{ color: '#8B949E' }}>Create your account and start learning</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl p-6 space-y-4" style={{ background: '#161B22', border: '1px solid #30363D' }}>
          {error && (
            <div className="p-3 rounded-lg text-sm" style={{ background: '#F8514920', color: '#F85149', border: '1px solid #F8514940' }}>
              ❌ {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#E6EDF3' }}>Your Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' }}
              placeholder="What should Graphy call you?" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#E6EDF3' }}>Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' }}
              placeholder="you@example.com" />
          </div>

          <div>
            <label className="text-sm font-medium block mb-1" style={{ color: '#E6EDF3' }}>Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required
              className="w-full px-4 py-3 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#00B4D8]"
              style={{ background: '#0D1117', border: '1px solid #30363D', color: '#E6EDF3' }}
              placeholder="Min 6 characters" />
          </div>

          {/* Avatar picker */}
          <div>
            <label className="text-sm font-medium block mb-2" style={{ color: '#E6EDF3' }}>Choose Your Avatar</label>
            <div className="grid grid-cols-4 gap-4">
              {AVATARS.map((a) => (
                <motion.button
                  key={a} type="button"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setAvatar(a)}
                  className="p-3 rounded-lg text-2xl text-center transition-all"
                  style={{
                    background: avatar === a ? '#00B4D820' : '#0D1117',
                    border: `2px solid ${avatar === a ? '#00B4D8' : '#30363D'}`,
                  }}
                >
                  {AVATAR_EMOJIS[a]}
                </motion.button>
              ))}
            </div>
          </div>

          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-lg font-bold transition-all hover:scale-[1.02] disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #00B4D8, #7B2FBE)', color: '#0D1117' }}>
            {loading ? '⏳ Creating account...' : '🎨 Create Account'}
          </button>

          <p className="text-center text-sm" style={{ color: '#8B949E' }}>
            Already have an account?{' '}
            <Link to="/login" className="font-medium" style={{ color: '#00B4D8' }}>Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
