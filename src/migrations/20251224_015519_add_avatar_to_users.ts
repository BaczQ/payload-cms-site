import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Add avatar_id column if it doesn't exist
  await db.execute(sql`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_id') THEN
        ALTER TABLE "users" ADD COLUMN "avatar_id" integer;
      END IF;
    END $$;
  `)

  // Add foreign key constraint if it doesn't exist
  await db.execute(sql`
    DO $$ 
    BEGIN
      IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_avatar_id_media_id_fk') THEN
        ALTER TABLE "users" ADD CONSTRAINT "users_avatar_id_media_id_fk" FOREIGN KEY ("avatar_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
      END IF;
    END $$;
  `)

  // Create index if it doesn't exist
  await db.execute(sql`
    CREATE INDEX IF NOT EXISTS "users_avatar_idx" ON "users" USING btree ("avatar_id");
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.table_constraints WHERE constraint_name = 'users_avatar_id_media_id_fk') THEN
        ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
      END IF;
    END $$;
  `)

  await db.execute(sql`
    DROP INDEX IF EXISTS "users_avatar_idx";
  `)

  await db.execute(sql`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'avatar_id') THEN
        ALTER TABLE "users" DROP COLUMN "avatar_id";
      END IF;
    END $$;
  `)
}
