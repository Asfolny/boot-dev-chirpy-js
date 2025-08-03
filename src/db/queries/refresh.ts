import { and, eq, gt, isNull } from "drizzle-orm";

import { db } from "../index.js";
import { refresh_tokens, users } from "../schema.js";

import { config } from "../../config.js";

export async function saveRefreshToken(userID: string, token: string) {
  const rows = await db
    .insert(refresh_tokens)
    .values({
      userId: userID,
      token: token,
      expiresAt: new Date(Date.now() + config.jwt.refreshDuration),
      revokedAt: null,
    })
    .returning();

  return rows.length > 0;
}

export async function userForRefreshToken(token: string) {
  const [result] = await db
    .select({ user: users })
    .from(users)
    .innerJoin(refresh_tokens, eq(users.id, refresh_tokens.userId))
    .where(
      and(
        eq(refresh_tokens.token, token),
        isNull(refresh_tokens.revokedAt),
        gt(refresh_tokens.expiresAt, new Date()),
      ),
    )
    .limit(1);

  return result;
}

export async function revokeRefreshToken(token: string) {
  const rows = await db
    .update(refresh_tokens)
    .set({ expiresAt: new Date() })
    .where(eq(refresh_tokens.token, token))
    .returning();

  if (rows.length === 0) {
    throw new Error("Couldn't revoke token");
  }
}

