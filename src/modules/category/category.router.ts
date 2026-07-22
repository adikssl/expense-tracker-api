import express, { type Request, type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../types/request-types";
import {
  CategoryIdParamsSchema,
  CreateCategorySchema,
  getCategoriesQuerySchema,
  UpdateCategorySchema,
} from "./category.schema";
import { categoryService } from "./category.service";
import {
  CreateCategoryInput,
  GetCategoriesQuery,
  UpdateCategoryInput,
} from "./category.types";

export const categoryRouter = express.Router();

/**
 * @swagger
 * /categories:
 *   get:
 *     summary: Get all categories for the current user
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's categories
 *       401:
 *         description: Unauthorized
 */

categoryRouter.get(
  "/",
  validate(getCategoriesQuerySchema, "query"),
  async (req: Request, res: Response) => {
    const query = req.validatedQuery as GetCategoriesQuery;
    console.log(typeof query.type, query.type);
    const result = await categoryService.findCategoriesByUserId(
      req.userId,
      query.type,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /categories/{id}:
 *   get:
 *     summary: Get a single category by id
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category id
 *     responses:
 *       200:
 *         description: Category found
 *       400:
 *         description: Invalid Category id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

categoryRouter.get(
  "/:id",
  validate(CategoryIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await categoryService.findCategoryById(
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - type
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

categoryRouter.post(
  "/",
  validate(CreateCategorySchema),
  async (req: RequestWithBody<CreateCategoryInput>, res: Response) => {
    const result = await categoryService.createCategory(req.body, req.userId);
    res.status(201).json(result);
  },
);

/**
 * @swagger
 * /categories/{id}:
 *   patch:
 *     summary: Update an existing category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

categoryRouter.patch(
  "/:id",
  validate(CategoryIdParamsSchema, "params"),
  validate(UpdateCategorySchema, "body"),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateCategoryInput>,
    res: Response,
  ) => {
    const result = await categoryService.updateCategory(
      req.body,
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Category]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Category id
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       400:
 *         description: Invalid category id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Category not found
 */

categoryRouter.delete(
  "/:id",
  validate(CategoryIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    await categoryService.deleteCategory(+req.params.id, req.userId);
    res.status(204).send();
  },
);
