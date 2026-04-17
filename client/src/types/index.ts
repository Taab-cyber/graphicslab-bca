export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  xp: number;
  level: number;
  badges: string[];
  streak: number;
  isAdmin?: boolean;
  createdAt?: string;
}

export interface Score {
  id: string;
  userId: string;
  program: string;
  type: 'quiz' | 'challenge';
  score: number;
  attempts: number;
  completedAt: string;
}

export interface ActivityLog {
  id: string;
  userId: string;
  type: 'quiz' | 'puzzle' | 'challenge' | 'viewed';
  program: string;
  xpEarned: number;
  createdAt: string;
}

export interface LeaderboardEntry {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  xp: number;
  level: number;
  badgesCount: number;
  programsCompleted: number;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
}

export interface ProgramData {
  id: string;
  title: string;
  shortTitle: string;
  icon: string;
  category: 'line' | 'curve' | 'transformation';
  analogy: string;
  theory: string;
  algorithmSteps: string[];
  cppCode: string;
  lineExplanations: Record<number, string>;
  keyLines: number[];
  complexity: string;
  quiz: QuizQuestion[];
  challengeType: string;
  challengeTitle: string;
  challengeDescription: string;
}

export interface AlgorithmStep {
  x: number;
  y: number;
  label?: string;
  decisionParam?: number;
  highlight?: boolean;
}

export interface CanvasPoint {
  x: number;
  y: number;
}

export type GraphyMood = 'happy' | 'thinking' | 'celebrating';

export const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000, 30000, 36000, 43000, 51000, 60000, 70000,
];

export const AVATARS = [
  'robot1', 'robot2', 'robot3', 'robot4',
  'robot5', 'robot6', 'robot7', 'robot8',
];

export const BADGES: Record<string, { icon: string; name: string; description: string }> = {
  'pixel-perfect': { icon: '🎯', name: 'Pixel Perfect', description: '3/3 on any quiz first try' },
  'on-fire': { icon: '🔥', name: 'On Fire', description: 'Complete 5 programs in one day' },
  'math-whiz': { icon: '🧮', name: 'Math Whiz', description: 'Solve 10 challenges perfectly' },
  'graphics-master': { icon: '🌟', name: 'Graphics Master', description: 'Complete all 20 programs' },
  'speed-demon': { icon: '⚡', name: 'Speed Demon', description: 'Answer quiz in under 5 seconds' },
  'artist': { icon: '🎨', name: 'Artist', description: 'Use canvas on all 20 programs' },
  'social': { icon: '🤝', name: 'Social', description: 'Add 3 friends' },
  'champion': { icon: '👑', name: 'Champion', description: 'Reach #1 on leaderboard' },
  'comeback-kid': { icon: '🔁', name: 'Comeback Kid', description: 'Retry and pass a failed challenge' },
  'scholar': { icon: '📚', name: 'Scholar', description: 'View theory on all 20 programs' },
};
