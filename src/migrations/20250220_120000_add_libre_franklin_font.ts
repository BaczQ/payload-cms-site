import { MigrateDownArgs, MigrateUpArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
    DO $$
    DECLARE
      enum_type record;
    BEGIN
      FOR enum_type IN
        SELECT n.nspname, t.typname
        FROM pg_type t
        JOIN pg_namespace n ON n.oid = t.typnamespace
        WHERE t.typtype = 'e'
          AND t.typname LIKE '%site_settings%fonts%'
      LOOP
        EXECUTE format(
          'ALTER TYPE %I.%I ADD VALUE IF NOT EXISTS ''libre-franklin''',
          enum_type.nspname,
          enum_type.typname
        );
      END LOOP;
    END $$;
  `)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
    -- No-op: PostgreSQL does not support dropping enum values safely.
  `)
}
