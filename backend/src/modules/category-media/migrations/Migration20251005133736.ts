import { Migration } from '@mikro-orm/migrations';

export class Migration20251005133736 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "category_media" ("id" text not null, "category_id" text not null, "file_id" text null, "url" text not null, "alt_text" text null, "mime_type" text null, "size" numeric null, "width" integer null, "height" integer null, "order" integer not null default 0, "raw_size" jsonb null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_media_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_category_media_deleted_at" ON "category_media" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "category_media" cascade;`);
  }

}
