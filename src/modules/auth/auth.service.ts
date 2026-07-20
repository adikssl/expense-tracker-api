import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/env";
import { generateRefreshToken, hashToken } from "../../utils/token.utils";
import { authRepository } from "./auth.repository";
import { AuthResponse, LoginInput, RegisterInput } from "./auth.types";

const issueTokenPair = async (userId: number) => {
  const accessToken = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "15m" });
  const rawRefreshToken = generateRefreshToken();
  const hashedRefreshToken = hashToken(rawRefreshToken);
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 30);
  await authRepository.createRefreshToken(
    hashedRefreshToken,
    userId,
    expiresAt,
  );
  return {
    accessToken,
    refreshToken: rawRefreshToken,
  };
};

export const authService = {
  async registerUser(data: RegisterInput): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(data.email);
    if (user) {
      throw new Error("Email already in use");
    }
    const passwordHash = await bcrypt.hash(data.password, 10);
    const newUser = await authRepository.createUser({
      ...data,
      password: passwordHash,
    });
    const tokens = await issueTokenPair(newUser.id);
    return {
      user: {
        id: newUser.id,
        email: newUser.email,
        name: newUser.name,
      },
      ...tokens,
    };
  },
  async loginUser(data: LoginInput): Promise<AuthResponse> {
    const user = await authRepository.findUserByEmail(data.email);
    if (!user) {
      throw new Error("Invalid email or password");
    }
    const isMatch = await bcrypt.compare(data.password, user.password);
    if (!isMatch) {
      throw new Error("Invalid email or password");
    }
    const tokens = await issueTokenPair(user.id);
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      ...tokens,
    };
  },
  async refreshAccessToken(
    rawToken?: string,
  ): Promise<{ accessToken: string; refreshToken: string }> {
    if (!rawToken) {
      throw new Error("Refresh token is required");
    }
    const hashedToken = hashToken(rawToken);
    const ref = await authRepository.findRefreshToken(hashedToken);
    if (!ref) {
      throw new Error("Invalid refresh token");
    }
    if (ref.revoked) {
      throw new Error("Refresh token already revoked");
    }
    if (ref.expiresAt < new Date()) {
      throw new Error("Refresh token has expires");
    }
    await authRepository.revokeRefreshToken(ref.id);
    const { accessToken, refreshToken } = await issueTokenPair(ref.userId);
    return { accessToken, refreshToken };
  },
  async logout(rawToken?: string): Promise<void> {
    if (!rawToken) {
      return;
    }
    const hashedToken = hashToken(rawToken);
    const ref = await authRepository.findRefreshToken(hashedToken);
    if (!ref) {
      return;
    }
    await authRepository.revokeRefreshToken(ref.id);
  },
};
