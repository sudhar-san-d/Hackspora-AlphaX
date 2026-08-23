import { z } from 'zod';

const optionalUrl = z.string().url().optional();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().min(1).max(65535).default(4000),
  CORS_ORIGIN: z.string().default('*'),
  SUPABASE_URL: optionalUrl,
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(20).optional(),
  OPENROUTER_API_KEY: z.string().min(10).optional(),
  OPENROUTER_MODEL: z.string().default('google/gemini-2.5-flash'),
  GROQ_API_KEY: z.string().min(10).optional(),
  GROQ_MODEL: z.string().default('llama-3.3-70b-versatile'),
  MAX_UPLOAD_BYTES: z.coerce.number().int().min(1024).max(20_000_000).default(8_000_000),
  DEMO_AUTH_ENABLED: z.enum(['true', 'false']).optional(),
});

export type AppConfig = z.infer<typeof envSchema> & { demoMode: boolean; demoAuth?: boolean };

export function loadConfig(env: NodeJS.ProcessEnv = process.env): AppConfig {
  const parsed = envSchema.parse(env);
  return {
    ...parsed,
    demoMode: !(parsed.SUPABASE_URL && parsed.SUPABASE_SERVICE_ROLE_KEY),
    demoAuth: parsed.DEMO_AUTH_ENABLED ? parsed.DEMO_AUTH_ENABLED === 'true' : parsed.NODE_ENV !== 'production',
  };
}
