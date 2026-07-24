import express, { type NextFunction, type Response } from "express";
import { validate } from "../../middleware/validate.middleware";
import { RequestWithBody } from "../../types/request-types";
import { loginSchema, refreshTokenSchema, registerSchema } from "./auth.schema";
import { authService } from "./auth.service";
import { LoginInput, RefreshInput, RegisterInput } from "./auth.types";

export const authRouter = express.Router();

const REFRESH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 30 * 24 * 60 * 60 * 1000,
};

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
  async (
    req: RequestWithBody<RegisterInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user, accessToken, refreshToken } =
        await authService.registerUser(req.body);
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(201).json({ user, accessToken });
    } catch (error) {
      next(error);
    }
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
  async (
    req: RequestWithBody<LoginInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const { user, accessToken, refreshToken } = await authService.loginUser(
        req.body,
      );
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ user, accessToken });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token using a refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (optional if sent via httpOnly cookie)
 *     responses:
 *       200:
 *         description: New access token issued, refresh token rotated in cookie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       401:
 *         description: Refresh token missing, invalid, revoked, or expired
 */
authRouter.post(
  "/refresh",
  validate(refreshTokenSchema),
  async (
    req: RequestWithBody<RefreshInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const cookies = req.cookies as Record<string, string | undefined>;
      const rawToken = req.body?.refreshToken ?? cookies.refreshToken;
      const { accessToken, refreshToken } =
        await authService.refreshAccessToken(rawToken);
      res.cookie("refreshToken", refreshToken, REFRESH_COOKIE_OPTIONS);
      res.status(200).json({ accessToken });
    } catch (error) {
      next(error);
    }
  },
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out and revoke the refresh token
 *     tags: [Auth]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 description: Refresh token (optional if sent via httpOnly cookie)
 *     responses:
 *       200:
 *         description: Successfully logged out
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */
authRouter.post(
  "/logout",
  validate(refreshTokenSchema),
  async (
    req: RequestWithBody<RefreshInput>,
    res: Response,
    next: NextFunction,
  ) => {
    try {
      const cookies = req.cookies as Record<string, string | undefined>;
      const rawToken = req.body?.refreshToken ?? cookies.refreshToken;
      await authService.logout(rawToken);
      res.clearCookie("refreshToken");
      res.status(200).json({ message: "Logged out" });
    } catch (error) {
      next(error);
    }
  },
);
