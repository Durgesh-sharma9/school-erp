import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { errorHandler } from './core/middleware/errorHandler.js';
import { resolveTenant } from './core/middleware/tenant.js';

const app = express();

// Middlewares
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Enterprise Multi-Tenant Boundary Enforcement
app.use(resolveTenant);

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
import authRoutes from './modules/auth/auth.routes.js';
import dashboardRoutes from './modules/dashboard/dashboard.routes.js';
import studentRoutes from './modules/students/students.routes.js';
import feeRoutes from './modules/fees/fees.routes.js';
import schoolRoutes from './modules/schools/schools.routes.js';
import academicRoutes from './modules/academics/academics.routes.js';
import certificateRoutes from './modules/certificates/certificates.routes.js';
import studyMaterialRoutes from './modules/study-material/study-material.routes.js';
import crmRoutes from './modules/crm/crm.routes.js';
import greetingCardRoutes from './modules/greeting-card/greeting-card.routes.js';
import transportRoutes from './modules/transport/transport.routes.js';
import hostelRoutes from './modules/hostel/hostel.routes.js';
import examinationRoutes from './modules/examination/examination.routes.js';
import payrollRoutes from './modules/payroll/payroll.routes.js';
import frontOfficeRoutes from './modules/front-office/front-office.routes.js';
import libraryRoutes from './modules/library/library.routes.js';
import stationaryRoutes from './modules/stationary/stationary.routes.js';
import smsRoutes from './modules/sms/sms.routes.js';
import userManagementRoutes from './modules/user-management/user-management.routes.js';
import leaveManagementRoutes from './modules/leave-management/leave-management.routes.js';

app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/fees', feeRoutes);
app.use('/api/schools', schoolRoutes);
app.use('/api/academics', academicRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/study-material', studyMaterialRoutes);
app.use('/api/crm', crmRoutes);
app.use('/api/greeting-card', greetingCardRoutes);
app.use('/api/transport', transportRoutes);
app.use('/api/hostel', hostelRoutes);
app.use('/api/examination', examinationRoutes);
app.use('/api/payroll', payrollRoutes);
app.use('/api/front-office', frontOfficeRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/stationary', stationaryRoutes);
app.use('/api/sms', smsRoutes);
app.use('/api/user-management', userManagementRoutes);
app.use('/api/leave-management', leaveManagementRoutes);


// Global Error Handler
app.use(errorHandler);

export default app;
