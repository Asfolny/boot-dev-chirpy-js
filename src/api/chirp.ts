import type { Request, Response } from "express";
import { config } from "../config.js";

export function handlerValidateChirp(req: Request, res: Response) {
  type parameters = {
    body: string;
  };

  try {
    res.header("Content-Type", "application/json");

    const params: parameters = req.body;
    if (params.body === undefined) {
      throw new Error("Something went wrong");
    }

    if (params.body.length > 140) {
      throw new Error("Chirp is too long");
    }

    let clean = "";
    const splitMsg = params.body.split(" ");
    for (let pos in splitMsg) {
      if (config.badWords.includes(splitMsg[pos].toLowerCase())) {
        splitMsg[pos] = "****";
      }
    }

    res.send(JSON.stringify({cleanedBody: splitMsg.join(" ")}));
    res.end();
  } catch (error) {
    let msg = "Something went wrong";
    if (error instanceof Error) msg = error.message;

    if (msg === "Chirp is too long") throw new Error("Chirp is too long");

    res.status(400).send(JSON.stringify({error: msg}));
    res.end();
  }
}
