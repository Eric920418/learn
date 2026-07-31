CREATE TABLE "videos" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"source" text DEFAULT 'upload' NOT NULL,
	"video_url" text,
	"youtube_id" text,
	"poster_image" text,
	"event_date" text,
	"published" boolean DEFAULT false NOT NULL,
	"sort_order" integer DEFAULT 0 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "videos_source_payload_check" CHECK (("videos"."source" = 'upload' AND "videos"."video_url" IS NOT NULL AND "videos"."youtube_id" IS NULL)
       OR ("videos"."source" = 'youtube' AND "videos"."youtube_id" IS NOT NULL AND "videos"."video_url" IS NULL))
);
