import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/activity/log — log an activity
router.post('/log', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { type, program, xpEarned } = req.body;

    const activity = await prisma.activityLog.create({
      data: {
        userId: req.userId!,
        type,
        program,
        xpEarned: xpEarned || 0,
      },
    });

    // Add XP if any
    if (xpEarned && xpEarned > 0) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { xp: { increment: xpEarned } },
      });
    }

    res.json({ activity });
  } catch (error) {
    console.error('Log activity error:', error);
    res.status(500).json({ error: 'Failed to log activity' });
  }
});

// GET /api/activity — get user's recent activity
router.get('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const limit = parseInt(req.query.limit as string) || 20;

    const activities = await prisma.activityLog.findMany({
      where: { userId: req.userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });

    res.json({ activities });
  } catch (error) {
    console.error('Get activity error:', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

// GET /api/activity/streak — get user's current streak info
router.get('/streak', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      select: { streak: true, lastLogin: true },
    });

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({ streak: user.streak, lastLogin: user.lastLogin });
  } catch (error) {
    console.error('Streak error:', error);
    res.status(500).json({ error: 'Failed to fetch streak' });
  }
});

export default router;
