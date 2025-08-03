import { Request, Response } from "express";

import { createUser } from "../db/queries/users.js";
import { BadRequestError } from "../error.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
  };

  const params: parameters = req.body;
  if (params.email === undefined || !params.email.includes("@")) {
    throw new BadRequestError("Invalid email");
  }

  const newUser = await createUser({email: params.email});
  res.status(201).json(newUser);
  res.end();
}
