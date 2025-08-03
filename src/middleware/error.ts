import type { Request, Response, NextFunction } from "express";

export function middlewareError(err: Error, req: Request, res: Response, next: NextFunction) {
  console.log(err.message);
  res.status(500).json({
    error: "Something went wrong on our end",
  });
}
