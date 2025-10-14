import { Migration } from '@mikro-orm/migrations';

export class Migration20251011231802 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "carousel_slide" ("id" text not null, "carousel_id" text not null, "title" text not null, "description" text null, "primary_button_text" text null, "primary_button_url" text null, "secondary_button_text" text null, "secondary_button_url" text null, "rank" integer not null default 0, "is_active" boolean not null default true, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "carousel_slide_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carousel_slide_deleted_at" ON "carousel_slide" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`create table if not exists "carousel_slide_media" ("id" text not null, "slide_id" text not null, "file_id" text null, "url" text not null, "alt_text" text null, "mime_type" text null, "size" numeric null, "width" integer null, "height" integer null, "order" integer not null default 0, "is_thumbnail" boolean not null default false, "raw_size" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "carousel_slide_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carousel_slide_media_deleted_at" ON "carousel_slide_media" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "carousel_slide" cascade;`);

    this.addSql(`drop table if exists "carousel_slide_media" cascade;`);
  }

}
