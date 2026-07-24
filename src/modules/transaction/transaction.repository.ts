import { prisma } from "../../config/prisma";
import {
  CreateTransactionInput,
  GetTransactionsQuery,
  UpdateTransactionInput,
} from "./transaction.types";

export const transactionRepository = {
  async findTransactionById(id: number) {
    return prisma.transaction.findUnique({ where: { id } });
  },
  async findTransactionsByUserId(userId: number, query: GetTransactionsQuery) {
    const where = {
      userId,
      type: query.type,
      categoryId: query.categoryId,
      walletId: query.walletId,
      amount: { gte: query.minAmount, lte: query.maxAmount },
      createdAt: { gte: query.createdAtFrom, lte: query.createdAtTo },
    };
    const [data, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        skip: (query.page - 1) * query.limit,
        take: query.limit,
        orderBy: { [query.sortBy]: query.order },
      }),
      prisma.transaction.count({ where }),
    ]);
    return { data, total };
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
