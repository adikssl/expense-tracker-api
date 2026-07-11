import z from "zod";
import { createWalletSchema, updateWalletSchema } from "./wallet.schema";

export type CreateWalletInput = z.infer<typeof createWalletSchema>;
export type UpdateWalletInput = z.infer<typeof updateWalletSchema>;
