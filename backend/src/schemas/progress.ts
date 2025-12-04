import { z } from 'zod';

export const progressStatusSchema = z.enum(['fresh', 'started', 'complete']);

export const updateLessonProgressSchema = z.object({
  lessonId: z.string(),
  status: progressStatusSchema,
});

export const updateChapterProgressSchema = z.object({
  chapterId: z.string(),
  status: progressStatusSchema,
});

export const bulkSyncProgressSchema = z.object({
  lessons: z.array(
    z.object({
      lessonId: z.string(),
      status: progressStatusSchema,
      doneAt: z.string().datetime().nullable().optional(),
    })
  ),
  chapters: z.array(
    z.object({
      chapterId: z.string(),
      status: progressStatusSchema,
      doneAt: z.string().datetime().nullable().optional(),
    })
  ),
});

export type UpdateLessonProgressInput = z.infer<typeof updateLessonProgressSchema>;
export type UpdateChapterProgressInput = z.infer<typeof updateChapterProgressSchema>;
export type BulkSyncProgressInput = z.infer<typeof bulkSyncProgressSchema>;
