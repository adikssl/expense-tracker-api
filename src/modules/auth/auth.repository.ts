import { prisma } from "../../config/prisma";
import { RegisterInput } from "./auth.types";

export const authRepository = {
  async findUserByEmail(email: string) {
    return prisma.user.findUnique({ where: { email } });
  },
  async createUser(data: RegisterInput) {
    return prisma.user.create({ data });
  },
  async findRefreshToken(tokenHash: string) {
    return prisma.refreshToken.findUnique({ where: { tokenHash } });
  },
  async createRefreshToken(tokenHash: string, userId: number, expiresAt: Date) {
    return prisma.refreshToken.create({
      data: {
        tokenHash,
        userId,
        expiresAt,
      },
    });
  },
  async revokeRefreshToken(id: number) {
    return prisma.refreshToken.update({
      where: { id },
      data: { revoked: true },
    });
  },
};
