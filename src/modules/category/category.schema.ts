import z from "zod";

export const CreateCategorySchema = z.object({
  name: z.string().min(1).max(50),
  type: z.enum(["INCOME", "EXPENSE"]),
});

export const CategoryIdParamsSchema = z.object({
  id: z.coerce.number().int().positive(),
});

export const UpdateCategorySchema = CreateCategorySchema.partial().omit({
  type: true,
});
