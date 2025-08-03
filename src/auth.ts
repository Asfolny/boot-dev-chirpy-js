import { hash, compare } from "bcrypt"
import { sign, verify, type JwtPayload } from "jsonwebtoken";

import { UnauthorizedError } from "./error.js";

export async function hashPassword(password: string) {
  return await hash(password, 10);
}

export async function checkPasswordHash(password: string, hash: string) {
  return await compare(password, hash);
}

type payload = Pick<JwtPayload, "iss" | "sub" | "iat" | "exp">;
const TOKEN_ISSUER = "chirpy"

export function makeJWT(userID: string, expiresIn: number, secret: string) {
  const iat = Math.floor(Date.now() / 1000);

  return sign(
    {
      iss: TOKEN_ISSUER,
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
    decoded = verify(tokenString, secret) as JwtPayload;
  } catch (e) {
    throw new UnauthorizedError("Invalid token");
  }

  if (decoded.iss !== TOKEN_ISSUER) {
    throw new UnauthorizedError("Invalid issuer");
  }

  if (!decoded.sub) {
    throw new UnauthorizedError("No user ID in token");
  }

  return decoded.sub;
}
