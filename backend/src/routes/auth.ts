import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { authService } from '../services/auth';
import { registerSchema, loginSchema, changePasswordSchema } from '../schemas/auth';

// Extend FastifyRequest to include user
declare module 'fastify' {
  interface FastifyRequest {
    userId?: string;
  }
}

export async function authRoutes(app: FastifyInstance) {
  /**
   * POST /auth/register
   * Register a new user account
   */
  app.post('/register', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = registerSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    try {
      const result = await authService.register(body.data);
      return reply.status(201).send({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'EMAIL_EXISTS') {
        return reply.status(409).send({
          success: false,
          error: { message: 'An account with this email already exists', code: 'EMAIL_EXISTS' },
        });
      }
      throw error;
    }
  });

  /**
   * POST /auth/login
   * Login and receive session token
   */
  app.post('/login', async (request: FastifyRequest, reply: FastifyReply) => {
    const body = loginSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    try {
      const result = await authService.login(body.data);

      // Also generate a JWT for API access
      const jwt = app.jwt.sign({ userId: result.user.id });

      return reply.send({
        success: true,
        data: {
          user: result.user,
          token: jwt,
          sessionToken: result.token,
          expiresAt: result.expiresAt,
        },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return reply.status(401).send({
          success: false,
          error: { message: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
        });
      }
      throw error;
    }
  });

  /**
   * POST /auth/logout
   * Invalidate session token
   */
  app.post('/logout', async (request: FastifyRequest, reply: FastifyReply) => {
    const authHeader = request.headers.authorization;

    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.substring(7);
      await authService.logout(token);
    }

    return reply.send({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  });

  /**
   * GET /auth/me
   * Get current authenticated user
   */
  app.get('/me', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as { userId: string };
      const user = await authService.getUserById(payload.userId);

      if (!user) {
        return reply.status(401).send({
          success: false,
          error: { message: 'User not found', code: 'USER_NOT_FOUND' },
        });
      }

      return reply.send({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          profile: user.profile,
          isParentGuided: user.isParentGuided,
          createdAt: user.createdAt,
        },
      });
    } catch {
      return reply.status(401).send({
        success: false,
        error: { message: 'Not authenticated', code: 'UNAUTHORIZED' },
      });
    }
  });

  /**
   * POST /auth/change-password
   * Change user password
   */
  app.post('/change-password', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
      const payload = request.user as { userId: string };

      const body = changePasswordSchema.safeParse(request.body);

      if (!body.success) {
        return reply.status(400).send({
          success: false,
          error: { message: 'Validation error', details: body.error.flatten() },
        });
      }

      await authService.changePassword(payload.userId, body.data);

      return reply.send({
        success: true,
        data: { message: 'Password changed successfully' },
      });
    } catch (error) {
      if (error instanceof Error && error.message === 'INVALID_CREDENTIALS') {
        return reply.status(400).send({
          success: false,
          error: { message: 'Current password is incorrect', code: 'INVALID_CREDENTIALS' },
        });
      }
      throw error;
    }
  });
}
