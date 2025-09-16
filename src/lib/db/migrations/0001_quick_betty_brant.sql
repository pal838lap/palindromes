CREATE TABLE "brand" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "brand_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "category" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"description" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "category_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE "palindrome" (
	"id" text PRIMARY KEY NOT NULL,
	"userProfileId" text,
	"picture" text,
	"brandId" text,
	"year" integer,
	"categoryId" text,
	"model" text,
	"color" text,
	"foundAt" timestamp,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "userProfile" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text NOT NULL,
	"avatar" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "palindrome" ADD CONSTRAINT "palindrome_userProfileId_userProfile_id_fk" FOREIGN KEY ("userProfileId") REFERENCES "public"."userProfile"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "palindrome" ADD CONSTRAINT "palindrome_brandId_brand_id_fk" FOREIGN KEY ("brandId") REFERENCES "public"."brand"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "palindrome" ADD CONSTRAINT "palindrome_categoryId_category_id_fk" FOREIGN KEY ("categoryId") REFERENCES "public"."category"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "brand_name_idx" ON "brand" USING btree ("name");--> statement-breakpoint
CREATE INDEX "category_name_idx" ON "category" USING btree ("name");--> statement-breakpoint
CREATE INDEX "palindrome_userProfile_idx" ON "palindrome" USING btree ("userProfileId");--> statement-breakpoint
CREATE INDEX "palindrome_category_idx" ON "palindrome" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "palindrome_brand_idx" ON "palindrome" USING btree ("brandId");--> statement-breakpoint
CREATE INDEX "palindrome_text_idx" ON "palindrome" USING btree ("id");--> statement-breakpoint
CREATE INDEX "palindrome_year_idx" ON "palindrome" USING btree ("year");--> statement-breakpoint
CREATE INDEX "palindrome_foundAt_idx" ON "palindrome" USING btree ("foundAt");--> statement-breakpoint
CREATE INDEX "userProfile_name_idx" ON "userProfile" USING btree ("name");