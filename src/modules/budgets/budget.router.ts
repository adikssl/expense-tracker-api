import express, { type Request, type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../types/request-types";
import {
  BudgetIdParamsSchema,
  CreateBudgetSchema,
  getBudgetsQuerySchema,
  UpdateBudgetSchema,
} from "./budget.schema";
import { budgetService } from "./budget.service";
import {
  CreateBudgetInput,
  GetBudgetsQuery,
  UpdateBudgetInput,
} from "./budget.types";

export const budgetRouter = express.Router();

/**
 * @swagger
 * /budgets:
 *   get:
 *     summary: Get all budgets for the current user
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter budgets starting on or after this date
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         required: false
 *         description: Filter budgets ending on or before this date
 *     responses:
 *       200:
 *         description: List of user's budgets
 *       401:
 *         description: Unauthorized
 */

budgetRouter.get(
  "/",
  validate(getBudgetsQuerySchema, "query"),
  async (req: Request, res: Response) => {
    const query = req.validatedQuery as GetBudgetsQuery;
    const result = await budgetService.findBudgetsByUserId(req.userId, query);
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /budgets/{id}:
 *   get:
 *     summary: Get a single budget by id
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget id
 *     responses:
 *       200:
 *         description: Budget found
 *       400:
 *         description: Invalid Budget id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */

budgetRouter.get(
  "/:id",
  validate(BudgetIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await budgetService.findBudgetById(
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /budgets/{id}/status:
 *   get:
 *     summary: Get spent-vs-limit status for a budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget id
 *     responses:
 *       200:
 *         description: Budget status
 *       400:
 *         description: Invalid Budget id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */

budgetRouter.get(
  "/:id/status",
  validate(BudgetIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await budgetService.checkBudgetStatus(
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /budgets:
 *   post:
 *     summary: Create a new budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - categoryId
 *               - startDate
 *               - endDate
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Amount with at most 2 decimal places
 *               categoryId:
 *                 type: number
 *                 minimum: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       201:
 *         description: Budget created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

budgetRouter.post(
  "/",
  validate(CreateBudgetSchema),
  async (req: RequestWithBody<CreateBudgetInput>, res: Response) => {
    const result = await budgetService.createBudget(req.body, req.userId);
    res.status(201).json(result);
  },
);

/**
 * @swagger
 * /budgets/{id}:
 *   patch:
 *     summary: Update an existing budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: number
 *                 minimum: 1
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *     responses:
 *       200:
 *         description: Budget updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */

budgetRouter.patch(
  "/:id",
  validate(BudgetIdParamsSchema, "params"),
  validate(UpdateBudgetSchema, "body"),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateBudgetInput>,
    res: Response,
  ) => {
    const result = await budgetService.updateBudget(
      req.body,
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /budgets/{id}:
 *   delete:
 *     summary: Delete a budget
 *     tags: [Budget]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Budget id
 *     responses:
 *       204:
 *         description: Budget deleted successfully
 *       400:
 *         description: Invalid Budget id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Budget not found
 */

budgetRouter.delete(
  "/:id",
  validate(BudgetIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    await budgetService.deleteBudget(+req.params.id, req.userId);
    res.status(204).send();
  },
);
