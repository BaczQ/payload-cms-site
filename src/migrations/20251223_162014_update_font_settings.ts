import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  // Create enum types if they don't exist
  await db.execute(sql`
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_selected_element" AS ENUM('body', 'h1', 'postText', 'buttonText', 'allPostsLink', 'cardCategory', 'cardText', 'footerMenu', 'footerText');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_button_text_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_button_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_button_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_button_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_button_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_all_posts_link_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_category_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_category_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_category_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_category_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_category_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_text_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_card_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_menu_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_text_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_text_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_text_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_text_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;
   
   DO $$ BEGIN
     CREATE TYPE "public"."enum_site_settings_fonts_footer_text_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
   EXCEPTION
     WHEN duplicate_object THEN null;
   END $$;`)

  // Update enum for selected_element if it exists
  await db.execute(sql`
   DO $$ BEGIN
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'buttonText';
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'allPostsLink';
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'cardCategory';
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'cardText';
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'footerMenu';
     ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE IF NOT EXISTS 'footerText';
   EXCEPTION
     WHEN undefined_object THEN null;
   END $$;`)

  // Add new columns to existing table (without DEFAULT for speed)
  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_font_family" "enum_site_settings_fonts_button_text_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_mobile_font_weight" "enum_site_settings_fonts_button_text_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_mobile_font_style" "enum_site_settings_fonts_button_text_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_desktop_font_weight" "enum_site_settings_fonts_button_text_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_button_text_desktop_font_style" "enum_site_settings_fonts_button_text_desktop_font_style";
     
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_font_family" "enum_site_settings_fonts_all_posts_link_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_mobile_font_weight" "enum_site_settings_fonts_all_posts_link_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_mobile_font_style" "enum_site_settings_fonts_all_posts_link_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_desktop_font_weight" "enum_site_settings_fonts_all_posts_link_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_all_posts_link_desktop_font_style" "enum_site_settings_fonts_all_posts_link_desktop_font_style";
     
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_font_family" "enum_site_settings_fonts_card_category_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_mobile_font_weight" "enum_site_settings_fonts_card_category_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_mobile_font_style" "enum_site_settings_fonts_card_category_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_desktop_font_weight" "enum_site_settings_fonts_card_category_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_category_desktop_font_style" "enum_site_settings_fonts_card_category_desktop_font_style";
     
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_font_family" "enum_site_settings_fonts_card_text_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_mobile_font_weight" "enum_site_settings_fonts_card_text_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_mobile_font_style" "enum_site_settings_fonts_card_text_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_desktop_font_weight" "enum_site_settings_fonts_card_text_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_card_text_desktop_font_style" "enum_site_settings_fonts_card_text_desktop_font_style";
     
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_font_family" "enum_site_settings_fonts_footer_menu_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_mobile_font_weight" "enum_site_settings_fonts_footer_menu_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_mobile_font_style" "enum_site_settings_fonts_footer_menu_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_desktop_font_weight" "enum_site_settings_fonts_footer_menu_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_menu_desktop_font_style" "enum_site_settings_fonts_footer_menu_desktop_font_style";
     
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_font_family" "enum_site_settings_fonts_footer_text_font_family";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_mobile_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_mobile_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_mobile_font_weight" "enum_site_settings_fonts_footer_text_mobile_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_mobile_font_style" "enum_site_settings_fonts_footer_text_mobile_font_style";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_desktop_font_size" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_desktop_line_height" varchar;
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_desktop_font_weight" "enum_site_settings_fonts_footer_text_desktop_font_weight";
     ALTER TABLE "site_settings" ADD COLUMN IF NOT EXISTS "fonts_footer_text_desktop_font_style" "enum_site_settings_fonts_footer_text_desktop_font_style";
   EXCEPTION
     WHEN undefined_table THEN null;
   END $$;`)

  // Set DEFAULT values (fast operation, only updates metadata)
  await db.execute(sql`
   DO $$ BEGIN
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_button_text_desktop_font_style" SET DEFAULT 'normal';
     
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_all_posts_link_desktop_font_style" SET DEFAULT 'normal';
     
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_category_desktop_font_style" SET DEFAULT 'normal';
     
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_card_text_desktop_font_style" SET DEFAULT 'normal';
     
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_menu_desktop_font_style" SET DEFAULT 'normal';
     
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_font_family" SET DEFAULT 'roboto';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_mobile_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_mobile_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_mobile_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_mobile_font_style" SET DEFAULT 'normal';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_desktop_font_size" SET DEFAULT '16px';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_desktop_line_height" SET DEFAULT '1.5';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_desktop_font_weight" SET DEFAULT '400';
     ALTER TABLE "site_settings" ALTER COLUMN "fonts_footer_text_desktop_font_style" SET DEFAULT 'normal';
   EXCEPTION
     WHEN undefined_table THEN null;
   END $$;`)

  // Update existing rows with default values (only 1 row, so very fast)
  await db.execute(sql`
   UPDATE "site_settings" SET
     "fonts_button_text_font_family" = COALESCE("fonts_button_text_font_family", 'roboto'),
     "fonts_button_text_mobile_font_size" = COALESCE("fonts_button_text_mobile_font_size", '16px'),
     "fonts_button_text_mobile_line_height" = COALESCE("fonts_button_text_mobile_line_height", '1.5'),
     "fonts_button_text_mobile_font_weight" = COALESCE("fonts_button_text_mobile_font_weight", '400'),
     "fonts_button_text_mobile_font_style" = COALESCE("fonts_button_text_mobile_font_style", 'normal'),
     "fonts_button_text_desktop_font_size" = COALESCE("fonts_button_text_desktop_font_size", '16px'),
     "fonts_button_text_desktop_line_height" = COALESCE("fonts_button_text_desktop_line_height", '1.5'),
     "fonts_button_text_desktop_font_weight" = COALESCE("fonts_button_text_desktop_font_weight", '400'),
     "fonts_button_text_desktop_font_style" = COALESCE("fonts_button_text_desktop_font_style", 'normal'),
     "fonts_all_posts_link_font_family" = COALESCE("fonts_all_posts_link_font_family", 'roboto'),
     "fonts_all_posts_link_mobile_font_size" = COALESCE("fonts_all_posts_link_mobile_font_size", '16px'),
     "fonts_all_posts_link_mobile_line_height" = COALESCE("fonts_all_posts_link_mobile_line_height", '1.5'),
     "fonts_all_posts_link_mobile_font_weight" = COALESCE("fonts_all_posts_link_mobile_font_weight", '400'),
     "fonts_all_posts_link_mobile_font_style" = COALESCE("fonts_all_posts_link_mobile_font_style", 'normal'),
     "fonts_all_posts_link_desktop_font_size" = COALESCE("fonts_all_posts_link_desktop_font_size", '16px'),
     "fonts_all_posts_link_desktop_line_height" = COALESCE("fonts_all_posts_link_desktop_line_height", '1.5'),
     "fonts_all_posts_link_desktop_font_weight" = COALESCE("fonts_all_posts_link_desktop_font_weight", '400'),
     "fonts_all_posts_link_desktop_font_style" = COALESCE("fonts_all_posts_link_desktop_font_style", 'normal'),
     "fonts_card_category_font_family" = COALESCE("fonts_card_category_font_family", 'roboto'),
     "fonts_card_category_mobile_font_size" = COALESCE("fonts_card_category_mobile_font_size", '16px'),
     "fonts_card_category_mobile_line_height" = COALESCE("fonts_card_category_mobile_line_height", '1.5'),
     "fonts_card_category_mobile_font_weight" = COALESCE("fonts_card_category_mobile_font_weight", '400'),
     "fonts_card_category_mobile_font_style" = COALESCE("fonts_card_category_mobile_font_style", 'normal'),
     "fonts_card_category_desktop_font_size" = COALESCE("fonts_card_category_desktop_font_size", '16px'),
     "fonts_card_category_desktop_line_height" = COALESCE("fonts_card_category_desktop_line_height", '1.5'),
     "fonts_card_category_desktop_font_weight" = COALESCE("fonts_card_category_desktop_font_weight", '400'),
     "fonts_card_category_desktop_font_style" = COALESCE("fonts_card_category_desktop_font_style", 'normal'),
     "fonts_card_text_font_family" = COALESCE("fonts_card_text_font_family", 'roboto'),
     "fonts_card_text_mobile_font_size" = COALESCE("fonts_card_text_mobile_font_size", '16px'),
     "fonts_card_text_mobile_line_height" = COALESCE("fonts_card_text_mobile_line_height", '1.5'),
     "fonts_card_text_mobile_font_weight" = COALESCE("fonts_card_text_mobile_font_weight", '400'),
     "fonts_card_text_mobile_font_style" = COALESCE("fonts_card_text_mobile_font_style", 'normal'),
     "fonts_card_text_desktop_font_size" = COALESCE("fonts_card_text_desktop_font_size", '16px'),
     "fonts_card_text_desktop_line_height" = COALESCE("fonts_card_text_desktop_line_height", '1.5'),
     "fonts_card_text_desktop_font_weight" = COALESCE("fonts_card_text_desktop_font_weight", '400'),
     "fonts_card_text_desktop_font_style" = COALESCE("fonts_card_text_desktop_font_style", 'normal'),
     "fonts_footer_menu_font_family" = COALESCE("fonts_footer_menu_font_family", 'roboto'),
     "fonts_footer_menu_mobile_font_size" = COALESCE("fonts_footer_menu_mobile_font_size", '16px'),
     "fonts_footer_menu_mobile_line_height" = COALESCE("fonts_footer_menu_mobile_line_height", '1.5'),
     "fonts_footer_menu_mobile_font_weight" = COALESCE("fonts_footer_menu_mobile_font_weight", '400'),
     "fonts_footer_menu_mobile_font_style" = COALESCE("fonts_footer_menu_mobile_font_style", 'normal'),
     "fonts_footer_menu_desktop_font_size" = COALESCE("fonts_footer_menu_desktop_font_size", '16px'),
     "fonts_footer_menu_desktop_line_height" = COALESCE("fonts_footer_menu_desktop_line_height", '1.5'),
     "fonts_footer_menu_desktop_font_weight" = COALESCE("fonts_footer_menu_desktop_font_weight", '400'),
     "fonts_footer_menu_desktop_font_style" = COALESCE("fonts_footer_menu_desktop_font_style", 'normal'),
     "fonts_footer_text_font_family" = COALESCE("fonts_footer_text_font_family", 'roboto'),
     "fonts_footer_text_mobile_font_size" = COALESCE("fonts_footer_text_mobile_font_size", '16px'),
     "fonts_footer_text_mobile_line_height" = COALESCE("fonts_footer_text_mobile_line_height", '1.5'),
     "fonts_footer_text_mobile_font_weight" = COALESCE("fonts_footer_text_mobile_font_weight", '400'),
     "fonts_footer_text_mobile_font_style" = COALESCE("fonts_footer_text_mobile_font_style", 'normal'),
     "fonts_footer_text_desktop_font_size" = COALESCE("fonts_footer_text_desktop_font_size", '16px'),
     "fonts_footer_text_desktop_line_height" = COALESCE("fonts_footer_text_desktop_line_height", '1.5'),
     "fonts_footer_text_desktop_font_weight" = COALESCE("fonts_footer_text_desktop_font_weight", '400'),
     "fonts_footer_text_desktop_font_style" = COALESCE("fonts_footer_text_desktop_font_style", 'normal');`)

  // Update enum for font_family types to include 'lobster' if they exist
  await db.execute(sql`
   DO $$ BEGIN
     ALTER TYPE "public"."enum_site_settings_fonts_body_font_family" ADD VALUE IF NOT EXISTS 'lobster';
     ALTER TYPE "public"."enum_site_settings_fonts_h1_font_family" ADD VALUE IF NOT EXISTS 'lobster';
     ALTER TYPE "public"."enum_site_settings_fonts_post_text_font_family" ADD VALUE IF NOT EXISTS 'lobster';
   EXCEPTION
     WHEN undefined_object THEN null;
   END $$;`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  // Remove columns
  await db.execute(sql`
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_button_text_desktop_font_style";
   
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_all_posts_link_desktop_font_style";
   
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_category_desktop_font_style";
   
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_card_text_desktop_font_style";
   
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_menu_desktop_font_style";
   
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_font_family";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_mobile_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_mobile_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_mobile_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_mobile_font_style";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_desktop_font_size";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_desktop_line_height";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_desktop_font_weight";
   ALTER TABLE "site_settings" DROP COLUMN IF EXISTS "fonts_footer_text_desktop_font_style";`)
}
