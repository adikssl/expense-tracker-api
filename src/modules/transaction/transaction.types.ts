import z from "zod";
import {
  CreateTransactionSchema,
  UpdateTransactionSchema,
} from "./transaction.schema";

export type CreateTransactionInput = z.infer<typeof CreateTransactionSchema>;
export type UpdateTransactionInput = z.infer<typeof UpdateTransactionSchema>;
