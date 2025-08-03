import type { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError } from "../error.js";

export function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  res.header("Content-Type", "application/json");

  const params: parameters = req.body;
  if (params.body === undefined) {
    throw new Error("Something went wrong");
  }

  if (params.body.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  let clean = "";
  const splitMsg = params.body.split(" ");
  for (let pos in splitMsg) {
    if (config.api.badWords.includes(splitMsg[pos].toLowerCase())) {
      splitMsg[pos] = "****";
    }
  }

  res.send(JSON.stringify({cleanedBody: splitMsg.join(" ")}));
  res.end();
}
