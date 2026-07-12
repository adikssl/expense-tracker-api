import { categoryRepository } from "./category.repository";
import { CreateCategoryInput, UpdateCategoryInput } from "./category.types";

export const categoryService = {
  async findCategoryById(id: number, userId: number) {
    const category = await categoryRepository.findCategoryById(id);
    if (!category) {
      throw new Error(`Category with ${id} not found`);
    }
    if (category.userId !== userId) {
      throw new Error("Access denied");
    }
    return category;
  },
  async findCategoriesByUserId(userId: number) {
    return await categoryRepository.findCategoriesByUserId(userId);
  },
  async createCategory(data: CreateCategoryInput, userId: number) {
    return categoryRepository.createCategory({ ...data }, userId);
  },
  async updateCategory(data: UpdateCategoryInput, id: number, userId: number) {
    if (Object.keys(data).length === 0) {
      throw new Error("No fields provided to update");
    }
    await this.findCategoryById(id, userId);
    return categoryRepository.updateCategory({ ...data }, id);
  },
  async deleteCategory(id: number, userId: number) {
    await this.findCategoryById(id, userId);
    return await categoryRepository.deleteCategory(id);
  },
};
