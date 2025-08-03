import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { NewChirp, chirps } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createChirp(chirp: NewChirp) {
  const [result] = await db
    .insert(chirps)
    .values(chirp)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function getChirps() {
  return await db.select().from(chirps);
}

export async function getChirp(id: string) {
  const result = await db.select().from(chirps).where(eq(chirps.id, id));
  return firstOrUndefined(result);
}

export async function deleteChirp(id: string) {
  const rows = await db.delete(chirps).where(eq(chirps.id, id)).returning();
  return rows.length > 0;
}

