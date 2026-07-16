import express, { type Request, type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../types/request-types";
import {
  CreateTransactionSchema,
  TransactionsIdParamsSchema,
  UpdateTransactionSchema,
} from "./transaction.schema";
import { transactionService } from "./transaction.service";
import {
  CreateTransactionInput,
  UpdateTransactionInput,
} from "./transaction.types";

export const transactionRouter = express.Router();

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Get all transactions for the current user
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's transactions
 *       401:
 *         description: Unauthorized
 */

transactionRouter.get("/", async (req: Request, res: Response) => {
  const result = await transactionService.findTransactionsByUserId(req.userId);
  res.status(200).json(result);
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get a single transaction by id
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction id
 *     responses:
 *       200:
 *         description: Transaction found
 *       400:
 *         description: Invalid transaction id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

transactionRouter.get(
  "/:id",
  validate(TransactionsIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await transactionService.findTransactionById(
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transaction]
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
 *               - type
 *               - walletId
 *             properties:
 *               amount:
 *                 type: number
 *                 minimum: 0
 *                 description: Amount with at most 2 decimal places
 *               type:
 *                 type: string
 *                 enum: [INCOME, EXPENSE]
 *               walletId:
 *                 type: integer
 *                 description: Id of the wallet this transaction belongs to
 *               categoryId:
 *                 type: integer
 *                 description: Optional category id for classification
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

transactionRouter.post(
  "/",
  validate(CreateTransactionSchema),
  async (req: RequestWithBody<CreateTransactionInput>, res: Response) => {
    const result = await transactionService.createTransaction(
      req.body,
      req.userId,
    );
    res.status(201).json(result);
  },
);

/**
 * @swagger
 * /transactions/{id}:
 *   patch:
 *     summary: Update an existing transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction id
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 description: New category id for this transaction
 *               description:
 *                 type: string
 *                 maxLength: 500
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

transactionRouter.patch(
  "/:id",
  validate(TransactionsIdParamsSchema, "params"),
  validate(UpdateTransactionSchema, "body"),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateTransactionInput>,
    res: Response,
  ) => {
    const result = await transactionService.updateTransaction(
      req.body,
      +req.params.id,
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transaction]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Transaction id
 *     responses:
 *       204:
 *         description: Transaction deleted successfully
 *       400:
 *         description: Invalid Transaction id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Transaction not found
 */

transactionRouter.delete(
  "/:id",
  validate(TransactionsIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    await transactionService.deleteTransaction(+req.params.id, req.userId);
    res.status(204).send();
  },
);
