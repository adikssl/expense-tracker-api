import z from "zod";

export const CreateTransactionSchema = z.object({
  amount: z
    .number()
    .positive()
    .refine((val) => Number.isInteger(val * 100), {
      message: "Balance must have at most 2 decimal places",
    }),
  type: z.enum(["INCOME", "EXPENSE"]),
  walletId: z.number().int().positive(),
  categoryId: z.number().int().positive().optional(),
  description: z.string().max(500).optional(),
});

export const TransactionsIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});
export const UpdateTransactionSchema = CreateTransactionSchema.partial().omit({
  type: true,
  amount: true,
  walletId: true,
});
