import { z } from 'zod';

export const xpReasonSchema = z.enum([
  'lesson_started',
  'lesson_completed',
  'quiz_passed',
  'quiz_perfect',
  'chapter_completed',
  'badge_earned',
  'streak_milestone',
  'first_login',
]);

export const awardXpSchema = z.object({
  amount: z.number().int().positive(),
  reason: xpReasonSchema,
  sourceId: z.string().optional(),
});

export type AwardXpInput = z.infer<typeof awardXpSchema>;
