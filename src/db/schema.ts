import {boolean, pgEnum, pgTable, smallint, text, varchar, timestamp, uuid} from "drizzle-orm/pg-core";
export const wards = pgTable("wards", {
    id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
    name: varchar("name", {length: 80}).notNull().unique(),
    slug: varchar("slug", {length: 80}).notNull().unique(),
    formerArea: text("former_areas"),
    sortOrder: smallint("sort_order").notNull().default(0)
}).enableRLS();

export const userRole = pgEnum("user_role", ["host", "admin", "agent", "client"]);

export const users = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 100 }).notNull(),
    email: varchar("email", { length: 254 }).notNull().unique(),
    phone: varchar("phone", { length: 20 }),
    passwordHash: text("password_hash").notNull(),
    role: userRole("role").notNull(),
    isActive: boolean("is_active").notNull().default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow().$onUpdate(() => new Date()),
}).enableRLS()