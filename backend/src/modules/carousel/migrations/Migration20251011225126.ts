import { Migration } from '@mikro-orm/migrations';

export class Migration20251011225126 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "carousel" drop column if exists "image_url", drop column if exists "alt_text", drop column if exists "order", drop column if exists "primary_button_text", drop column if exists "primary_button_url", drop column if exists "secondary_button_text", drop column if exists "secondary_button_url", drop column if exists "file_id";`);

    this.addSql(`alter table if exists "carousel" add column if not exists "metadata" jsonb null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "carousel" drop column if exists "metadata";`);

    this.addSql(`alter table if exists "carousel" add column if not exists "image_url" text not null, add column if not exists "alt_text" text null, add column if not exists "order" integer not null default 0, add column if not exists "primary_button_text" text null, add column if not exists "primary_button_url" text null, add column if not exists "secondary_button_text" text null, add column if not exists "secondary_button_url" text null, add column if not exists "file_id" text null;`);
  }

}
