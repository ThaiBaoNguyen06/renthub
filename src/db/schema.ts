// Mirrors docs/database.md — change the doc first, then this file.
import { sql } from "drizzle-orm";
import {
  bigint,
  boolean,
  check,
  index,
  integer,
  pgEnum,
  pgTable,
  primaryKey,
  smallint,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

// ---------- Enums ----------

export const userRole = pgEnum("user_role", ["host", "agent", "client", "admin"]);

export const propertyType = pgEnum("property_type", [
  "apartment",
  "house",
  "townhouse",
  "villa",
  "studio",
  "room",
]);

export const propertyRequestStatus = pgEnum("property_request_status", [
  "pending",
  "accepted",
  "needs_changes",
  "approved",
  "rejected",
  "cancelled",
]);

export const listingStatus = pgEnum("listing_status", ["draft", "published", "archived"]);

export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "closed"]);

// ---------- Shared columns ----------

const createdAt = () => timestamp("created_at", { withTimezone: true }).defaultNow().notNull();
const updatedAt = () => timestamp("updated_at", { withTimezone: true }).defaultNow().notNull();
const vnd = (name: string) => bigint(name, { mode: "number" });

// ---------- Tables ----------
// RLS is enabled with no policies: Supabase's public Data API sees nothing,
// while our server connection (postgres role) bypasses RLS.

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  email: varchar("email", { length: 254 }).notNull().unique(), // stored lowercase
  phone: varchar("phone", { length: 20 }),
  passwordHash: text("password_hash").notNull(),
  role: userRole("role").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: createdAt(),
  updatedAt: updatedAt(),
}).enableRLS();

// New (post-2025) wards covering former District 7. Seeded by a migration.
export const wards = pgTable("wards", {
  id: smallint("id").primaryKey().generatedAlwaysAsIdentity(),
  name: varchar("name", { length: 80 }).notNull().unique(),
  slug: varchar("slug", { length: 80 }).notNull().unique(),
  formerAreas: text("former_areas"),
  sortOrder: smallint("sort_order").default(0).notNull(),
}).enableRLS();

export const propertyRequests = pgTable(
  "property_requests",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    hostId: uuid("host_id").notNull().references(() => users.id),
    assignedAgentId: uuid("assigned_agent_id").references(() => users.id),
    status: propertyRequestStatus("status").default("pending").notNull(),
    propertyType: propertyType("property_type").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    addressLine: varchar("address_line", { length: 255 }).notNull(), // private
    wardId: smallint("ward_id").notNull().references(() => wards.id),
    monthlyPrice: vnd("monthly_price").notNull(),
    areaSqm: integer("area_sqm"),
    bedrooms: smallint("bedrooms"),
    bathrooms: smallint("bathrooms"),
    hostNotes: text("host_notes"),
    agentNotes: text("agent_notes"), // internal, never public
    submittedAt: timestamp("submitted_at", { withTimezone: true }).defaultNow().notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("property_requests_status_idx").on(t.status),
    index("property_requests_host_idx").on(t.hostId),
    index("property_requests_agent_idx").on(t.assignedAgentId),
    check("property_requests_price_positive", sql`${t.monthlyPrice} > 0`),
  ],
).enableRLS();

export const propertyRequestStatusHistory = pgTable(
  "property_request_status_history",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    requestId: uuid("request_id").notNull().references(() => propertyRequests.id),
    fromStatus: propertyRequestStatus("from_status"), // null for the initial entry
    toStatus: propertyRequestStatus("to_status").notNull(),
    actorId: uuid("actor_id").notNull().references(() => users.id),
    reason: text("reason"),
    createdAt: createdAt(),
  },
  (t) => [
    index("pr_history_request_idx").on(t.requestId, t.createdAt),
    check(
      "pr_history_reason_required",
      sql`${t.toStatus} NOT IN ('needs_changes', 'rejected') OR coalesce(length(trim(${t.reason})), 0) > 0`,
    ),
  ],
).enableRLS();

// The managing Agent is property_requests.assigned_agent_id of the linked request — not stored here.
export const listings = pgTable(
  "listings",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    propertyRequestId: uuid("property_request_id")
      .notNull()
      .unique() // max one listing per request
      .references(() => propertyRequests.id),
    slug: varchar("slug", { length: 200 }).notNull().unique(), // title slug + 6-char id suffix
    status: listingStatus("status").default("draft").notNull(),
    propertyType: propertyType("property_type").notNull(),
    title: varchar("title", { length: 160 }).notNull(),
    description: text("description"),
    monthlyPrice: vnd("monthly_price").notNull(),
    areaSqm: integer("area_sqm"),
    bedrooms: smallint("bedrooms"),
    bathrooms: smallint("bathrooms"),
    wardId: smallint("ward_id").notNull().references(() => wards.id),
    street: varchar("street", { length: 160 }), // no house number
    publishedAt: timestamp("published_at", { withTimezone: true }),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("listings_status_published_idx").on(t.status, t.publishedAt.desc()),
    index("listings_ward_idx").on(t.wardId),
    index("listings_price_idx").on(t.monthlyPrice),
    check("listings_price_positive", sql`${t.monthlyPrice} > 0`),
  ],
).enableRLS();

export const listingImages = pgTable(
  "listing_images",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    storagePath: text("storage_path").notNull(), // path in Supabase Storage
    sortOrder: smallint("sort_order").default(0).notNull(), // 0 = cover
    createdAt: createdAt(),
  },
  (t) => [index("listing_images_listing_idx").on(t.listingId, t.sortOrder)],
).enableRLS();

// The handling Agent is found via listing → property_request.assigned_agent_id.
export const enquiries = pgTable(
  "enquiries",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    listingId: uuid("listing_id").notNull().references(() => listings.id),
    clientId: uuid("client_id").notNull().references(() => users.id),
    message: text("message").notNull(),
    contactPhone: varchar("contact_phone", { length: 20 }),
    status: enquiryStatus("status").default("new").notNull(),
    createdAt: createdAt(),
    updatedAt: updatedAt(),
  },
  (t) => [
    index("enquiries_listing_status_idx").on(t.listingId, t.status),
    index("enquiries_client_idx").on(t.clientId),
  ],
).enableRLS();

export const savedListings = pgTable(
  "saved_listings",
  {
    clientId: uuid("client_id").notNull().references(() => users.id),
    listingId: uuid("listing_id")
      .notNull()
      .references(() => listings.id, { onDelete: "cascade" }),
    createdAt: createdAt(),
  },
  (t) => [primaryKey({ columns: [t.clientId, t.listingId] })],
).enableRLS();
