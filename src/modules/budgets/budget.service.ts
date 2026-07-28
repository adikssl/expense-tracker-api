import { budgetRepository } from "./budget.repository";
import {
  CreateBudgetInput,
  GetBudgetsQuery,
  UpdateBudgetInput,
} from "./budget.types";

export const budgetService = {
  async findBudgetById(id: number, userId: number) {
    const budget = await budgetRepository.findBudgetById(id);
    if (!budget) {
      throw new Error(`Budget with ${id} not found`);
    }
    if (budget.userId !== userId) {
      throw new Error("Access denied");
    }
    return budget;
  },
  async findBudgetsByUserId(userId: number, query: GetBudgetsQuery) {
    return await budgetRepository.findBudgetsByUserId(userId, query);
  },
  async createBudget(data: CreateBudgetInput, userId: number) {
    const overlappingBudget = await budgetRepository.findOverlappingBudget({
      userId,
      categoryId: data.categoryId,
      startDate: data.startDate,
      endDate: data.endDate,
    });
    if (overlappingBudget) {
      throw new Error(
        "There is already a budget for this category with overlapping dates",
      );
    }
    return budgetRepository.createBudget({ ...data }, userId);
  },
  async updateBudget(data: UpdateBudgetInput, id: number, userId: number) {
    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update");
    }
    const existingBudget = await this.findBudgetById(id, userId);
    const overlappingBudget = await budgetRepository.findOverlappingBudget({
      userId,
      categoryId: data.categoryId ?? existingBudget.categoryId,
      startDate: data.startDate ?? existingBudget.startDate,
      endDate: data.endDate ?? existingBudget.endDate,
      excludeBudgetId: id,
    });
    if (overlappingBudget) {
      throw new Error(
        "There is already a budget for this category with overlapping dates",
      );
    }
    return budgetRepository.updateBudget({ ...data }, id);
  },
  async deleteBudget(id: number, userId: number) {
    await this.findBudgetById(id, userId);
    return await budgetRepository.deleteBudget(id);
  },
  async checkBudgetStatus(id: number, userId: number) {
    const budget = await this.findBudgetById(id, userId);
    const { _sum } = await budgetRepository.getSpentAmount(
      userId,
      budget.categoryId,
      budget.startDate,
      budget.endDate,
    );
    const spent = Number(_sum.amount ?? 0);
    const limit = Number(budget.amount);
    const remaining = limit - spent;
    const percentage = Math.round((spent / limit) * 100 * 100) / 100;
    const exceeded = spent > limit;
    return { limit, spent, remaining, percentage, exceeded };
  },
};
