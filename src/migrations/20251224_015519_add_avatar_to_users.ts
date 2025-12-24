import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
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

  // Drop columns conditionally
  await db.execute(sql`
    DO $$ 
    BEGIN
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_selected_element') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_selected_element";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_body_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_body_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_h1_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_h1_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_post_text_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_post_text_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_button_text_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_button_text_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_all_posts_link_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_all_posts_link_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_category_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_category_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_card_text_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_card_text_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_menu_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_menu_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_footer_text_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_footer_text_desktop_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_mobile_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_mobile_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_mobile_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_mobile_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_style";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_desktop_font_size') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_size";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_desktop_line_height') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_line_height";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_desktop_font_weight') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_weight";
      END IF;
      IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'fonts_header_menu_desktop_font_style') THEN
        ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_style";
      END IF;
    END $$;
  `)

  // Drop enum types conditionally
  await db.execute(sql`
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_selected_element";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_body_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_h1_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_h1_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_h1_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_h1_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_post_text_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_post_text_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_post_text_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_post_text_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_button_text_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_button_text_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_button_text_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_button_text_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_all_posts_link_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_all_posts_link_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_all_posts_link_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_all_posts_link_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_category_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_category_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_category_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_category_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_text_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_text_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_text_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_card_text_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_menu_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_menu_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_menu_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_menu_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_text_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_text_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_text_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_footer_text_desktop_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_header_menu_mobile_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_header_menu_mobile_font_style";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_header_menu_desktop_font_weight";
  DROP TYPE IF EXISTS "public"."enum_site_settings_fonts_header_menu_desktop_font_style";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_fonts_selected_element" AS ENUM('body', 'h1', 'postText', 'buttonText', 'allPostsLink', 'cardCategory', 'cardText', 'footerMenu', 'footerText', 'headerMenu');
  CREATE TYPE "public"."enum_site_settings_fonts_body_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_body_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_body_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_body_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_h1_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_h1_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_h1_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_h1_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_post_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_post_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_post_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_post_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_button_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_button_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_button_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_button_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_card_category_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_card_category_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_card_category_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_card_category_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_card_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_card_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_card_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_card_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_footer_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  ALTER TABLE "users" DROP CONSTRAINT "users_avatar_id_media_id_fk";
  
  DROP INDEX "users_avatar_idx";
  ALTER TABLE "site_settings" ADD COLUMN "fonts_selected_element" "enum_site_settings_fonts_selected_element" DEFAULT 'body';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_mobile_font_weight" "enum_site_settings_fonts_body_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_mobile_font_style" "enum_site_settings_fonts_body_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_desktop_font_weight" "enum_site_settings_fonts_body_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_body_desktop_font_style" "enum_site_settings_fonts_body_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_mobile_font_weight" "enum_site_settings_fonts_h1_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_mobile_font_style" "enum_site_settings_fonts_h1_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_desktop_font_weight" "enum_site_settings_fonts_h1_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_h1_desktop_font_style" "enum_site_settings_fonts_h1_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_mobile_font_weight" "enum_site_settings_fonts_post_text_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_mobile_font_style" "enum_site_settings_fonts_post_text_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_desktop_font_weight" "enum_site_settings_fonts_post_text_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_post_text_desktop_font_style" "enum_site_settings_fonts_post_text_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_mobile_font_weight" "enum_site_settings_fonts_button_text_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_mobile_font_style" "enum_site_settings_fonts_button_text_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_desktop_font_weight" "enum_site_settings_fonts_button_text_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_button_text_desktop_font_style" "enum_site_settings_fonts_button_text_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_mobile_font_weight" "enum_site_settings_fonts_all_posts_link_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_mobile_font_style" "enum_site_settings_fonts_all_posts_link_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_desktop_font_weight" "enum_site_settings_fonts_all_posts_link_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_all_posts_link_desktop_font_style" "enum_site_settings_fonts_all_posts_link_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_mobile_font_weight" "enum_site_settings_fonts_card_category_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_mobile_font_style" "enum_site_settings_fonts_card_category_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_desktop_font_weight" "enum_site_settings_fonts_card_category_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_category_desktop_font_style" "enum_site_settings_fonts_card_category_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_mobile_font_weight" "enum_site_settings_fonts_card_text_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_mobile_font_style" "enum_site_settings_fonts_card_text_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_desktop_font_weight" "enum_site_settings_fonts_card_text_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_card_text_desktop_font_style" "enum_site_settings_fonts_card_text_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_mobile_font_weight" "enum_site_settings_fonts_footer_menu_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_mobile_font_style" "enum_site_settings_fonts_footer_menu_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_desktop_font_weight" "enum_site_settings_fonts_footer_menu_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_menu_desktop_font_style" "enum_site_settings_fonts_footer_menu_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_mobile_font_weight" "enum_site_settings_fonts_footer_text_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_mobile_font_style" "enum_site_settings_fonts_footer_text_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_desktop_font_weight" "enum_site_settings_fonts_footer_text_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_footer_text_desktop_font_style" "enum_site_settings_fonts_footer_text_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_weight" "enum_site_settings_fonts_header_menu_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_style" "enum_site_settings_fonts_header_menu_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_weight" "enum_site_settings_fonts_header_menu_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_style" "enum_site_settings_fonts_header_menu_desktop_font_style" DEFAULT 'normal';
  ALTER TABLE "users" DROP COLUMN "avatar_id";`)
}
