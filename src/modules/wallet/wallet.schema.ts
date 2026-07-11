import { z } from "zod";

export const createWalletSchema = z.object({
  name: z.string().min(1).max(50).optional(),
  balance: z
    .number()
    .nonnegative()
    .refine((val) => Number.isInteger(val * 100), {
      message: "Balance must have at most 2 decimal places",
    })
    .default(0),
  currency: z.enum(["KZT", "RUB", "UZS", "EUR", "USD"]),
});

export const walletIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const updateWalletSchema = createWalletSchema
  .partial()
  .omit({ balance: true });
