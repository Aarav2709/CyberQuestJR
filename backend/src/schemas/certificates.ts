import { z } from 'zod';

export const certificateTypeSchema = z.enum(['lesson', 'chapter', 'course']);

export const createCertificateSchema = z.object({
  type: certificateTypeSchema,
  lessonId: z.string().optional(),
  chapterId: z.string().optional(),
  recipientName: z.string().min(2).max(100),
});

export type CreateCertificateInput = z.infer<typeof createCertificateSchema>;
