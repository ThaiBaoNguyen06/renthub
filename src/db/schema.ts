import { sql } from "drizzle-orm";
import {
  bigint, boolean, check, index, integer, pgEnum, pgTable, primaryKey,
  smallint, text, timestamp, uuid, varchar,
} from "drizzle-orm/pg-core";

const timestamps = {
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull().defaultNow()
    .$onUpdate(() => new Date()),
};

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
}).enableRLS();

// ---------- Enums ----------
export const propertyType = pgEnum("property_type",
  ["apartment", "house", "townhouse", "villa", "studio", "room"]);
export const propertyRequestStatus = pgEnum("property_request_status",
  ["pending", "accepted", "needs_changes", "approved", "rejected", "cancelled"]);
export const listingStatus = pgEnum("listing_status", ["draft", "published", "archived"]);
export const enquiryStatus = pgEnum("enquiry_status", ["new", "contacted", "closed"]);

// ---------- Hồ sơ của Host ----------
export const propertyRequests = pgTable("property_requests", {
  id: uuid("id").primaryKey().defaultRandom(),
  hostId: uuid("host_id").notNull().references(() => users.id),          // khóa ngoại → users
  assignedAgentId: uuid("assigned_agent_id").references(() => users.id), // null khi chưa ai nhận
  status: propertyRequestStatus("status").notNull().default("pending"),
  propertyType: propertyType("property_type").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  addressLine: varchar("address_line", { length: 255 }).notNull(),     // RIÊNG TƯ
  wardId: smallint("ward_id").notNull().references(() => wards.id),
  monthlyPrice: bigint("monthly_price", { mode: "number" }).notNull(), // VND
  areaSqm: integer("area_sqm"),
  bedrooms: smallint("bedrooms"),
  bathrooms: smallint("bathrooms"),
  hostNotes: text("host_notes"),
  agentNotes: text("agent_notes"),                                     // nội bộ, không bao giờ public
  submittedAt: timestamp("submitted_at", { withTimezone: true }).notNull().defaultNow(),
  ...timestamps,
}, (t) => [
  index("property_requests_status_idx").on(t.status),
  index("property_requests_host_idx").on(t.hostId),
  index("property_requests_agent_idx").on(t.assignedAgentId),
  check("property_requests_price_positive", sql`${t.monthlyPrice} > 0`),
]).enableRLS();

// ---------- Lịch sử trạng thái: ai, khi nào, vì sao ----------
export const propertyRequestStatusHistory = pgTable("property_request_status_history", {
  id: uuid("id").primaryKey().defaultRandom(),
  requestId: uuid("request_id").notNull().references(() => propertyRequests.id),
  fromStatus: propertyRequestStatus("from_status"),   // null cho lần gửi đầu tiên
  toStatus: propertyRequestStatus("to_status").notNull(),
  actorId: uuid("actor_id").notNull().references(() => users.id),
  reason: text("reason"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  index("status_history_request_idx").on(t.requestId, t.createdAt),
  // Yêu cầu sửa / từ chối thì BẮT BUỘC có lý do. DB tự chặn, kể cả khi code quên kiểm tra
  check("status_history_reason_required",
    sql`${t.toStatus} not in ('needs_changes', 'rejected') or coalesce(length(trim(${t.reason})), 0) > 0`),
]).enableRLS();

// ---------- Tin đăng công khai ----------
export const listings = pgTable("listings", {
  id: uuid("id").primaryKey().defaultRandom(),
  // unique: mỗi hồ sơ tối đa 1 tin đăng
  propertyRequestId: uuid("property_request_id").notNull().unique()
    .references(() => propertyRequests.id),
  slug: varchar("slug", { length: 200 }).notNull().unique(),
  status: listingStatus("status").notNull().default("draft"),
  propertyType: propertyType("property_type").notNull(),
  title: varchar("title", { length: 160 }).notNull(),
  description: text("description"),
  monthlyPrice: bigint("monthly_price", { mode: "number" }).notNull(),
  areaSqm: integer("area_sqm"),
  bedrooms: smallint("bedrooms"),
  bathrooms: smallint("bathrooms"),
  wardId: smallint("ward_id").notNull().references(() => wards.id),
  street: varchar("street", { length: 160 }),   // tên đường, KHÔNG có số nhà
  publishedAt: timestamp("published_at", { withTimezone: true }),
  ...timestamps,
}, (t) => [
  index("listings_status_published_idx").on(t.status, t.publishedAt.desc()),
  index("listings_ward_idx").on(t.wardId),
  index("listings_price_idx").on(t.monthlyPrice),
  check("listings_price_positive", sql`${t.monthlyPrice} > 0`),
]).enableRLS();

// ---------- Ảnh của tin đăng ----------
export const listingImages = pgTable("listing_images", {
  id: uuid("id").primaryKey().defaultRandom(),
  // cascade: xóa tin đăng thì ảnh tự xóa theo
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  storagePath: text("storage_path").notNull(),
  sortOrder: smallint("sort_order").notNull().default(0),   // ảnh đầu tiên là ảnh bìa
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [index("listing_images_listing_idx").on(t.listingId, t.sortOrder)]).enableRLS();

// ---------- Yêu cầu liên hệ của Client ----------
export const enquiries = pgTable("enquiries", {
  id: uuid("id").primaryKey().defaultRandom(),
  listingId: uuid("listing_id").notNull().references(() => listings.id),
  clientId: uuid("client_id").notNull().references(() => users.id),
  message: text("message").notNull(),
  contactPhone: varchar("contact_phone", { length: 20 }),
  status: enquiryStatus("status").notNull().default("new"),
  ...timestamps,
}, (t) => [
  index("enquiries_listing_status_idx").on(t.listingId, t.status),
  index("enquiries_client_idx").on(t.clientId),
]).enableRLS();

// ---------- Tin đã lưu ----------
export const savedListings = pgTable("saved_listings", {
  clientId: uuid("client_id").notNull().references(() => users.id),
  listingId: uuid("listing_id").notNull().references(() => listings.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
}, (t) => [
  // Khóa chính gồm 2 cột: một client không thể lưu cùng một tin 2 lần
  primaryKey({ columns: [t.clientId, t.listingId] }),
]).enableRLS();