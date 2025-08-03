import type { Request, Response } from "express";

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

    res.send(JSON.stringify({valid: true}));
    res.end();
  } catch (error) {
    let msg = "Something went wrong";
    if (error instanceof Error) msg = error.message;
      res.status(400).send(JSON.stringify({error: msg}));
    res.end();
  }
}
