import 'dotenv/config';
import { z } from 'zod';

const envSchema = z.object({
  DATABASE_URL: z.string().min(1),
  PORT: z.string().transform(Number).default('3001'),
  HOST: z.string().default('0.0.0.0'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  JWT_SECRET: z.string().min(32),
  JWT_EXPIRES_IN: z.string().default('7d'),
  CORS_ORIGIN: z.string().default('http://localhost:5173'),
  RATE_LIMIT_MAX: z.string().transform(Number).default('100'),
  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const config = {
  databaseUrl: parsed.data.DATABASE_URL,
  port: parsed.data.PORT,
  host: parsed.data.HOST,
  nodeEnv: parsed.data.NODE_ENV,
  jwtSecret: parsed.data.JWT_SECRET,
  jwtExpiresIn: parsed.data.JWT_EXPIRES_IN,
  corsOrigin: parsed.data.CORS_ORIGIN,
  rateLimitMax: parsed.data.RATE_LIMIT_MAX,
  rateLimitWindowMs: parsed.data.RATE_LIMIT_WINDOW_MS,
} as const;

export type Config = typeof config;
