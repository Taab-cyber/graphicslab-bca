import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import userRoutes from './routes/users';
import scoreRoutes from './routes/scores';
import activityRoutes from './routes/activity';
import adminRoutes from './routes/admin';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL ? [process.env.FRONTEND_URL] : ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
  credentials: true,
}));
app.use(express.json());

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', name: 'GraphicsLab API', version: '1.0.0' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/scores', scoreRoutes);
app.use('/api/activity', activityRoutes);
app.use('/api/admin', adminRoutes);

// Error handler
app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('Server error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`🎨 GraphicsLab API running on http://localhost:${PORT}`);
});

export default app;
