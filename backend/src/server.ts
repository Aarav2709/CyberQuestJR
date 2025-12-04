import Fastify from 'fastify';
import cors from '@fastify/cors';
import helmet from '@fastify/helmet';
import rateLimit from '@fastify/rate-limit';
import sensible from '@fastify/sensible';
import jwt from '@fastify/jwt';
import './types/fastify.d.ts';

import { config } from './config/index';
import { prisma } from './lib/prisma';
import { authRoutes } from './routes/auth';
import { profileRoutes } from './routes/profile';
import { progressRoutes } from './routes/progress';
import { quizRoutes } from './routes/quiz';
import { gamificationRoutes } from './routes/gamification';
import { certificateRoutes } from './routes/certificates';

const app = Fastify({
  logger: {
    level: config.nodeEnv === 'development' ? 'debug' : 'info',
    transport:
      config.nodeEnv === 'development'
        ? {
            target: 'pino-pretty',
            options: { colorize: true },
          }
        : undefined,
  },
});

// Plugins
await app.register(cors, {
  origin: config.corsOrigin,
  credentials: true,
});

await app.register(helmet, {
  contentSecurityPolicy: false,
});

await app.register(rateLimit, {
  max: config.rateLimitMax,
  timeWindow: config.rateLimitWindowMs,
});

await app.register(sensible);

await app.register(jwt, {
  secret: config.jwtSecret,
  sign: {
    expiresIn: config.jwtExpiresIn,
  },
});

// Root route
app.get('/', async () => {
  return {
    name: 'CyberQuestJR API',
    version: '1.0.0',
    status: 'running',
  };
});

// Health check
app.get('/health', async () => {
  return { status: 'ok', timestamp: new Date().toISOString() };
});

// API Routes
await app.register(authRoutes, { prefix: '/api/auth' });
await app.register(profileRoutes, { prefix: '/api/profile' });
await app.register(progressRoutes, { prefix: '/api/progress' });
await app.register(quizRoutes, { prefix: '/api/quiz' });
await app.register(gamificationRoutes, { prefix: '/api/gamification' });
await app.register(certificateRoutes, { prefix: '/api/certificates' });

// Global error handler
app.setErrorHandler((error, _request, reply) => {
  app.log.error(error);

  const statusCode = error.statusCode ?? 500;
  const message = statusCode === 500 ? 'Internal Server Error' : error.message;

  reply.status(statusCode).send({
    success: false,
    error: {
      message,
      code: error.code ?? 'INTERNAL_ERROR',
    },
  });
});

// Graceful shutdown
const shutdown = async () => {
  app.log.info('Shutting down gracefully...');
  await app.close();
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start server
const start = async () => {
  try {
    await prisma.$connect();
    app.log.info('Database connected');

    await app.listen({ port: config.port, host: config.host });
    app.log.info(`Server running at http://${config.host}:${config.port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

start();

export { app };
