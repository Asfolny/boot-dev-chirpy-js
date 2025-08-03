import type { Request, Response, NextFunction } from "express";
import { config } from "../config.js";

export function middlewareMetricsInc(_req: Request, _res: Response, next: NextFunction) {
  config.fileserverHits++;
  next();
}
