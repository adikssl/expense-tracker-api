import z from "zod";
import {
  CreateBudgetSchema,
  getBudgetsQuerySchema,
  UpdateBudgetSchema,
} from "./budget.schema";

export type CreateBudgetInput = z.infer<typeof CreateBudgetSchema>;
export type UpdateBudgetInput = z.infer<typeof UpdateBudgetSchema>;
export type GetBudgetsQuery = z.infer<typeof getBudgetsQuerySchema>;

export interface findOverlappingBudgetResponse {
  userId: number;
  categoryId: number;
  startDate: Date;
  endDate: Date;
  excludeBudgetId?: number;
}
