CREATE TABLE "wards" (
	"id" smallint PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "wards_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 32767 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"slug" varchar(80) NOT NULL,
	"fomrer_areas" text,
	"sort_order" smallint DEFAULT 0 NOT NULL,
	CONSTRAINT "wards_name_unique" UNIQUE("name"),
	CONSTRAINT "wards_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "wards" ENABLE ROW LEVEL SECURITY;