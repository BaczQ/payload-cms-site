import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'bio_short'
      ) THEN
        ALTER TABLE "users" ADD COLUMN "bio_short" varchar;
      END IF;

      IF NOT EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'bio_full'
      ) THEN
        ALTER TABLE "users" ADD COLUMN "bio_full" varchar;
      END IF;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    BEGIN
      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'bio_short'
      ) THEN
        ALTER TABLE "users" DROP COLUMN "bio_short";
      END IF;

      IF EXISTS (
        SELECT 1
        FROM information_schema.columns
        WHERE table_name = 'users'
          AND column_name = 'bio_full'
      ) THEN
        ALTER TABLE "users" DROP COLUMN "bio_full";
      END IF;
    END $$;
  `)
}
