import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  LDAP_URL: z.string().min(1, 'LDAP_URL is required'),
  LDAP_DOMAIN: z.string().min(1, 'LDAP_DOMAIN is required'),
  LDAP_COMPANY: z.string().min(1, 'LDAP_COMPANY is required'),
  CORS_ORIGIN: z.string().default('*'),
});

const parseEnv = () => {
  try {
    return envSchema.parse(process.env);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errorMessages = error.errors.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      );
      throw new Error(`Environment validation failed:\n${errorMessages.join('\n')}`);
    }
    throw error;
  }
};

export const env = parseEnv();