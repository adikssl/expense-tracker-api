import z from "zod";
import { CreateCategorySchema, UpdateCategorySchema } from "./category.schema";

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
