import z from "zod";
import {
  CreateTransactionSchema,
  getTransactionsQuerySchema,
  UpdateTransactionSchema,
} from "./transaction.schema";

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
export type GetTransactionsQuery = z.infer<typeof getTransactionsQuerySchema>;
