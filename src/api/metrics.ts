import type { Request, Response } from "express";

import { config } from "../config.js";

export function handlerMetrics(_req: Request, res: Response) {
  res.send(`Hits: ${config.fileserverHits}`);
  res.end();
}

export function handlerReset(_req: Request, res: Response) {
  config.fileserverHits = 0;
  res.end();
}
