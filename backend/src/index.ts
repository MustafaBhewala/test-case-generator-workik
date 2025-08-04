import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import { githubRoutes } from './routes/github';
import { aiRoutes } from './routes/ai';
import { authRoutes } from './routes/auth';

// Load environment variables first
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/github', githubRoutes);
app.use('/api/ai', aiRoutes);

// Root route for backend
app.get('/', (req, res) => {
  res.json({
    message: 'Test Case Generator API Server',
    status: 'Running',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      auth: '/api/auth/*',
      github: '/api/github/*',
      ai: '/api/ai/*'
    },
    frontend: process.env.FRONTEND_URL || 'http://localhost:5173'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  res.status(500).json({
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? error.message : 'Something went wrong'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
});
