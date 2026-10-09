import 'dotenv/config';
import app from './app.js';
import prisma from './config/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Test database connection
    await prisma.$connect();
    console.log('✅ PostgreSQL database connected via Prisma Client successfully.');

    app.listen(PORT, () => {
      console.log(`🚀 Unified School ERP API Server running on http://localhost:${PORT}`);
      console.log(`📡 Environment: ${process.env.NODE_ENV || 'development'}`);
    });
  } catch (error) {
    console.error('❌ Failed to connect to database or start server:', error.message);
    process.exit(1);
  }
};

startServer();
