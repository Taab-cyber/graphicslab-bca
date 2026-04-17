import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';
import { adminMiddleware } from '../middleware/admin';

const router = Router();
const prisma = new PrismaClient();

// Apply auth and admin middleware to all routes in this file
router.use(authMiddleware);
router.use(adminMiddleware);

// GET /api/admin/stats
router.get('/stats', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const totalUsers = await prisma.user.count();
    const totalScores = await prisma.score.count();
    const totalActivities = await prisma.activityLog.count();
    
    // Get users with highest XP (top 5)
    const topUsers = await prisma.user.findMany({
      orderBy: { xp: 'desc' },
      take: 5,
      select: { id: true, name: true, xp: true, level: true }
    });

    res.json({
      totalUsers,
      totalScores,
      totalActivities,
      topUsers
    });
  } catch (error) {
    console.error('Admin stats error:', error);
    res.status(500).json({ error: 'Failed to fetch admin statistics' });
  }
});

// GET /api/admin/users
router.get('/users', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        email: true,
        xp: true,
        level: true,
        badges: true,
        createdAt: true,
        isAdmin: true,
        _count: {
          select: {
            scores: true,
            activities: true
          }
        }
      }
    });

    const formattedUsers = users.map(u => ({
      id: u.id,
      name: u.name,
      email: u.email,
      xp: u.xp,
      level: u.level,
      badgesCount: u.badges.length,
      createdAt: u.createdAt,
      isAdmin: u.isAdmin,
      programsCompleted: u._count.scores,
      activitiesCount: u._count.activities
    }));

    res.json({ users: formattedUsers });
  } catch (error) {
    console.error('Admin users error:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

export default router;
