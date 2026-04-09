ALTER TABLE "users" ADD COLUMN "username" varchar(50);--> statement-breakpoint
ALTER TABLE "users" ADD CONSTRAINT "users_username_unique" UNIQUE("username");--> statement-breakpoint
UPDATE "users" SET "username" = 'TIS00662829' WHERE "email" = 'TIS00662829';--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "email" DROP NOT NULL;--> statement-breakpoint
UPDATE "users" SET "email" = NULL WHERE "email" = 'TIS00662829';