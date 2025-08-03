import type { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError } from "../error.js";

function validateChirp(msg: string) {
  if (msg.length > 140) {
    throw new BadRequestError("Chirp is too long. Max length is 140");
  }

  let clean = "";
  const splitMsg = msg.split(" ");
  for (let pos in splitMsg) {
    if (config.api.badWords.includes(splitMsg[pos].toLowerCase())) {
      splitMsg[pos] = "****";
    }
  }

  return splitMsg.join(" ");
}

export async function handlerCreateChirps(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  const params: parameters = req.body;
  if (params.body === undefined) {
    throw new Error("Something went wrong");
  }

  const validatedMst = validateChirp(params.body);

  res.json({validatedMsg});
  res.end();
}
