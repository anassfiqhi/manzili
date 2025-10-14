import { Migration } from '@mikro-orm/migrations';

export class Migration20251008220514 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "carousel" ("id" text not null, "title" text not null, "description" text null, "image_url" text not null, "alt_text" text null, "order" integer not null default 0, "is_active" boolean not null default true, "primary_button_text" text null, "primary_button_url" text null, "secondary_button_text" text null, "secondary_button_url" text null, "file_id" text null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "carousel_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_carousel_deleted_at" ON "carousel" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "carousel" cascade;`);
  }

}
