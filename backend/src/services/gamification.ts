import { prisma } from '../lib/prisma';
import type { AwardXpInput } from '../schemas/gamification';

// XP amounts for different actions
export const XP_VALUES = {
  lesson_started: 10,
  lesson_completed: 50,
  quiz_passed: 10,
  quiz_perfect: 25,
  chapter_completed: 200,
  badge_earned: 50,
  streak_milestone: 100,
  first_login: 25,
} as const;

export class GamificationService {
  /**
   * Award XP to a user
   */
  async awardXp(userId: string, input: AwardXpInput) {
    const xpEvent = await prisma.xpEvent.create({
      data: {
        userId,
        amount: input.amount,
        reason: input.reason,
        sourceId: input.sourceId,
      },
    });

    // Check for badge unlocks after awarding XP
    await this.checkBadgeUnlocks(userId);

    return xpEvent;
  }

  /**
   * Get total XP for a user
   */
  async getTotalXp(userId: string) {
    const result = await prisma.xpEvent.aggregate({
      where: { userId },
      _sum: { amount: true },
    });

    return result._sum.amount ?? 0;
  }

  /**
   * Get XP history
   */
  async getXpHistory(userId: string, limit = 50) {
    return prisma.xpEvent.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  /**
   * Get user's current streak
   */
  async getStreak(userId: string) {
    let streak = await prisma.streak.findUnique({
      where: { userId },
    });

    if (!streak) {
      streak = await prisma.streak.create({
        data: {
          userId,
          currentStreak: 0,
          longestStreak: 0,
        },
      });
    }

    return streak;
  }

  /**
   * Update user's streak
   */
  async updateStreak(userId: string) {
    const streak = await this.getStreak(userId);
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    // If already active today, no update needed
    if (streak.lastActivityAt) {
      const lastActivityDate = new Date(
        streak.lastActivityAt.getFullYear(),
        streak.lastActivityAt.getMonth(),
        streak.lastActivityAt.getDate()
      );

      if (lastActivityDate.getTime() === today.getTime()) {
        return streak;
      }

      // Check if streak continues (activity yesterday)
      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      if (lastActivityDate.getTime() === yesterday.getTime()) {
        // Streak continues
        const newStreak = streak.currentStreak + 1;
        const updatedStreak = await prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: newStreak,
            longestStreak: Math.max(streak.longestStreak, newStreak),
            lastActivityAt: now,
          },
        });

        // Award bonus XP for streak milestones
        if (newStreak % 7 === 0) {
          await this.awardXp(userId, {
            amount: XP_VALUES.streak_milestone,
            reason: 'streak_milestone',
            sourceId: `streak:${newStreak}`,
          });
        }

        return updatedStreak;
      } else {
        // Streak broken, reset to 1
        return prisma.streak.update({
          where: { userId },
          data: {
            currentStreak: 1,
            streakStartedAt: now,
            lastActivityAt: now,
          },
        });
      }
    } else {
      // First activity, start streak
      return prisma.streak.update({
        where: { userId },
        data: {
          currentStreak: 1,
          streakStartedAt: now,
          lastActivityAt: now,
        },
      });
    }
  }

  /**
   * Get all badges
   */
  async getAllBadges() {
    return prisma.badge.findMany({
      orderBy: { sortOrder: 'asc' },
    });
  }

  /**
   * Get user's badges
   */
  async getUserBadges(userId: string) {
    return prisma.userBadge.findMany({
      where: { userId },
      include: { badge: true },
      orderBy: { awardedAt: 'desc' },
    });
  }

  /**
   * Award a badge to a user
   */
  async awardBadge(userId: string, badgeId: string) {
    // Check if already awarded
    const existing = await prisma.userBadge.findUnique({
      where: {
        userId_badgeId: { userId, badgeId },
      },
    });

    if (existing) {
      return existing;
    }

    const badge = await prisma.badge.findUnique({
      where: { id: badgeId },
    });

    if (!badge) {
      throw new Error('BADGE_NOT_FOUND');
    }

    const userBadge = await prisma.userBadge.create({
      data: {
        userId,
        badgeId,
      },
      include: { badge: true },
    });

    // Award XP for earning a badge
    if (badge.xpReward > 0) {
      await this.awardXp(userId, {
        amount: badge.xpReward,
        reason: 'badge_earned',
        sourceId: badgeId,
      });
    }

    return userBadge;
  }

  /**
   * Check and unlock badges based on user progress
   */
  async checkBadgeUnlocks(userId: string) {
    const [totalXp, streak, lessonsCompleted, chaptersCompleted, quizStats] = await Promise.all([
      this.getTotalXp(userId),
      this.getStreak(userId),
      prisma.lessonProgress.count({ where: { userId, status: 'complete' } }),
      prisma.chapterProgress.count({ where: { userId, status: 'complete' } }),
      prisma.quizAttempt.aggregate({
        where: { userId, correct: true, attemptNumber: 1 },
        _count: { _all: true },
      }),
    ]);

    const perfectQuizzes = quizStats._count._all;

    // Check each badge's criteria
    const badges = await prisma.badge.findMany();
    const userBadgeIds = (await this.getUserBadges(userId)).map((ub) => ub.badgeId);

    for (const badge of badges) {
      if (userBadgeIds.includes(badge.id)) continue;

      const criteria = typeof badge.criteria === 'string'
        ? JSON.parse(badge.criteria) as Record<string, number>
        : badge.criteria as Record<string, number>;
      let unlocked = false;

      // Check various criteria
      if (criteria.totalXp && totalXp >= criteria.totalXp) unlocked = true;
      if (criteria.streakDays && streak.currentStreak >= criteria.streakDays) unlocked = true;
      if (criteria.lessonsCompleted && lessonsCompleted >= criteria.lessonsCompleted) unlocked = true;
      if (criteria.chaptersCompleted && chaptersCompleted >= criteria.chaptersCompleted) unlocked = true;
      if (criteria.perfectQuizzes && perfectQuizzes >= criteria.perfectQuizzes) unlocked = true;

      if (unlocked) {
        await this.awardBadge(userId, badge.id);
      }
    }
  }

  /**
   * Get leaderboard
   */
  async getLeaderboard(limit = 10) {
    const xpTotals = await prisma.xpEvent.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
      take: limit,
    });

    const userIds = xpTotals.map((x) => x.userId);
    const profiles = await prisma.profile.findMany({
      where: { userId: { in: userIds } },
      select: {
        userId: true,
        displayName: true,
        avatarUrl: true,
        currentLevel: true,
      },
    });

    type ProfileData = { userId: string; displayName: string | null; avatarUrl: string | null; currentLevel: number };
    const profileMap = new Map<string, ProfileData>(profiles.map((p) => [p.userId, p as ProfileData]));

    return xpTotals.map((x, index) => {
      const profile = profileMap.get(x.userId);
      return {
        rank: index + 1,
        userId: x.userId,
        displayName: profile?.displayName ?? 'Anonymous',
        avatarUrl: profile?.avatarUrl ?? null,
        totalXp: x._sum.amount ?? 0,
        currentLevel: profile?.currentLevel ?? 1,
      };
    });
  }

  /**
   * Get user's rank in leaderboard
   */
  async getUserRank(userId: string) {
    const userXp = await this.getTotalXp(userId);

    const higherRanked = await prisma.xpEvent.groupBy({
      by: ['userId'],
      _sum: { amount: true },
      having: {
        amount: { _sum: { gt: userXp } },
      },
    });

    return higherRanked.length + 1;
  }
}

export const gamificationService = new GamificationService();
