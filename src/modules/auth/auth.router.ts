import express, { type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import { RequestWithBody } from "../../types/request-types";
import { loginSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { LoginInput, RegisterInput } from "./auth.types";

export const authRouter = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 50
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 50
 *     responses:
 *       201:
 *         description: User successfully registered
 *       400:
 *         description: Validation error
 */

authRouter.post(
  "/register",
  validate(registerSchema),
  async (req: RequestWithBody<RegisterInput>, res: Response) => {
    const result = await authService.registerUser(req.body);
    res.status(201).json(result);
  },
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 50
 *     responses:
 *       200:
 *         description: User successfully logged in
 *       400:
 *         description: Validation error
 */

authRouter.post(
  "/login",
  validate(loginSchema),
  async (req: RequestWithBody<LoginInput>, res: Response) => {
    const result = await authService.loginUser(req.body);
    res.status(200).json(result);
  },
);
