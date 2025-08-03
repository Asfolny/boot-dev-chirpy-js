import { Request, Response } from "express";

import { createUser, getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { hashPassword, checkPasswordHash, makeJWT } from "../auth.js";
import { config } from "../config.js";

export type UserResponse = Omit<NewUser, "hashed_password">

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

  const user = await createUser({email: params.email, hashed_password: hashed_password});
  res.status(201).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } satisfies UserResponse);
  res.end();
}

export async function handlerLogin(req: Request, res: Response) {
  type parameters = {
    email: string;
    password: string;
    expiresInSeconds?: number;
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

  const token = makeJWT(user.id, params.expiresInSeconds !== undefined ? params.expiresInSeconds : 60 * 60, config.api.jwtSecret);

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token,
  });
  res.end();
}
