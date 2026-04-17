import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { api } from '../services/api';
import { useAuthStore } from '../store';
import { LEVEL_THRESHOLDS } from '../types';

export default function AdminDashboard() {
  const { user } = useAuthStore();
  const [stats, setStats] = useState<any>(null);
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const statsData = await api.getAdminStats();
        const usersData = await api.getAdminUsers();
        setStats(statsData);
        setUsers(usersData.users);
      } catch (error) {
        console.error('Failed to fetch admin data', error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.isAdmin) {
      fetchAdminData();
    }
  }, [user]);

  if (!user?.isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-[50vh] text-center">
        <div>
          <div className="text-6xl mb-4">🛑</div>
          <h2 className="text-2xl font-bold" style={{ color: '#F85149' }}>Access Denied</h2>
          <p style={{ color: '#8B949E' }}>You require Administrator privileges to view this page.</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-4xl animate-pulse">🛠️ Loading Dashboard...</div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex items-center gap-4 border-b pb-6" style={{ borderColor: '#30363D' }}>
        <span className="text-4xl text-white">🎛️</span>
        <div>
          <h1 className="text-3xl font-black gradient-text">Admin Dashboard</h1>
          <p className="text-sm" style={{ color: '#8B949E' }}>System overview and participant data</p>
        </div>
      </div>

      {/* Top Level Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total Enrolled Users', value: stats.totalUsers, icon: '👥', color: '#00B4D8' },
          { label: 'Total Quizzes/Challenges', value: stats.totalScores, icon: '✅', color: '#3FB950' },
          { label: 'Total Platform Activity Logs', value: stats.totalActivities, icon: '📈', color: '#7B2FBE' },
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="rounded-xl p-8"
            style={{ background: '#161B22', border: `1px solid ${stat.color}40`, borderLeft: `4px solid ${stat.color}` }}
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm font-medium mb-2" style={{ color: '#8B949E' }}>{stat.label}</p>
                <div className="text-4xl font-black text-white">{stat.value.toLocaleString()}</div>
              </div>
              <div className="text-5xl opacity-80">{stat.icon}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* User Data Table */}
      <div className="rounded-xl overflow-hidden" style={{ background: '#161B22', border: '1px solid #30363D' }}>
        <div className="p-6 border-b" style={{ borderColor: '#30363D' }}>
          <h3 className="text-xl font-bold flex items-center gap-3">
            <span>🧑‍🎓</span> All Registered Learners
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr style={{ background: '#0D1117' }}>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#8B949E' }}>Learner</th>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#8B949E' }}>Level / XP</th>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#8B949E' }}>Completed Modules</th>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#8B949E' }}>Activities Tracked</th>
                <th className="px-6 py-4 text-sm font-semibold" style={{ color: '#8B949E' }}>Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#30363D' }}>
              {users.map((u, i) => {
                const nextLevelXP = LEVEL_THRESHOLDS[Math.min(u.level, 20)] || 70000;
                return (
                  <motion.tr 
                    key={u.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-[#1C2333] transition-colors"
                  >
                    <td className="px-6 py-4">
                      <div className="font-bold text-white flex items-center gap-2">
                        {u.name} {u.isAdmin && <span className="text-xs px-2 py-0.5 rounded-full bg-[#D2992220] text-[#D29922]">ADMIN</span>}
                      </div>
                      <div className="text-xs mt-1 font-mono" style={{ color: '#8B949E' }}>{u.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm bg-[#00B4D820] text-[#00B4D8] border border-[#00B4D8]">
                          {u.level}
                        </span>
                        <div>
                          <div className="text-sm font-bold text-white">{u.xp.toLocaleString()} XP</div>
                          <div className="text-xs" style={{ color: '#8B949E' }}>Next: {nextLevelXP.toLocaleString()}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-lg font-bold" style={{ color: '#3FB950' }}>{u.programsCompleted}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="font-mono text-sm" style={{ color: '#6B7280' }}>{u.activitiesCount}</span>
                    </td>
                    <td className="px-6 py-4 text-sm" style={{ color: '#8B949E' }}>
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </motion.tr>
                );
              })}
            </tbody>
          </table>
          {users.length === 0 && (
            <div className="p-10 text-center text-gray-500">
              No learners found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
