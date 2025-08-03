import type { Request, Response, NextFunction } from "express";
import { BadRequestError, UnauthorizedError, ForbiddenError, NotFoundError } from "../error.js";

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof BadRequestError) {
    res.status(400).json({error: err.message});
    res.end();
    return;
  }

  if (err instanceof UnauthorizedError) {
    res.status(401).json({error: err.message});
    res.end();
    return;
  }

  if (err instanceof ForbiddenError) {
    res.status(403).json({error: err.message});
    res.end();
    return;
  }

  if (err instanceof NotFoundError) {
    res.status(404).json({error: err.message});
    res.end();
    return;
  }

  console.log(err.message);
  res.status(500).json({
    error: "Internal Server Error",
  });
}
