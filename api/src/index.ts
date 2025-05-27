import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import feedbackRoutes from './routes/feedbackRoutes';
import { errorHandler } from './middleware/errorHandler';
import { logger } from './middleware/logger';
import { setupSwagger } from './config/swagger';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI =
  process.env.MONGODB_URI || 'mongodb://localhost:27017/express-app';

// Middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging
app.use(logger);

// CORS middleware
app.use((req, res, next) => {
  const origin = process.env.CORS_ORIGIN || '*';
  res.header('Access-Control-Allow-Origin', origin);
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, OPTIONS, PATCH',
  );
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization',
  );
  res.header('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Database connection
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Set up mongoose event listeners
    mongoose.connection.on('error', (err) => {
      console.error('❌ MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('⚠️  MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('🔄 MongoDB reconnected');
    });
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('\n📋 MongoDB Setup Instructions:');
    console.log('1. Install MongoDB locally:');
    console.log('   - macOS: brew install mongodb-community');
    console.log('   - Ubuntu: sudo apt install mongodb');
    console.log('   - Windows: Download from mongodb.com');
    console.log('2. Start MongoDB service:');
    console.log('   - macOS/Linux: sudo systemctl start mongod');
    console.log('   - Windows: Start MongoDB service');
    console.log('3. Or use MongoDB Atlas (cloud):');
    console.log('   - Visit mongodb.com/atlas');
    console.log('   - Create account and cluster');
    console.log('   - Update MONGODB_URI in .env');
    console.log('\n💡 Starting in demo mode without database...\n');

    // Continue without database for demo purposes
    return;
  }
};

// Root route
app.get('/', (req, res) => {
  res.json({
    message: 'Express + Mongoose API Server',
    status: 'running',
    timestamp: new Date().toISOString(),
    version: '1.0.0',
    endpoints: {
      health: '/health',
      users: '/api/users',
      feedback: '/api/feedback',
      documentation: '/api/docs',
      swaggerDocs: '/api-docs',
    },
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  const dbStatusMap: Record<number, string> = {
    0: 'disconnected',
    1: 'connected',
    2: 'connecting',
    3: 'disconnecting',
  };

  res.json({
    status: 'healthy',
    database: dbStatusMap[dbStatus] || 'unknown',
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// API Routes
app.use('/api/users', userRoutes);
app.use('/api/feedback', feedbackRoutes);

// Setup Swagger documentation
setupSwagger(app);

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    title: 'Express + Mongoose API Documentation',
    version: '1.0.0',
    baseUrl: `http://localhost:${PORT}`,
    endpoints: {
      users: {
        'GET /api/users': 'Get all users (with pagination)',
        'GET /api/users/:id': 'Get user by ID',
        'POST /api/users': 'Create new user',
        'PUT /api/users/:id': 'Update user',
        'DELETE /api/users/:id': 'Soft delete user',
        'DELETE /api/users/:id/permanent': 'Hard delete user',
      },
      feedback: {
        'GET /api/feedback':
          'Get all feedback (with pagination and rating filter)',
        'GET /api/feedback/:id': 'Get feedback by ID',
        'GET /api/feedback/stats': 'Get feedback statistics',
        'GET /api/feedback/email/:email': 'Get feedback by email',
        'POST /api/feedback': 'Create new feedback',
        'PUT /api/feedback/:id': 'Update feedback',
        'DELETE /api/feedback/:id': 'Delete feedback',
      },
      system: {
        'GET /': 'API information',
        'GET /health': 'Health check',
        'GET /api/docs': 'This documentation',
      },
    },
    examples: {
      createUser: {
        method: 'POST',
        url: '/api/users',
        body: {
          name: 'John Doe',
          email: 'john@example.com',
          password: 'password123',
          role: 'user',
        },
      },
      createFeedback: {
        method: 'POST',
        url: '/api/feedback',
        body: {
          name: 'Jane Smith',
          email: 'jane@example.com',
          feedback: 'Great service! Very satisfied with the experience.',
          rating: 5,
        },
      },
    },
  });
});

// Error handling middleware (must be after routes)
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Not Found',
    message: `Route ${req.originalUrl} not found`,
    availableEndpoints: [
      'GET /',
      'GET /health',
      'GET /api/docs',
      'GET /api/users',
      'POST /api/users',
      'GET /api/feedback',
      'POST /api/feedback',
    ],
  });
});

// Start server
const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log('🚀 Server Information:');
      console.log(`   ➜ Local:      http://localhost:${PORT}`);
      console.log(`   ➜ Health:     http://localhost:${PORT}/health`);
      console.log(`   ➜ API Docs:   http://localhost:${PORT}/api/docs`);
      console.log(`   ➜ Swagger:    http://localhost:${PORT}/api-docs`);
      console.log(`   ➜ Users:      http://localhost:${PORT}/api/users`);
      console.log(`   ➜ Feedback:   http://localhost:${PORT}/api/feedback`);
      console.log(`   ➜ Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('');

      if ((mongoose.connection.readyState as number) !== 1) {
        console.log(
          '⚠️  Running in demo mode - some features may not work without MongoDB',
        );
      }
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
const gracefulShutdown = async (): Promise<void> => {
  console.log('\n🛑 Shutting down gracefully...');

  try {
    if ((mongoose.connection.readyState as number) === 1) {
      await mongoose.connection.close();
      console.log('✅ Database connection closed');
    }
  } catch (error) {
    console.error('❌ Error closing database connection:', error);
  }

  process.exit(0);
};

process.on('SIGINT', () => void gracefulShutdown());
process.on('SIGTERM', () => void gracefulShutdown());

// Handle uncaught exceptions
process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception:', err);
  void gracefulShutdown();
});

process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  void gracefulShutdown();
});

void startServer();
