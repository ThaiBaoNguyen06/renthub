import { pgTable, uuid, varchar, text, timestamp, pgEnum, integer,} from "drizzle-orm/pg-core";

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

export const transactionTypeEnum = pgEnum( "transaction_type", [
    "rent",
])

export const propertyTypeEnum = pgEnum( "property_type", [
    "apartment",
    "house",
    "villa",
    "studio",
    "office",
    "shop",
    "room",
    "townhouse",
])

export const propertyRequestStatusEnum = pgEnum(
  "property_request_status",
  [
    "pending",
    "accepted",
    "needs_changes",
    "approved",
    "published",
    "rejected",
    "cancelled",
  ]
);

export const propertyRequests = pgTable("property_requests", {
    id: uuid("id").defaultRandom().primaryKey(),

    hostId: uuid("host_id").notNull().references(() => users.id),

    assignedAgentId: uuid("assigned_agent_id").references(() => users.id),

    transactionType: transactionTypeEnum("transaction_type").notNull(),

    propertyType: propertyTypeEnum("property_type").notNull(),

    title: varchar("title", {length:160}).notNull(),

    description: text("description"),

    addressLine: varchar("address_line", { length: 255 }).notNull(),

    ward: varchar("ward", { length: 120 }),

    district: varchar("district", { length: 120 }).notNull(),

    city: varchar("city", { length: 120 }).notNull(),

    expectedPrice: integer("expected_price").notNull(),

    pricePeriod: varchar("price_period", { length: 20 }),

    bedrooms: integer("bedrooms"),

    bathrooms: integer("bathrooms"),

    areaSqm: integer("area_sqm"),

    status: propertyRequestStatusEnum("status")
        .default("pending")
        .notNull(),

    hostNotes: text("host_notes"),

    agentNotes: text("agent_notes"),

    rejectionReason: text("rejection_reason"),

    submittedAt: timestamp("submitted_at")
        .defaultNow()
        .notNull(),

    acceptedAt: timestamp("accepted_at"),

    createdAt: timestamp("created_at")
        .defaultNow()
        .notNull(),

    updatedAt: timestamp("updated_at")
        .defaultNow()
        .notNull(),
});