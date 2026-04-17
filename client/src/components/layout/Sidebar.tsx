import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { useAppStore, useAuthStore } from '../../store';
import { PROGRAM_LIST } from '../../data/programs';

const NAV_ITEMS = [
  { path: '/dashboard', icon: '🏠', label: 'Dashboard' },
  { path: '/programs', icon: '📚', label: 'Programs', expandable: true },
  { path: '/leaderboard', icon: '🏆', label: 'Leaderboard' },
  { path: '/friends', icon: '🤝', label: 'Friends' },
  { path: '/profile', icon: '👤', label: 'Profile' },
  { path: '/settings', icon: '⚙️', label: 'Settings' },
];

export default function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useAppStore();
  const { isAuthenticated, user } = useAuthStore();
  const [programsExpanded, setProgramsExpanded] = useState(false);
  const navigate = useNavigate();

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{ x: sidebarOpen ? 0 : -280 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed left-0 top-0 h-full w-[260px] z-50 flex flex-col"
        style={{ background: '#161B22', borderRight: '1px solid #30363D' }}
      >
        {/* Logo */}
        <div
          className="flex items-center gap-3 px-5 py-4 cursor-pointer"
          style={{ borderBottom: '1px solid #30363D' }}
          onClick={() => navigate('/dashboard')}
        >
          <span className="text-2xl">🎨</span>
          <span className="text-xl font-bold gradient-text">GraphicsLab</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {NAV_ITEMS.map((item) => (
            <div key={item.path}>
              {item.expandable ? (
                <>
                  <button
                    onClick={() => setProgramsExpanded(!programsExpanded)}
                    className="w-full flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors hover:bg-[#1C2333]"
                    style={{ color: '#E6EDF3' }}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                    <motion.span
                      animate={{ rotate: programsExpanded ? 90 : 0 }}
                      className="ml-auto text-xs"
                      style={{ color: '#8B949E' }}
                    >
                      ▶
                    </motion.span>
                  </button>
                  <AnimatePresence>
                    {programsExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        {PROGRAM_LIST.map((prog) => (
                          <NavLink
                            key={prog.id}
                            to={`/program/${prog.id}`}
                            onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                            className={({ isActive }) =>
                              `flex items-center gap-2 px-8 py-2 text-xs transition-colors ${
                                isActive
                                  ? 'text-[#00B4D8] bg-[#00B4D8]/10'
                                  : 'text-[#8B949E] hover:text-[#E6EDF3] hover:bg-[#1C2333]'
                              }`
                            }
                          >
                            <span>{prog.icon}</span>
                            <span className="truncate">{prog.shortTitle}</span>
                          </NavLink>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <NavLink
                  to={item.path}
                  onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? 'text-[#00B4D8] bg-[#00B4D8]/10 border-r-2 border-[#00B4D8]'
                        : 'text-[#E6EDF3] hover:bg-[#1C2333]'
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.label}</span>
                </NavLink>
              )}
            </div>
          ))}

          {user?.isAdmin && (
            <div className="mt-4 pt-4 border-t" style={{ borderColor: '#30363D' }}>
              <NavLink
                to="/admin"
                onClick={() => window.innerWidth < 1024 && setSidebarOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-5 py-3 text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-[#F85149] bg-[#F85149]/10 border-r-2 border-[#F85149]'
                      : 'text-[#E6EDF3] hover:bg-[#1C2333]'
                  }`
                }
              >
                <span className="text-lg">🛡️</span>
                <span className="text-[#F85149] font-bold">Admin Panel</span>
              </NavLink>
            </div>
          )}
        </nav>

        {/* Version */}
        <div className="px-5 py-3 text-xs" style={{ color: '#6B7280', borderTop: '1px solid #30363D' }}>
          GraphicsLab v1.0 · Made with 💖
        </div>
      </motion.aside>
    </>
  );
}
