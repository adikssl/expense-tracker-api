import z from "zod";
import {
  CreateCategorySchema,
  getCategoriesQuerySchema,
  UpdateCategorySchema,
} from "./category.schema";

export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
export type GetCategoriesQuery = z.infer<typeof getCategoriesQuerySchema>;
