ALTER TABLE "gallery_photos" ADD COLUMN "media_type" text DEFAULT 'image' NOT NULL;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD COLUMN "video_url" text;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD COLUMN "youtube_id" text;--> statement-breakpoint
ALTER TABLE "gallery_photos" ADD CONSTRAINT "gallery_photos_media_payload_check" CHECK (("gallery_photos"."media_type" = 'image' AND "gallery_photos"."video_url" IS NULL AND "gallery_photos"."youtube_id" IS NULL)
       OR ("gallery_photos"."media_type" = 'video' AND (("gallery_photos"."video_url" IS NOT NULL) <> ("gallery_photos"."youtube_id" IS NOT NULL))));