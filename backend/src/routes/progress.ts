import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { progressService } from '../services/progress';
import { updateLessonProgressSchema, updateChapterProgressSchema, bulkSyncProgressSchema } from '../schemas/progress';

export async function progressRoutes(app: FastifyInstance) {
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
   * GET /progress
   * Get all progress for the current user
   */
  app.get('/', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const progress = await progressService.getAllProgress(payload.userId);

    return reply.send({
      success: true,
      data: progress,
    });
  });

  /**
   * POST /progress/lessons
   * Update lesson progress
   */
  app.post('/lessons', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const body = updateLessonProgressSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    const progress = await progressService.updateLessonProgress(payload.userId, body.data);

    return reply.send({
      success: true,
      data: progress,
    });
  });

  /**
   * POST /progress/chapters
   * Update chapter progress
   */
  app.post('/chapters', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const body = updateChapterProgressSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    const progress = await progressService.updateChapterProgress(payload.userId, body.data);

    return reply.send({
      success: true,
      data: progress,
    });
  });

  /**
   * POST /progress/sync
   * Bulk sync progress from client (for initial sync after login)
   */
  app.post('/sync', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const body = bulkSyncProgressSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    const progress = await progressService.bulkSyncProgress(payload.userId, body.data);

    return reply.send({
      success: true,
      data: progress,
    });
  });

  /**
   * GET /progress/history
   * Get progress history
   */
  app.get('/history', async (request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 50;

    const history = await progressService.getProgressHistory(payload.userId, limit);

    return reply.send({
      success: true,
      data: history,
    });
  });
}
