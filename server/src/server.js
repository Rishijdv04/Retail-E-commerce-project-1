import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoose from 'mongoose';

import { connectDB, disconnectDB } from './config/db.js';
import { seedData } from './seed.js';

import Product from './models/Product.js';
import User from './models/User.js';
import Order from './models/Order.js';
import Category from './models/Category.js';
import { renderDashboard } from './views/dashboard.js';

import authRoutes from './routes/authRoutes.js';
import productRoutes from './routes/productRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import sellerRoutes from './routes/sellerRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

import { notFound, errorHandler } from './middlewares/error.js';
import { apiLimiter } from './middlewares/rateLimiter.js';

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

// 1. Security & Core Middlewares
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
  contentSecurityPolicy: false, // allow inline styles/scripts for API dashboard
}));

const allowedOrigins = [
  CLIENT_URL,
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'x-auth-token'],
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 2. Interactive Server Dashboard for root '/'
app.get('/', async (req, res, next) => {
  try {
    const isDbConnected = mongoose.connection.readyState === 1;
    const counts = { products: 0, users: 0, orders: 0, categories: 0 };
    if (isDbConnected) {
      const [p, u, o, c] = await Promise.all([
        Product.countDocuments(),
        User.countDocuments(),
        Order.countDocuments(),
        Category.countDocuments(),
      ]);
      counts.products = p;
      counts.users = u;
      counts.orders = o;
      counts.categories = c;
    }
    const html = renderDashboard({
      uptime: process.uptime(),
      mongoStatus: isDbConnected ? '🟢 Connected (Active)' : '🔴 Disconnected',
      dbName: mongoose.connection.name || 'swiftcart',
      counts,
      port: PORT,
      clientUrl: CLIENT_URL,
    });
    res.setHeader('Content-Type', 'text/html');
    res.send(html);
  } catch (err) {
    next(err);
  }
});

// 3. Health check route
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'SwiftCart API',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// 4. Mount Routes
app.use('/api', apiLimiter);
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/sellers', sellerRoutes);
app.use('/api/admin', adminRoutes);

// 5. Fallback 404 & Centralized Error Handler
app.use(notFound);
app.use(errorHandler);

// 6. Server Lifecycle & Boot
let serverInstance = null;

async function startServer() {
  try {
    await connectDB();
    await seedData();

    serverInstance = app.listen(PORT, () => {
      console.log('====================================================');
      console.log(`🚀 SwiftCart API Server running in [${process.env.NODE_ENV || 'development'}] mode`);
      console.log(`📍 Web Dashboard: http://localhost:${PORT}`);
      console.log(`🩺 Health check:  http://localhost:${PORT}/api/health`);
      console.log(`🌐 Allowed CORS:  ${CLIENT_URL}`);
      console.log('====================================================');
    });
  } catch (err) {
    console.error('❌ Failed to start SwiftCart API server:', err);
    process.exit(1);
  }
}

// Graceful shutdown
async function gracefulShutdown(signal) {
  console.log(`\n[Server] Received ${signal}. Shutting down gracefully...`);
  if (serverInstance) {
    serverInstance.close(async () => {
      console.log('[Server] HTTP server closed.');
      await disconnectDB();
      console.log('[Server] Database connections closed. Process terminating.');
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
}

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

startServer();

export default app;
