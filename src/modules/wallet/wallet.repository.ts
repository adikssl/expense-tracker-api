import { prisma } from "../../config/prisma";
import { CreateWalletInput, UpdateWalletInput } from "./wallet.types";

export const walletRepository = {
  async findWalletById(id: number) {
    return prisma.wallet.findUnique({ where: { id } });
  },
  async findWalletsByUserId(userId: number) {
    return prisma.wallet.findMany({ where: { userId } });
  },
  async createWallet(
    data: CreateWalletInput & { name: string },
    userId: number,
  ) {
    return prisma.wallet.create({
      data: {
        ...data,
        userId,
      },
    });
  },
  async updateWallet(data: UpdateWalletInput, id: number) {
    return prisma.wallet.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async deleteWallet(id: number) {
    return prisma.wallet.delete({ where: { id } });
  },
};
