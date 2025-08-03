import type { Request, Response } from "express";

import { config } from "../config.js";
import { ForbiddenError } from "../error.js";
import { deleteUsers } from "../db/queries/users.js";

export async function handlerReset(_req: Request, res: Response) {
  if (config.api.platform !== "dev") {
    throw new ForbiddenError("This operation is only permitted in dev");
  }

  config.api.fileServerHits = 0;
  await deleteUsers();
  res.end();
}
