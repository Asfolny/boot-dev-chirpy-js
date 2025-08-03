import { Request, Response } from "express";

import { createUser, getUser } from "../db/queries/users.js";
import { NewUser } from "../db/schema.js";
import { BadRequestError, UnauthorizedError } from "../error.js";
import { hashPassword, checkPasswordHash, makeJWT, makeRefreshToken, getBearerToken } from "../auth.js";
import { config } from "../config.js";
import { revokeRefreshToken, saveRefreshToken, userForRefreshToken } from "../db/queries/refresh.js";

export type UserResponse = Omit<NewUser, "hashed_password">
type LoginResponse = UserResponse & {
  token: string;
  refreshToken: string;
};

export async function handlerCreateUser(req: Request, res: Response) {
  type parameters = {
    password: string;
    email: string;
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
    password: string;
    email: string;
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

  const token = makeJWT(user.id, config.jwt.defaultDuration, config.jwt.secret);
  const refreshToken = makeRefreshToken();

  const saved = await saveRefreshToken(user.id, refreshToken);
  if (!saved) {
    throw new UnauthorizedError("could not save refresh token");
  }

  res.status(200).json({
    id: user.id,
    email: user.email,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
    token: token,
    refreshToken: refreshToken,
  } satisfies LoginResponse);
  res.end();
}

export async function handlerRefresh(req: Request, res: Response) {
  let refreshToken = getBearerToken(req);

  const result = await userForRefreshToken(refreshToken);
  if (!result) {
    throw new UnauthorizedError("invalid refresh token");
  }

  const user = result.user;
  const accessToken = makeJWT(
    user.id,
    config.jwt.defaultDuration,
    config.jwt.secret,
  );

  type response = {
    token: string;
  };

  res.json({ token: accessToken } satisfies response);
}

export async function handlerRevoke(req: Request, res: Response) {
  const refreshToken = getBearerToken(req);
  await revokeRefreshToken(refreshToken);
  res.status(204).send();
}
