import { prisma } from "../../config/prisma";
import {
  CreateBudgetInput,
  findOverlappingBudgetResponse,
  GetBudgetsQuery,
  UpdateBudgetInput,
} from "./budget.types";

export const budgetRepository = {
  async findBudgetById(id: number) {
    return prisma.budget.findUnique({ where: { id } });
  },
  async findBudgetsByUserId(userId: number, query: GetBudgetsQuery) {
    return prisma.budget.findMany({
      where: {
        userId,
        startDate: { gte: query.startDate, lte: query.endDate },
      },
    });
  },
  async createBudget(data: CreateBudgetInput, userId: number) {
    return prisma.budget.create({
      data: {
        ...data,
        userId,
      },
    });
  },
  async updateBudget(data: UpdateBudgetInput, id: number) {
    return prisma.budget.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async deleteBudget(id: number) {
    return prisma.budget.delete({ where: { id } });
  },
  async findOverlappingBudget({
    userId,
    categoryId,
    startDate,
    endDate,
    excludeBudgetId,
  }: findOverlappingBudgetResponse) {
    return prisma.budget.findFirst({
      where: {
        userId,
        categoryId,
        id: { not: excludeBudgetId },
        endDate: { gte: startDate },
        startDate: { lte: endDate },
      },
    });
  },
  async getSpentAmount(
    userId: number,
    categoryId: number,
    startDate: Date,
    endDate: Date,
  ) {
    return prisma.transaction.aggregate({
      where: {
        userId,
        categoryId,
        type: "EXPENSE",
        createdAt: { gte: startDate, lte: endDate },
      },
      _sum: {
        amount: true,
      },
    });
  },
};
