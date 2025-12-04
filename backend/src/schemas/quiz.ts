import { z } from 'zod';

export const submitQuizAttemptSchema = z.object({
  lessonId: z.string(),
  quizIndex: z.number().int().min(0),
  chosenIndex: z.number().int().min(0),
  correct: z.boolean(),
  timeTakenMs: z.number().int().positive().optional(),
});

export const getQuizStatsQuerySchema = z.object({
  lessonId: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export type SubmitQuizAttemptInput = z.infer<typeof submitQuizAttemptSchema>;
export type GetQuizStatsQuery = z.infer<typeof getQuizStatsQuerySchema>;
