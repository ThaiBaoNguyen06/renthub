CREATE TYPE "public"."enquiry_status" AS ENUM('new', 'contacted', 'closed');--> statement-breakpoint
CREATE TYPE "public"."listing_status" AS ENUM('draft', 'published', 'archived');--> statement-breakpoint
CREATE TYPE "public"."property_request_status" AS ENUM('pending', 'accepted', 'needs_changes', 'approved', 'rejected', 'cancelled');--> statement-breakpoint
CREATE TYPE "public"."property_type" AS ENUM('apartment', 'house', 'townhouse', 'villa', 'studio', 'room');--> statement-breakpoint
CREATE TYPE "public"."user_role" AS ENUM('host', 'agent', 'client', 'admin');--> statement-breakpoint
CREATE TABLE "enquiries" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"client_id" uuid NOT NULL,
	"message" text NOT NULL,
	"contact_phone" varchar(20),
	"status" "enquiry_status" DEFAULT 'new' NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "enquiries" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "listing_images" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"listing_id" uuid NOT NULL,
	"storage_path" text NOT NULL,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "listing_images" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "listings" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"property_request_id" uuid NOT NULL,
	"slug" varchar(200) NOT NULL,
	"status" "listing_status" DEFAULT 'draft' NOT NULL,
	"property_type" "property_type" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"monthly_price" bigint NOT NULL,
	"area_sqm" integer,
	"bedrooms" smallint,
	"bathrooms" smallint,
	"ward_id" smallint NOT NULL,
	"street" varchar(160),
	"published_at" timestamp with time zone,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "listings_property_request_id_unique" UNIQUE("property_request_id"),
	CONSTRAINT "listings_slug_unique" UNIQUE("slug"),
	CONSTRAINT "listings_price_positive" CHECK ("listings"."monthly_price" > 0)
);
--> statement-breakpoint
ALTER TABLE "listings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "property_request_status_history" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"request_id" uuid NOT NULL,
	"from_status" "property_request_status",
	"to_status" "property_request_status" NOT NULL,
	"actor_id" uuid NOT NULL,
	"reason" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "pr_history_reason_required" CHECK ("property_request_status_history"."to_status" NOT IN ('needs_changes', 'rejected') OR coalesce(length(trim("property_request_status_history"."reason")), 0) > 0)
);
--> statement-breakpoint
ALTER TABLE "property_request_status_history" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "property_requests" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"host_id" uuid NOT NULL,
	"assigned_agent_id" uuid,
	"status" "property_request_status" DEFAULT 'pending' NOT NULL,
	"property_type" "property_type" NOT NULL,
	"title" varchar(160) NOT NULL,
	"description" text,
	"address_line" varchar(255) NOT NULL,
	"ward_id" smallint NOT NULL,
	"monthly_price" bigint NOT NULL,
	"area_sqm" integer,
	"bedrooms" smallint,
	"bathrooms" smallint,
	"host_notes" text,
	"agent_notes" text,
	"submitted_at" timestamp with time zone DEFAULT now() NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "property_requests_price_positive" CHECK ("property_requests"."monthly_price" > 0)
);
--> statement-breakpoint
ALTER TABLE "property_requests" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "saved_listings" (
	"client_id" uuid NOT NULL,
	"listing_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "saved_listings_client_id_listing_id_pk" PRIMARY KEY("client_id","listing_id")
);
--> statement-breakpoint
ALTER TABLE "saved_listings" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "users" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(100) NOT NULL,
	"email" varchar(254) NOT NULL,
	"phone" varchar(20),
	"password_hash" text NOT NULL,
	"role" "user_role" NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE "wards" (
	"id" smallint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wards_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START WITH 1 CACHE 1),
	"name" varchar(80) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"former_areas" text,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "wards_name_unique" UNIQUE("name"),
	CONSTRAINT "wards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "wards" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "enquiries" ADD CONSTRAINT "enquiries_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listing_images" ADD CONSTRAINT "listing_images_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_property_request_id_property_requests_id_fk" FOREIGN KEY ("property_request_id") REFERENCES "public"."property_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "listings" ADD CONSTRAINT "listings_ward_id_wards_id_fk" FOREIGN KEY ("ward_id") REFERENCES "public"."wards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_request_status_history" ADD CONSTRAINT "property_request_status_history_request_id_property_requests_id_fk" FOREIGN KEY ("request_id") REFERENCES "public"."property_requests"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_request_status_history" ADD CONSTRAINT "property_request_status_history_actor_id_users_id_fk" FOREIGN KEY ("actor_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_requests" ADD CONSTRAINT "property_requests_host_id_users_id_fk" FOREIGN KEY ("host_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_requests" ADD CONSTRAINT "property_requests_assigned_agent_id_users_id_fk" FOREIGN KEY ("assigned_agent_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "property_requests" ADD CONSTRAINT "property_requests_ward_id_wards_id_fk" FOREIGN KEY ("ward_id") REFERENCES "public"."wards"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_client_id_users_id_fk" FOREIGN KEY ("client_id") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "saved_listings" ADD CONSTRAINT "saved_listings_listing_id_listings_id_fk" FOREIGN KEY ("listing_id") REFERENCES "public"."listings"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "enquiries_listing_status_idx" ON "enquiries" USING btree ("listing_id","status");--> statement-breakpoint
CREATE INDEX "enquiries_client_idx" ON "enquiries" USING btree ("client_id");--> statement-breakpoint
CREATE INDEX "listing_images_listing_idx" ON "listing_images" USING btree ("listing_id","sort_order");--> statement-breakpoint
CREATE INDEX "listings_status_published_idx" ON "listings" USING btree ("status","published_at" DESC NULLS LAST);--> statement-breakpoint
CREATE INDEX "listings_ward_idx" ON "listings" USING btree ("ward_id");--> statement-breakpoint
CREATE INDEX "listings_price_idx" ON "listings" USING btree ("monthly_price");--> statement-breakpoint
CREATE INDEX "pr_history_request_idx" ON "property_request_status_history" USING btree ("request_id","created_at");--> statement-breakpoint
CREATE INDEX "property_requests_status_idx" ON "property_requests" USING btree ("status");--> statement-breakpoint
CREATE INDEX "property_requests_host_idx" ON "property_requests" USING btree ("host_id");--> statement-breakpoint
CREATE INDEX "property_requests_agent_idx" ON "property_requests" USING btree ("assigned_agent_id");