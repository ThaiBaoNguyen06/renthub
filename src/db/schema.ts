import { pgTable, uuid, varchar, text, timestamp, pgEnum, } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("roles", [
    "client",
    "host",
    "agent",
    "admin",
]);

export const statusEnum = pgEnum("status", [
    "active",
    "suspended",
    "deactivated",
])

export const users = pgTable("users", {
    id: uuid("id").defaultRandom().primaryKey(),
    fullName: varchar("full_name", { length: 120 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    passwordHash : text("password_hash").notNull(),
    phone: varchar("phone", { length: 20 }),
    role: roleEnum("role").notNull(),
    status: statusEnum("status").default("active").notNull(),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
});