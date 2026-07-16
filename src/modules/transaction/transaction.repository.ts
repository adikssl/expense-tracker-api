import { prisma } from "../../config/prisma";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./transaction.types";

export const transactionRepository = {
  async findTransactionById(id: number) {
    return prisma.transaction.findUnique({ where: { id } });
  },
  async findTransactionsByUserId(userId: number) {
    return prisma.transaction.findMany({ where: { userId } });
  },
  async createTransaction(data: CreateTransactionInput, userId: number) {
    return prisma.$transaction(async (tx) => {
      const transaction = await tx.transaction.create({
        data: {
          ...data,
          userId,
        },
      });
      const balanceChange = data.type === "INCOME" ? data.amount : -data.amount;
      await tx.wallet.update({
        where: { id: data.walletId },
        data: { balance: { increment: balanceChange } },
      });
      return transaction;
    });
  },
  async updateTransaction(data: UpdateTransactionInput, id: number) {
    return prisma.transaction.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async deleteTransaction(id: number) {
    return prisma.$transaction(async (tx) => {
      const deletedTransaction = await tx.transaction.delete({ where: { id } });
      const balanceChange =
        deletedTransaction.type === "INCOME"
          ? deletedTransaction.amount.negated()
          : deletedTransaction.amount;
      await tx.wallet.update({
        where: {
          id: deletedTransaction.walletId,
        },
        data: {
          balance: { increment: balanceChange },
        },
      });
      return deletedTransaction;
    });
  },
};
