import cors from "cors";
import express from "express";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import { swaggerSpec } from "./config/swagger";
import { authMiddleware } from "./middleware/auth.middleware";
import { errorHandler } from "./middleware/errorHandler";
import { authRouter } from "./modules/auth/auth.router";
import { walletRouter } from "./modules/wallet/wallet.router";
import type {} from "./types/express";

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.use("/auth", authRouter);
app.use("/wallets", authMiddleware, walletRouter);
app.use(errorHandler);

export default app;
