import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { quizService } from '../services/quiz';
import { submitQuizAttemptSchema } from '../schemas/quiz';

export async function quizRoutes(app: FastifyInstance) {
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
   * POST /quiz/attempt
   * Submit a quiz attempt
   */
  app.post('/attempt', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const body = submitQuizAttemptSchema.safeParse(request.body);

    if (!body.success) {
      return reply.status(400).send({
        success: false,
        error: { message: 'Validation error', details: body.error.flatten() },
      });
    }

    const attempt = await quizService.submitAttempt(payload.userId, body.data);

    return reply.send({
      success: true,
      data: attempt,
    });
  });

  /**
   * GET /quiz/attempts
   * Get quiz attempts for the current user
   */
  app.get('/attempts', async (request: FastifyRequest<{ Querystring: { lessonId?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const { lessonId } = request.query;

    const attempts = await quizService.getAttempts(payload.userId, lessonId);

    return reply.send({
      success: true,
      data: attempts,
    });
  });

  /**
   * GET /quiz/stats
   * Get quiz statistics for the current user
   */
  app.get('/stats', async (request: FastifyRequest<{ Querystring: { lessonId?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const { lessonId } = request.query;

    const stats = await quizService.getStats(payload.userId, lessonId);

    return reply.send({
      success: true,
      data: stats,
    });
  });

  /**
   * GET /quiz/breakdown
   * Get per-lesson quiz performance breakdown
   */
  app.get('/breakdown', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const breakdown = await quizService.getLessonBreakdown(payload.userId);

    return reply.send({
      success: true,
      data: breakdown,
    });
  });

  /**
   * GET /quiz/weak-topics
   * Get lessons where user is struggling
   */
  app.get('/weak-topics', async (request: FastifyRequest<{ Querystring: { threshold?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const threshold = request.query.threshold ? parseInt(request.query.threshold, 10) : 70;

    const weakTopics = await quizService.getWeakTopics(payload.userId, threshold);

    return reply.send({
      success: true,
      data: weakTopics,
    });
  });

  /**
   * GET /quiz/recent
   * Get recent quiz activity
   */
  app.get('/recent', async (request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;

    const recent = await quizService.getRecentActivity(payload.userId, limit);

    return reply.send({
      success: true,
      data: recent,
    });
  });
}
