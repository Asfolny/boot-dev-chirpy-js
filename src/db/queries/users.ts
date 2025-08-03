import { eq } from "drizzle-orm";

import { db } from "../index.js";
import { NewUser, users } from "../schema.js";
import { firstOrUndefined } from "./utils.js";

export async function createUser(user: NewUser) {
  const [result] = await db
    .insert(users)
    .values(user)
    .onConflictDoNothing()
    .returning();
  return result;
}

export async function deleteUsers() {
  await db.delete(users);
}

export async function getUser(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email));
  return firstOrUndefined(result);
}

export async function updateUser(
  id: string,
  email: string,
  hashedPassword: string,
) {
  const [result] = await db
    .update(users)
    .set({
      email: email,
      hashed_password: hashedPassword,
    })
    .where(eq(users.id, id))
    .returning();

  return result;
}
