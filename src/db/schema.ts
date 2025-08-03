import { pgTable, timestamp, varchar, uuid } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  email: varchar("email", { length: 256 }).unique().notNull(),
  hashed_password: varchar("hashed_password").notNull().default("unset"),
});

export type NewUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

export const refresh_tokens = pgTable("refresh_tokens", {
  token: varchar("token").primaryKey(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  revokedAt: timestamp("revokedAt"),
});

export type NewRefreshToken = typeof refresh_tokens.$inferInsert;
export type RefreshToken = typeof refresh_tokens.$inferSelect;

export const chirps = pgTable("chirps", {
  id: uuid("id").primaryKey().defaultRandom(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at")
    .notNull()
    .defaultNow()
    .$onUpdate(() => new Date()),
  body: varchar("body", { length: 140 }).notNull(),
  userId: uuid("userId")
    .references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
    .notNull(),
});

export type NewChirp = typeof chirps.$inferInsert;
export type Chirps = typeof chirps.$inferSelect;
