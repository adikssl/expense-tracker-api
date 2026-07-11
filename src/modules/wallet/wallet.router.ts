import express, { type Request, type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import {
  RequestWithBody,
  RequestWithParams,
  RequestWithParamsAndBody,
} from "../../types/request-types";
import {
  createWalletSchema,
  updateWalletSchema,
  walletIdParamsSchema,
} from "./wallet.schema";
import { walletService } from "./wallet.service";
import { CreateWalletInput, UpdateWalletInput } from "./wallet.types";

export const walletRouter = express.Router();

/**
 * @swagger
 * /wallets:
 *   get:
 *     summary: Get all wallets for the current user
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's wallets
 *       401:
 *         description: Unauthorized
 */

walletRouter.get("/", async (req: Request, res: Response) => {
  const result = await walletService.findWalletsByUserId(req.userId);
  res.status(200).json(result);
});

/**
 * @swagger
 * /wallets/{id}:
 *   get:
 *     summary: Get a single wallet by id
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet id
 *     responses:
 *       200:
 *         description: Wallet found
 *       400:
 *         description: Invalid wallet id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */

walletRouter.get(
  "/:id",
  validate(walletIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const result = await walletService.findWalletById(
      Number(req.params.id),
      req.userId,
    );
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /wallets:
 *   post:
 *     summary: Create a new wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currency
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 1
 *                 maxLength: 50
 *               balance:
 *                 type: number
 *                 minimum: 0
 *                 default: 0
 *                 description: Balance with at most 2 decimal places
 *               currency:
 *                 type: string
 *                 enum: [KZT, RUB, UZS, EUR, USD]
 *     responses:
 *       201:
 *         description: Wallet created successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

walletRouter.post(
  "/",
  validate(createWalletSchema),
  async (req: RequestWithBody<CreateWalletInput>, res: Response) => {
    const result = await walletService.createWallet(req.body, req.userId);
    res.status(201).json(result);
  },
);

/**
 * @swagger
 * /wallets/{id}:
 *   patch:
 *     summary: Update an existing wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet id
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
 *               currency:
 *                 type: string
 *                 enum: [KZT, RUB, UZS, EUR, USD]
 *     responses:
 *       200:
 *         description: Wallet updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */

walletRouter.patch(
  "/:id",
  validate(walletIdParamsSchema, "params"),
  validate(updateWalletSchema, "body"),
  async (
    req: RequestWithParamsAndBody<{ id: string }, UpdateWalletInput>,
    res: Response,
  ) => {
    const id = Number(req.params.id);
    const result = await walletService.updateWallet(id, req.userId, req.body);
    res.status(200).json(result);
  },
);

/**
 * @swagger
 * /wallets/{id}:
 *   delete:
 *     summary: Delete a wallet
 *     tags: [Wallet]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Wallet id
 *     responses:
 *       204:
 *         description: Wallet deleted successfully
 *       400:
 *         description: Invalid wallet id
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Wallet not found
 */

walletRouter.delete(
  "/:id",
  validate(walletIdParamsSchema, "params"),
  async (req: RequestWithParams<{ id: string }>, res: Response) => {
    const id = Number(req.params.id);
    await walletService.deleteWallet(id, req.userId);
    res.status(204).send();
  },
);
