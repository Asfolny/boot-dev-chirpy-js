import type { Request, Response } from "express";
import { config } from "../config.js";
import { BadRequestError } from "../error.js";
import { createChirp, getChirps } from "../db/queries/chirps.js";

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

export async function handlerCreateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
    userId: string;
  };

  const params: parameters = req.body;
  if (params.body === undefined || params.userId === undefined) {
    throw new BadRequestError("request body is wrong");
  }

  console.log(params);
  const validMsg = validateChirp(params.body);
  const chirp = await createChirp({body: validMsg, userId: params.userId})

  res.status(201).json(chirp);
  res.end();
}

export async function handlerListChirps(req: Request, res: Response) {
  res.json(await getChirps());
  res.end();
}

