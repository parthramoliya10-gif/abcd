import { Request, Response, NextFunction } from "express";
import { ZodType } from "zod";

type ValidationTarget = "body" | "query" | "params";

export const validate =
  <T>(
    schema: ZodType<T>,
    target: ValidationTarget = "body",
  ) =>
  (
    req: Request,
    _res: Response,
    next: NextFunction,
  ): void => {
    const result = schema.safeParse(req[target]);

    if (!result.success) {
      next(result.error);
      return;
    }

    if (target === "body") {
      req.body = result.data;
    } else if (target === "params") {
      Object.assign(req.params, result.data);
    } else {
      Object.assign(req.query, result.data);
    }

    next();
  };