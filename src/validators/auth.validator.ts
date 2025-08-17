import { z } from 'zod';

export const loginSchema = z.object({
  body: z.object({
    username: z
      .string()
      .min(1, 'Username is required')
      .max(50, 'Username must be less than 50 characters')
      .regex(/^[a-zA-Z0-9._-]+$/, 'Username contains invalid characters'),
    password: z
      .string()
      .min(1, 'Password is required')
      .max(128, 'Password must be less than 128 characters'),
  }),
});

export type LoginRequest = z.infer<typeof loginSchema>['body'];