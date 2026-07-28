import z from "zod";

export const CreateBudgetSchema = z.object({
  amount: z
    .number()
    .positive()
    .refine((val) => Number.isInteger(val * 100), {
      message: "Budgets must have at most 2 decimal places",
    }),
  categoryId: z.number().positive(),
  startDate: z.coerce.date(),
  endDate: z.coerce.date(),
});

export const getBudgetsQuerySchema = z.object({
  startDate: z.coerce.date().optional(),
  endDate: z.coerce.date().optional(),
});

export const BudgetIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UpdateBudgetSchema = CreateBudgetSchema.partial();
