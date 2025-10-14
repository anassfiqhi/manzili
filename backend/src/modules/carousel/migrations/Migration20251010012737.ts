import { Migration } from '@mikro-orm/migrations';

export class Migration20251010012737 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "carousel" add column if not exists "handle" text null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "carousel" drop column if exists "handle";`);
  }

}
