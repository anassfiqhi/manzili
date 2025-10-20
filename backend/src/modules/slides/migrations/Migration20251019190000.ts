import { Migration } from '@mikro-orm/migrations';

export class Migration20251019190000 extends Migration {

  override async up(): Promise<void> {
    // Add images and thumbnail fields to slide table (like products)
    this.addSql(`ALTER TABLE "slide" ADD COLUMN IF NOT EXISTS "images" jsonb NULL;`);
    this.addSql(`ALTER TABLE "slide" ADD COLUMN IF NOT EXISTS "thumbnail" text NULL;`);
    
    // Drop the separate slide_media table since we're using product-style structure
    this.addSql(`DROP TABLE IF EXISTS "slide_media" CASCADE;`);
  }

  override async down(): Promise<void> {
    // Remove the new columns
    this.addSql(`ALTER TABLE "slide" DROP COLUMN IF EXISTS "images";`);
    this.addSql(`ALTER TABLE "slide" DROP COLUMN IF EXISTS "thumbnail";`);
    
    // Recreate slide_media table if rolling back
    this.addSql(`CREATE TABLE IF NOT EXISTS "slide_media" ("id" text not null, "slide_id" text not null, "file_id" text null, "url" text not null, "alt_text" text null, "mime_type" text null, "size" numeric null, "width" integer null, "height" integer null, "order" integer not null default 0, "is_thumbnail" boolean not null default false, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "slide_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_slide_media_deleted_at" ON "slide_media" (deleted_at) WHERE deleted_at IS NULL;`);
  }

}