import type { Request, Response } from "express";

export function handlerValidateChirp(req: Request, res: Response) {
  let body = "";

  req.on("data", (chunk) => {
    body += chunk;
  });

  req.on("end", () => {
    try {
      res.header("Content-Type", "application/json");

      const parsedBody = JSON.parse(body);
      if (!parsedBody.hasOwnProperty("body")) {
        throw new Error("Something went wrong");
      }

      if (parsedBody.body.length > 140) {
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
  });
}
