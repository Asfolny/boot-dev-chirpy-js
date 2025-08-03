import { Request, Response } from "express";

import { createUser, getUser } from "../db/queries/users.js";
import { NewUser, User } from "../db/schema.js";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { hashPassword, checkPasswordHash } from "../auth.js";

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (params.email === undefined || params.password === undefined || !params.email.includes("@")) {
    throw new BadRequestError("Invalid email");
  }

  const hashed_password = await hashPassword(params.password);

  const newUser = await createUser({email: params.email, hashed_password: hashed_password}) as Omit<NewUser, "hashed_password">;
  res.status(201).json(newUser);
  res.end();
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
  };

  const params: parameters = req.body;
  if (params.email === undefined || params.password === undefined || !params.email.includes("@")) {
    throw new BadRequestError("Invalid email");
  }

  const user = await getUser(params.email);
  if (user === undefined) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const valid = await checkPasswordHash(params.password, user.hashed_password);
  if (valid === false) {
    throw new UnauthorizedError("Incorrect email or password");
  }

  const retUser = user as Omit<User, "hashed_password">;
  res.status(200).json(retUser);
  res.end();
}
