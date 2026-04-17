import { Router, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest, authMiddleware } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// POST /api/scores — save quiz or challenge score
router.post('/', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { program, type, score, xpEarned } = req.body;

    if (!program || score === undefined) {
      res.status(400).json({ error: 'Program and score are required' });
      return;
    }

    // Check if user already has a score for this program + type
    const existing = await prisma.score.findFirst({
      where: { userId: req.userId, program, type: type || 'quiz' },
    });

    let savedScore;
    if (existing) {
      savedScore = await prisma.score.update({
        where: { id: existing.id },
        data: {
          score: Math.max(existing.score, score), // keep best score
          attempts: existing.attempts + 1,
          completedAt: new Date(),
        },
      });
    } else {
      savedScore = await prisma.score.create({
        data: {
          userId: req.userId!,
          program,
          type: type || 'quiz',
          score,
        },
      });
    }

    // Add XP
    if (xpEarned && xpEarned > 0) {
      await prisma.user.update({
        where: { id: req.userId },
        data: { xp: { increment: xpEarned } },
      });
    }

    // Log activity
    await prisma.activityLog.create({
      data: {
        userId: req.userId!,
        type: type || 'quiz',
        program,
        xpEarned: xpEarned || 0,
      },
    });

    res.json({ score: savedScore, isNewBest: !existing || score > existing.score });
  } catch (error) {
    console.error('Save score error:', error);
    res.status(500).json({ error: 'Failed to save score' });
  }
});

// GET /api/scores/my — get all user scores
router.get('/my', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.userId },
      orderBy: { completedAt: 'desc' },
    });

    res.json({ scores });
  } catch (error) {
    console.error('Get scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

// GET /api/scores/program/:program — get scores for a specific program
router.get('/program/:program', authMiddleware, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const scores = await prisma.score.findMany({
      where: { userId: req.userId, program: req.params.program as string },
      orderBy: { completedAt: 'desc' },
    });

    res.json({ scores });
  } catch (error) {
    console.error('Get program scores error:', error);
    res.status(500).json({ error: 'Failed to fetch scores' });
  }
});

export default router;
