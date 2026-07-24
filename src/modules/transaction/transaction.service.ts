import { categoryService } from "../category/category.service";
import { walletService } from "../wallet/wallet.service";
import { transactionRepository } from "./transaction.repository";
import {
  CreateTransactionInput,
  GetTransactionsQuery,
  UpdateTransactionInput,
} from "./transaction.types";

export const transactionService = {
  async findTransactionById(id: number, userId: number) {
    const transaction = await transactionRepository.findTransactionById(id);
    if (!transaction) {
      throw new Error(`Transaction with ${id} not found`);
    }
    if (transaction.userId !== userId) {
      throw new Error("Access denied");
    }
    return transaction;
  },
  async findTransactionsByUserId(userId: number, query: GetTransactionsQuery) {
    const { data, total } =
      await transactionRepository.findTransactionsByUserId(userId, query);
    const { page, limit } = query;
    const totalPages = Math.ceil(total / limit);
    return {
      data,
      meta: {
        total,
        page,
        totalPages,
      },
    };
  },
  async createTransaction(data: CreateTransactionInput, userId: number) {
    await walletService.findWalletById(data.walletId, userId);
    if (data.categoryId) {
      await categoryService.findCategoryById(data.categoryId, userId);
    }
    return transactionRepository.createTransaction({ ...data }, userId);
  },
  async updateTransaction(
    data: UpdateTransactionInput,
    id: number,
    userId: number,
  ) {
    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update");
    }
    if (data.categoryId) {
      await categoryService.findCategoryById(data.categoryId, userId);
    }
    await this.findTransactionById(id, userId);
    return transactionRepository.updateTransaction({ ...data }, id);
  },
  async deleteTransaction(id: number, userId: number) {
    await this.findTransactionById(id, userId);
    return await transactionRepository.deleteTransaction(id);
  },
};
