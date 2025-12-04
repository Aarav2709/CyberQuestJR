import type { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify';
import { gamificationService } from '../services/gamification';

export async function gamificationRoutes(app: FastifyInstance) {
  // All routes require authentication except leaderboard
  app.addHook('preHandler', async (request: FastifyRequest, reply: FastifyReply) => {
    // Skip auth for public leaderboard
    if (request.url.includes('/leaderboard')) {
      return;
    }

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
   * GET /gamification/xp
   * Get total XP for the current user
   */
  app.get('/xp', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const totalXp = await gamificationService.getTotalXp(payload.userId);

    return reply.send({
      success: true,
      data: { totalXp },
    });
  });

  /**
   * GET /gamification/xp/history
   * Get XP history for the current user
   */
  app.get('/xp/history', async (request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 50;

    const history = await gamificationService.getXpHistory(payload.userId, limit);

    return reply.send({
      success: true,
      data: history,
    });
  });

  /**
   * GET /gamification/streak
   * Get current streak for the current user
   */
  app.get('/streak', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const streak = await gamificationService.getStreak(payload.userId);

    return reply.send({
      success: true,
      data: streak,
    });
  });

  /**
   * GET /gamification/badges
   * Get all available badges
   */
  app.get('/badges', async (_request: FastifyRequest, reply: FastifyReply) => {
    const badges = await gamificationService.getAllBadges();

    return reply.send({
      success: true,
      data: badges,
    });
  });

  /**
   * GET /gamification/badges/me
   * Get badges earned by current user
   */
  app.get('/badges/me', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const badges = await gamificationService.getUserBadges(payload.userId);

    return reply.send({
      success: true,
      data: badges,
    });
  });

  /**
   * GET /gamification/leaderboard
   * Get XP leaderboard (public)
   */
  app.get('/leaderboard', async (request: FastifyRequest<{ Querystring: { limit?: string } }>, reply: FastifyReply) => {
    const limit = request.query.limit ? parseInt(request.query.limit, 10) : 10;
    const leaderboard = await gamificationService.getLeaderboard(limit);

    return reply.send({
      success: true,
      data: leaderboard,
    });
  });

  /**
   * GET /gamification/rank
   * Get current user's rank in leaderboard
   */
  app.get('/rank', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };
    const rank = await gamificationService.getUserRank(payload.userId);
    const totalXp = await gamificationService.getTotalXp(payload.userId);

    return reply.send({
      success: true,
      data: { rank, totalXp },
    });
  });

  /**
   * GET /gamification/summary
   * Get full gamification summary for current user
   */
  app.get('/summary', async (request: FastifyRequest, reply: FastifyReply) => {
    const payload = request.user as { userId: string };

    const [totalXp, streak, badges, rank] = await Promise.all([
      gamificationService.getTotalXp(payload.userId),
      gamificationService.getStreak(payload.userId),
      gamificationService.getUserBadges(payload.userId),
      gamificationService.getUserRank(payload.userId),
    ]);

    return reply.send({
      success: true,
      data: {
        totalXp,
        rank,
        currentStreak: streak.currentStreak,
        longestStreak: streak.longestStreak,
        lastActivityAt: streak.lastActivityAt,
        badgesEarned: badges.length,
        badges: badges.map((ub) => ub.badge),
      },
    });
  });
}
