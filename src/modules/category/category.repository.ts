import { prisma } from "../../config/prisma";
import { CategoryType } from "../../generated/prisma/enums";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export const categoryRepository = {
  async findCategoryById(id: number) {
    return prisma.category.findUnique({ where: { id } });
  },
  async findCategoriesByUserId(userId: number, type?: CategoryType) {
    return prisma.category.findMany({ where: { userId, type } });
  },
  async createCategory(data: CreateCategoryInput, userId: number) {
    return prisma.category.create({
      data: {
        ...data,
        userId,
      },
    });
  },
  async updateCategory(data: UpdateCategoryInput, id: number) {
    return prisma.category.update({
      where: {
        id,
      },
      data: {
        ...data,
      },
    });
  },
  async deleteCategory(id: number) {
    return prisma.category.delete({ where: { id } });
  },
};
