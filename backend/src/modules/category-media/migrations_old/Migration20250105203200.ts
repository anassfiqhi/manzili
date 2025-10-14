import { Migration } from '@mikro-orm/migrations';

export class Migration20250105203200 extends Migration {

  async up(): Promise<void> {
    this.addSql('create table if not exists "category_media" ("id" varchar(255) not null, "category_id" varchar(255) not null, "file_id" varchar(255) null, "url" varchar(255) not null, "alt_text" varchar(255) null, "mime_type" varchar(255) null, "size" numeric null, "width" integer null, "height" integer null, "order" integer not null default 0, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "category_media_pkey" primary key ("id"));');
    this.addSql('create index "IDX_category_media_category_id" on "category_media" ("category_id");');
    this.addSql('create index "IDX_category_media_deleted_at" on "category_media" ("deleted_at");');
  }

  async down(): Promise<void> {
    this.addSql('drop table if exists "category_media" cascade;');
  }

}