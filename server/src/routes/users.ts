import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// XP thresholds for each level
const LEVEL_THRESHOLDS = [
  0, 100, 250, 500, 1000, 1750, 2750, 4000, 5500, 7500,
  10000, 13000, 16500, 20500, 25000, 30000, 36000, 43000, 51000, 60000, 70000,
];

function calculateLevel(xp: number): number {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    if (xp >= LEVEL_THRESHOLDS[i]) return Math.min(i + 1, 20);
  }
  return 1;
}

// GET /api/users/profile
router.get('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: {
        scores: { orderBy: { completedAt: 'desc' }, take: 20 },
        activities: { orderBy: { createdAt: 'desc' }, take: 20 },
        _count: { select: { scores: true, activities: true, friends: true } },
      },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    // Count unique completed programs
    const completedPrograms = await prisma.score.findMany({
      where: { userId: req.userId },
      select: { program: true },
      distinct: ['program'],
    });

    // Get rank
    const rank = await prisma.user.count({ where: { xp: { gt: user.xp } } }) + 1;

    const { password, ...safeUser } = user;
    res.json({
      user: safeUser,
      completedPrograms: completedPrograms.length,
      rank,
      levelThresholds: LEVEL_THRESHOLDS,
    });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// PUT /api/users/profile
router.put('/profile', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, avatar } = req.body;
    const data: any = {};
    if (name) data.name = name;
    if (avatar) data.avatar = avatar;

    const user = await prisma.user.update({
      where: { id: req.userId },
      data,
      select: { id: true, name: true, email: true, avatar: true, xp: true, level: true, badges: true, streak: true },
    });

    res.json({ user });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// POST /api/users/xp
router.post('/xp', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { xp: xpToAdd, source, program } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const newXP = user.xp + (xpToAdd || 0);
    const newLevel = calculateLevel(newXP);
    const leveledUp = newLevel > user.level;

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { xp: newXP, level: newLevel },
      select: { id: true, xp: true, level: true, badges: true },
    });

    // Log activity
    if (source && program) {
      await prisma.activityLog.create({
        data: {
          userId: req.userId!,
          type: source,
          program,
          xpEarned: xpToAdd || 0,
        },
      });
    }

    res.json({
      user: updated,
      leveledUp,
      previousLevel: user.level,
      nextLevelXP: LEVEL_THRESHOLDS[Math.min(newLevel, 20)] || 70000,
    });
  } catch (error) {
    console.error('XP error:', error);
    res.status(500).json({ error: 'Failed to update XP' });
  }
});

// POST /api/users/badges
router.post('/badges', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { badge } = req.body;
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    if (user.badges.includes(badge)) {
      res.json({ user, alreadyHad: true });
      return;
    }

    const updated = await prisma.user.update({
      where: { id: req.userId },
      data: { badges: { push: badge } },
      select: { id: true, badges: true },
    });

    res.json({ user: updated, newBadge: true });
  } catch (error) {
    console.error('Badge error:', error);
    res.status(500).json({ error: 'Failed to update badges' });
  }
});

// GET /api/users/leaderboard
router.get('/leaderboard', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { filter = 'xp', period = 'alltime', type = 'global' } = req.query;

    let orderBy: any = { xp: 'desc' };
    if (filter === 'level') orderBy = { level: 'desc' };

    const users = await prisma.user.findMany({
      orderBy,
      take: 100,
      select: {
        id: true,
        name: true,
        avatar: true,
        xp: true,
        level: true,
        badges: true,
        _count: { select: { scores: true } },
      },
    });

    const leaderboard = users.map((u, i) => ({
      rank: i + 1,
      id: u.id,
      name: u.name,
      avatar: u.avatar,
      xp: u.xp,
      level: u.level,
      badgesCount: u.badges.length,
      programsCompleted: u._count.scores,
    }));

    res.json({ leaderboard });
  } catch (error) {
    console.error('Leaderboard error:', error);
    res.status(500).json({ error: 'Failed to fetch leaderboard' });
  }
});

// GET /api/users/friends
router.get('/friends', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const friendships = await prisma.friendship.findMany({
      where: { userId: req.userId },
      include: {
        friend: {
          select: {
            id: true, name: true, avatar: true, xp: true, level: true, badges: true,
          },
        },
      },
    });

    const friends = friendships.map(f => f.friend);
    res.json({ friends });
  } catch (error) {
    console.error('Friends error:', error);
    res.status(500).json({ error: 'Failed to fetch friends' });
  }
});

// POST /api/users/friends/add
router.post('/friends/add', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { email } = req.body;

    const friend = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (!friend) {
      res.status(404).json({ error: 'User not found with that email' });
      return;
    }

    if (friend.id === req.userId) {
      res.status(400).json({ error: 'Cannot add yourself as a friend' });
      return;
    }

    const existing = await prisma.friendship.findUnique({
      where: { userId_friendId: { userId: req.userId!, friendId: friend.id } },
    });

    if (existing) {
      res.status(409).json({ error: 'Already friends' });
      return;
    }

    await prisma.friendship.create({
      data: { userId: req.userId!, friendId: friend.id },
    });

    // Also create reverse friendship
    await prisma.friendship.create({
      data: { userId: friend.id, friendId: req.userId! },
    }).catch(() => {}); // ignore if already exists

    res.json({ message: 'Friend added!', friend: { id: friend.id, name: friend.name, avatar: friend.avatar } });
  } catch (error) {
    console.error('Add friend error:', error);
    res.status(500).json({ error: 'Failed to add friend' });
  }
});

export default router;
