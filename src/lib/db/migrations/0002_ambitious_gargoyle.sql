CREATE TABLE "admin_user" (
	"id" text PRIMARY KEY NOT NULL,
		"userId" text NOT NULL,
		"grantedAt" timestamp NOT NULL,
		"grantedBy" text,
		"notes" text,
		CONSTRAINT "admin_user_userId_unique" UNIQUE("userId")
	);
	--> statement-breakpoint
	ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
	ALTER TABLE "admin_user" ADD CONSTRAINT "admin_user_grantedBy_user_id_fk" FOREIGN KEY ("grantedBy") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
	ALTER TABLE "user" DROP COLUMN IF EXISTS "isAdmin";