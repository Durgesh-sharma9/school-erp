import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './core/middleware/errorHandler.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));

if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Unified School ERP SaaS API is running healthy',
    timestamp: new Date().toISOString()
  });
});

// Feature Modules Routes
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
app.use('/api/dashboard', dashboardRoutes);

// Global Error Handler
app.use(errorHandler);

export default app;
