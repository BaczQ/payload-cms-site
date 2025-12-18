import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

// Adds Posts.subTitle field
export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "posts"
      ADD COLUMN IF NOT EXISTS "sub_title" varchar;

    ALTER TABLE "_posts_v"
      ADD COLUMN IF NOT EXISTS "version_sub_title" varchar;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    ALTER TABLE "_posts_v"
      DROP COLUMN IF EXISTS "version_sub_title";

    ALTER TABLE "posts"
      DROP COLUMN IF EXISTS "sub_title";
  `)
}
