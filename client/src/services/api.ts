// Use environment variable if provided (production), fallback to standard proxy/relative path
const API_BASE = import.meta.env.VITE_API_URL || '/api';

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('graphicslab_token');

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> || {}),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Request failed' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  // Auth
  signup: (data: { name: string; email: string; password: string; avatar: string }) =>
    request<any>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),

  login: (data: { email: string; password: string }) =>
    request<any>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),

  getMe: () => request<any>('/auth/me'),

  // Users
  getProfile: () => request<any>('/users/profile'),
  updateProfile: (data: { name?: string; avatar?: string }) =>
    request<any>('/users/profile', { method: 'PUT', body: JSON.stringify(data) }),

  addXP: (data: { xp: number; source: string; program: string }) =>
    request<any>('/users/xp', { method: 'POST', body: JSON.stringify(data) }),

  addBadge: (badge: string) =>
    request<any>('/users/badges', { method: 'POST', body: JSON.stringify({ badge }) }),

  getLeaderboard: (filter = 'xp', period = 'alltime') =>
    request<any>(`/users/leaderboard?filter=${filter}&period=${period}`),

  getFriends: () => request<any>('/users/friends'),
  addFriend: (email: string) =>
    request<any>('/users/friends/add', { method: 'POST', body: JSON.stringify({ email }) }),

  // Scores
  saveScore: (data: { program: string; type: string; score: number; xpEarned: number }) =>
    request<any>('/scores', { method: 'POST', body: JSON.stringify(data) }),

  getMyScores: () => request<any>('/scores/my'),
  getProgramScores: (program: string) => request<any>(`/scores/program/${program}`),

  // Activity
  logActivity: (data: { type: string; program: string; xpEarned: number }) =>
    request<any>('/activity/log', { method: 'POST', body: JSON.stringify(data) }),

  getActivity: (limit = 20) => request<any>(`/activity?limit=${limit}`),
  getStreak: () => request<any>('/activity/streak'),

  // Admin
  getAdminStats: () => request<any>('/admin/stats'),
  getAdminUsers: () => request<any>('/admin/users'),
};
