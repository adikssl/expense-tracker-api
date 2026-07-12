import { NextFunction, Request, Response } from "express";
import { ZodType } from "zod";

type ValidateTarget = "body" | "params" | "query";

export const validate = (schema: ZodType, target: ValidateTarget = "body") => {
  return (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req[target]);
    if (!result.success) {
      next(result.error);
      return;
    }
    req[target] = result.data;
    next();
  };
};
