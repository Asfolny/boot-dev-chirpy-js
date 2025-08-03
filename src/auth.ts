import { Request } from "express";
import { hash, compare } from "bcrypt";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import type { JwtPayload } from "jsonwebtoken";

import { UnauthorizedError, BadRequestError } from "./error.js";
import { config } from "./config.js";

export async function hashPassword(password: string) {
  return await hash(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  return await compare(password, hash);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;

export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const iat = Math.floor(Date.now() / 1000);

  return jwt.sign(
    {
      iss: config.jwt.issuer,
      sub: userID,
      iat: iat,
      exp: iat + expiresIn,
    } satisfies payload,
    secret,
    { algorithm: "HS256" },
  );
}

export function validateJWT(tokenString: string, secret: string) {
  let decoded: payload;
  try {
    decoded = jwt.verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== config.jwt.issuer) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}

export function getBearerToken(req: Request) {
  const authHeader = req.get("Authorization");
  if (!authHeader) {
    throw new UnauthorizedError("Malformed authorization header");
  }

  return extractBearerToken(authHeader);
}

export function extractBearerToken(header: string) {
  const splitAuth = header.split(" ");
  if (splitAuth.length < 2 || splitAuth[0] !== "Bearer") {
    throw new BadRequestError("Malformed authorization header");
  }
  return splitAuth[1];
}

export function makeRefreshToken() {
  return crypto.randomBytes(32).toString("hex");
}
