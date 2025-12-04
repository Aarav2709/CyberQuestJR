import { z } from 'zod';

// Common schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password must be at most 128 characters');

// Auth schemas
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  displayName: z.string().min(2).max(50),
  isParentGuided: z.boolean().optional().default(false),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export const changePasswordSchema = z.object({
  currentPassword: z.string(),
  newPassword: passwordSchema,
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
