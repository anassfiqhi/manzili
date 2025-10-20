import { Migration } from '@mikro-orm/migrations';

export class Migration20251019180000 extends Migration {

  override async up(): Promise<void> {
    // Add new columns to slide_media table to match categories_media structure
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "file_id" text NULL;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "mime_type" text NULL;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "size" numeric NULL;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "width" integer NULL;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "height" integer NULL;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "order" integer NOT NULL DEFAULT 0;`);
    
    // Drop old columns that don't exist in categories
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "rank";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "metadata";`);
  }

  override async down(): Promise<void> {
    // Reverse the changes
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "file_id";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "mime_type";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "size";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "width";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "height";`);
    this.addSql(`ALTER TABLE "slide_media" DROP COLUMN IF EXISTS "order";`);
    
    // Add back old columns
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "rank" integer NOT NULL DEFAULT 0;`);
    this.addSql(`ALTER TABLE "slide_media" ADD COLUMN IF NOT EXISTS "metadata" jsonb NULL;`);
  }

}