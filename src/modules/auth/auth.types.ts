import z from "zod";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schema";

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type RefreshInput = z.infer<typeof refreshTokenSchema>;
export interface AuthResponse {
  user: {
    id: number;
    email: string;
    name: string;
  };
  accessToken: string;
  refreshToken: string;
}
