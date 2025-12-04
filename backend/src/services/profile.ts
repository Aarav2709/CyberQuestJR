import { prisma } from '../lib/prisma';
import type { UpdateProfileInput } from '../schemas/profile';

export class ProfileService {
  /**
   * Get user profile
   */
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new Error('PROFILE_NOT_FOUND');
    }

    return profile;
  }

  /**
   * Update user profile
   */
  async updateProfile(userId: string, input: UpdateProfileInput) {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        displayName: input.displayName,
        avatarUrl: input.avatarUrl,
        bio: input.bio,
        timezone: input.timezone,
      },
    });

    return profile;
  }

  /**
   * Get full user dashboard data
   */
  async getDashboard(userId: string) {
    const [profile, xpTotal, streak, badgeCount, lessonCount, certificateCount] = await Promise.all([
      prisma.profile.findUnique({ where: { userId } }),
      prisma.xpEvent.aggregate({
        where: { userId },
        _sum: { amount: true },
      }),
      prisma.streak.findUnique({ where: { userId } }),
      prisma.userBadge.count({ where: { userId } }),
      prisma.lessonProgress.count({
        where: { userId, status: 'complete' },
      }),
      prisma.certificate.count({ where: { userId } }),
    ]);

    return {
      profile,
      stats: {
        totalXp: xpTotal._sum.amount ?? 0,
        currentStreak: streak?.currentStreak ?? 0,
        longestStreak: streak?.longestStreak ?? 0,
        badgesEarned: badgeCount,
        lessonsCompleted: lessonCount,
        certificatesEarned: certificateCount,
      },
    };
  }
}

export const profileService = new ProfileService();
