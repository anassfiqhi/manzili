import { Migration } from '@mikro-orm/migrations';

export class Migration20251019212239 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`drop table if exists "slide_media" cascade;`);

    this.addSql(`alter table if exists "slide" add column if not exists "images" jsonb null, add column if not exists "thumbnail" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`create table if not exists "slide_media" ("id" text not null, "slide_id" text not null, "url" text not null, "alt_text" text null, "rank" integer not null default 0, "is_thumbnail" boolean not null default false, "metadata" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "slide_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_slide_media_deleted_at" ON "slide_media" (deleted_at) WHERE deleted_at IS NULL;`);

    this.addSql(`alter table if exists "slide" drop column if exists "images", drop column if exists "thumbnail";`);
  }

}
