import { prisma } from '../lib/prisma';
import { gamificationService } from './gamification';
import type { SubmitQuizAttemptInput } from '../schemas/quiz';

export class QuizService {
  /**
   * Submit a quiz attempt
   */
  async submitAttempt(userId: string, input: SubmitQuizAttemptInput) {
    // Get the current attempt number for this quiz
    const previousAttempts = await prisma.quizAttempt.count({
      where: {
        userId,
        lessonId: input.lessonId,
        quizIndex: input.quizIndex,
      },
    });

    const attemptNumber = previousAttempts + 1;

    const attempt = await prisma.quizAttempt.create({
      data: {
        userId,
        lessonId: input.lessonId,
        quizIndex: input.quizIndex,
        chosenIndex: input.chosenIndex,
        correct: input.correct,
        attemptNumber,
        timeTakenMs: input.timeTakenMs,
      },
    });

    // Award XP for correct answers
    if (input.correct) {
      // First-time correct answer gets more XP
      const xpAmount = attemptNumber === 1 ? 25 : 10;
      const reason = attemptNumber === 1 ? 'quiz_perfect' : 'quiz_passed';

      await gamificationService.awardXp(userId, {
        amount: xpAmount,
        reason,
        sourceId: `${input.lessonId}:${input.quizIndex}`,
      });

      // Update streak on correct quiz answer
      await gamificationService.updateStreak(userId);
    }

    return attempt;
  }

  /**
   * Get quiz attempts for a user
   */
  async getAttempts(userId: string, lessonId?: string) {
    const where: { userId: string; lessonId?: string } = { userId };
    if (lessonId) {
      where.lessonId = lessonId;
    }

    return prisma.quizAttempt.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get quiz statistics for a user
   */
  async getStats(userId: string, lessonId?: string) {
    const where: { userId: string; lessonId?: string } = { userId };
    if (lessonId) {
      where.lessonId = lessonId;
    }

    const [totalAttempts, correctAttempts, firstTryCorrect] = await Promise.all([
      prisma.quizAttempt.count({ where }),
      prisma.quizAttempt.count({ where: { ...where, correct: true } }),
      prisma.quizAttempt.count({ where: { ...where, correct: true, attemptNumber: 1 } }),
    ]);

    const accuracy = totalAttempts > 0 ? Math.round((correctAttempts / totalAttempts) * 100) : 0;
    const firstTryRate = totalAttempts > 0 ? Math.round((firstTryCorrect / totalAttempts) * 100) : 0;

    return {
      totalAttempts,
      correctAttempts,
      firstTryCorrect,
      accuracy,
      firstTryRate,
    };
  }

  /**
   * Get per-lesson breakdown of quiz performance
   */
  async getLessonBreakdown(userId: string) {
    const attempts = await prisma.quizAttempt.groupBy({
      by: ['lessonId'],
      where: { userId },
      _count: { _all: true },
      _sum: { correct: true },
    });

    // Get lesson details
    const lessonIds = attempts.map((a) => a.lessonId);
    const lessons = await prisma.lesson.findMany({
      where: { id: { in: lessonIds } },
      select: { id: true, title: true },
    });

    const lessonMap = new Map(lessons.map((l) => [l.id, l.title]));

    return attempts.map((a) => ({
      lessonId: a.lessonId,
      lessonTitle: lessonMap.get(a.lessonId) ?? 'Unknown Lesson',
      totalAttempts: a._count._all,
      correctAttempts: a._sum.correct ?? 0,
      accuracy: a._count._all > 0 ? Math.round(((a._sum.correct ?? 0) / a._count._all) * 100) : 0,
    }));
  }

  /**
   * Get weak topics (lessons with low accuracy)
   */
  async getWeakTopics(userId: string, threshold = 70) {
    const breakdown = await this.getLessonBreakdown(userId);

    return breakdown
      .filter((b) => b.totalAttempts >= 3 && b.accuracy < threshold)
      .sort((a, b) => a.accuracy - b.accuracy);
  }

  /**
   * Get recent quiz activity
   */
  async getRecentActivity(userId: string, limit = 10) {
    return prisma.quizAttempt.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        lesson: {
          select: { id: true, title: true },
        },
      },
    });
  }
}

export const quizService = new QuizService();
