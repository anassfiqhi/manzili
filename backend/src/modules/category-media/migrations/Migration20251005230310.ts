import { Migration } from '@mikro-orm/migrations';

export class Migration20251005230310 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "category_media" add column if not exists "is_thumbnail" boolean not null default false;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "category_media" drop column if exists "is_thumbnail";`);
  }

}
