import { prisma } from '../lib/prisma';
import { gamificationService } from './gamification';
import type { UpdateLessonProgressInput, UpdateChapterProgressInput, BulkSyncProgressInput } from '../schemas/progress';

export class ProgressService {
  /**
   * Get all progress for a user
   */
  async getAllProgress(userId: string) {
    const [lessonProgress, chapterProgress] = await Promise.all([
      prisma.lessonProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      }),
      prisma.chapterProgress.findMany({
        where: { userId },
        orderBy: { updatedAt: 'desc' },
      }),
    ]);

    return {
      lessons: lessonProgress,
      chapters: chapterProgress,
    };
  }

  /**
   * Update lesson progress
   */
  async updateLessonProgress(userId: string, input: UpdateLessonProgressInput) {
    const now = new Date();
    const isCompleting = input.status === 'complete';
    const isStarting = input.status === 'started';

    const existing = await prisma.lessonProgress.findUnique({
      where: {
        userId_lessonId: {
          userId,
          lessonId: input.lessonId,
        },
      },
    });

    const progress = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId,
          lessonId: input.lessonId,
        },
      },
      create: {
        userId,
        lessonId: input.lessonId,
        status: input.status,
        startedAt: isStarting || isCompleting ? now : null,
        doneAt: isCompleting ? now : null,
      },
      update: {
        status: input.status,
        startedAt: isStarting && !existing?.startedAt ? now : undefined,
        doneAt: isCompleting ? now : undefined,
      },
    });

    // Record progress history
    await prisma.progressHistory.create({
      data: {
        userId,
        lessonId: input.lessonId,
        event: input.status === 'started' ? 'lesson_started' : input.status === 'complete' ? 'lesson_completed' : 'progress_updated',
        xpAwarded: 0,
      },
    });

    // Award XP for completing a lesson (if not already completed)
    if (isCompleting && existing?.status !== 'complete') {
      await gamificationService.awardXp(userId, {
        amount: 50,
        reason: 'lesson_completed',
        sourceId: input.lessonId,
      });

      // Update streak
      await gamificationService.updateStreak(userId);
    }

    return progress;
  }

  /**
   * Update chapter progress
   */
  async updateChapterProgress(userId: string, input: UpdateChapterProgressInput) {
    const now = new Date();
    const isCompleting = input.status === 'complete';
    const isStarting = input.status === 'started';

    const existing = await prisma.chapterProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId: input.chapterId,
        },
      },
    });

    const progress = await prisma.chapterProgress.upsert({
      where: {
        userId_chapterId: {
          userId,
          chapterId: input.chapterId,
        },
      },
      create: {
        userId,
        chapterId: input.chapterId,
        status: input.status,
        startedAt: isStarting || isCompleting ? now : null,
        doneAt: isCompleting ? now : null,
      },
      update: {
        status: input.status,
        startedAt: isStarting && !existing?.startedAt ? now : undefined,
        doneAt: isCompleting ? now : undefined,
      },
    });

    // Award XP for completing a chapter (if not already completed)
    if (isCompleting && existing?.status !== 'complete') {
      await gamificationService.awardXp(userId, {
        amount: 200,
        reason: 'chapter_completed',
        sourceId: input.chapterId,
      });
    }

    return progress;
  }

  /**
   * Bulk sync progress from client (for initial sync after login)
   */
  async bulkSyncProgress(userId: string, input: BulkSyncProgressInput) {
    // Process lessons
    for (const lesson of input.lessons) {
      await prisma.lessonProgress.upsert({
        where: {
          userId_lessonId: {
            userId,
            lessonId: lesson.lessonId,
          },
        },
        create: {
          userId,
          lessonId: lesson.lessonId,
          status: lesson.status,
          doneAt: lesson.doneAt ? new Date(lesson.doneAt) : null,
        },
        update: {
          status: lesson.status,
          doneAt: lesson.doneAt ? new Date(lesson.doneAt) : null,
        },
      });
    }

    // Process chapters
    for (const chapter of input.chapters) {
      await prisma.chapterProgress.upsert({
        where: {
          userId_chapterId: {
            userId,
            chapterId: chapter.chapterId,
          },
        },
        create: {
          userId,
          chapterId: chapter.chapterId,
          status: chapter.status,
          doneAt: chapter.doneAt ? new Date(chapter.doneAt) : null,
        },
        update: {
          status: chapter.status,
          doneAt: chapter.doneAt ? new Date(chapter.doneAt) : null,
        },
      });
    }

    return this.getAllProgress(userId);
  }

  /**
   * Get progress history
   */
  async getProgressHistory(userId: string, limit = 50) {
    return prisma.progressHistory.findMany({
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

export const progressService = new ProgressService();
