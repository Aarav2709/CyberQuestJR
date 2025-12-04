import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { profileService } from '../services/profile';
import { updateProfileSchema } from '../schemas/profile';

export async function profileRoutes(app: FastifyInstance) {
  // All routes require authentication
  app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    try {
      await request.jwtVerify();
    } catch {
      return reply.status(401).send({
        success: false,
        error: { message: 'Not authenticated', code: 'UNAUTHORIZED' },
      });
    }
  });

  /**
   * GET /profile
   * Get current user's profile
   */
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const profile = await profileService.getProfile(payload.userId);

    return reply.send({
      success: true,
      data: profile,
    });
  });

  /**
   * PATCH /profile
   * Update current user's profile
   */
  app.patch('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const body = updateProfileSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    const profile = await profileService.updateProfile(payload.userId, body.data);

    return reply.send({
      success: true,
      data: profile,
    });
  });

  /**
   * GET /profile/dashboard
   * Get user dashboard with stats
   */
  app.get('/dashboard', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const dashboard = await profileService.getDashboard(payload.userId);

    return reply.send({
      success: true,
      data: dashboard,
    });
  });
}
