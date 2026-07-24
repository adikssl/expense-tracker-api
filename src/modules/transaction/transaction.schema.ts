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

export const getTransactionsQuerySchema = z
  .object({
    type: z.enum(["INCOME", "EXPENSE"]).optional(),
    categoryId: z.coerce.number().int().positive().optional(),
    walletId: z.coerce.number().int().positive().optional(),
    createdAtFrom: z.coerce.date().optional(),
    createdAtTo: z.coerce.date().optional(),
    minAmount: z.coerce.number().int().nonnegative().optional(),
    maxAmount: z.coerce.number().int().nonnegative().optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().default(20),
    sortBy: z.enum(["amount", "createdAt"]).default("createdAt"),
    order: z.enum(["asc", "desc"]).default("asc"),
  })
  .refine(
    (data) => {
      if (data.minAmount && data.maxAmount) {
        return data.minAmount <= data.maxAmount;
      }
      return true;
    },
    {
      message: "minAmount must be lower than maxAmount",
      path: ["minAmount"],
    },
  )
  .refine(
    (data) => {
      if (data.createdAtFrom && data.createdAtTo) {
        return data.createdAtFrom <= data.createdAtTo;
      }
      return true;
    },
    {
      message: "createdAtFrom must be earlier than createdAtTo",
      path: ["createdAtFrom"],
    },
  );

export const UpdateTransactionSchema = CreateTransactionSchema.partial().omit({
  type: true,
  amount: true,
  walletId: true,
});
