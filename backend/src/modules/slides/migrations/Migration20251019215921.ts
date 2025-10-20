import { Migration } from '@mikro-orm/migrations';

export class Migration20251019215921 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`alter table if exists "slide" rename column "images" to "media";`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table if exists "slide" rename column "media" to "images";`);
  }

}
