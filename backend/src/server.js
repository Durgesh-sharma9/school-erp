import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';
import { initWhatsApp } from './modules/whatsapp/whatsapp.service.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Attempt database connection
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected via Prisma Client successfully.');
  } catch (error) {
    console.warn('⚠️ Warning: PostgreSQL not reachable on localhost:5432. Running with resilient mock/fallback data.');
  }

  // Auto-connect WhatsApp session if paired
  initWhatsApp().catch(() => {});

  app.listen(PORT, () => {
    console.log(`🚀 Unified School ERP API Server running on http://localhost:${PORT}`);
    console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
  });
};

startServer();
