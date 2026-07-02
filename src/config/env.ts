import dotenv from "dotenv";
import * as z from "zod";
dotenv.config();

const envSchema = z.object({
  PORT: z.coerce.number().positive().max(65535).default(3000),
  JWT_SECRET: z
    .string()
    .min(32, "JWT secret must be at least 32 characters long"),
  DATABASE_URL: z.url(),
});
const parsedEnv = envSchema.parse(process.env);

export const PORT = parsedEnv.PORT;
export const JWT_SECRET = parsedEnv.JWT_SECRET;
export const DATABASE_URL = parsedEnv.DATABASE_URL;
