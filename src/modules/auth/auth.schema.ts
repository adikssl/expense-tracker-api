import z from "zod";

export const registerSchema = z.object({
  email: z.email(),
  name: z.string().min(2).max(50),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(50),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z
    .string()
    .min(6, "password must be at least 6 characters long")
    .max(50),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().optional(),
});
