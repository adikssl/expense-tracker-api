import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/env";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(" ")[1];
  if (!token) {
    res.sendStatus(401);
    return;
  }
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (typeof payload === "string" || !("userId" in payload)) {
      res.status(401).json({ message: "Invalid token payload" });
      return;
    }

    req.userId = payload.userId as number;
    next();
  } catch {
    res.status(401).json({ message: "Invalid token" });
  }
};
