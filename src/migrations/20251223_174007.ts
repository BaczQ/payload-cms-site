import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_site_settings_fonts_header_menu_font_family" AS ENUM('roboto', 'gloock', 'antonio', 'manufacturing-consent', 'noto-sans-display', 'roboto-flex', 'roboto-condensed', 'tinos', 'lobster', 'system-ui', 'sans-serif');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_style" AS ENUM('normal', 'italic', 'oblique');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_weight" AS ENUM('100', '200', '300', '400', '500', '600', '700', '800', '900');
  CREATE TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_style" AS ENUM('normal', 'italic', 'oblique');
  ALTER TYPE "public"."enum_site_settings_fonts_selected_element" ADD VALUE 'headerMenu';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_font_family" "enum_site_settings_fonts_header_menu_font_family" DEFAULT 'roboto';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_weight" "enum_site_settings_fonts_header_menu_mobile_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_mobile_font_style" "enum_site_settings_fonts_header_menu_mobile_font_style" DEFAULT 'normal';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_size" varchar DEFAULT '16px';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_line_height" varchar DEFAULT '1.5';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_weight" "enum_site_settings_fonts_header_menu_desktop_font_weight" DEFAULT '400';
  ALTER TABLE "site_settings" ADD COLUMN "fonts_header_menu_desktop_font_style" "enum_site_settings_fonts_header_menu_desktop_font_style" DEFAULT 'normal';`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "site_settings" ALTER COLUMN "fonts_selected_element" SET DATA TYPE text;
  ALTER TABLE "site_settings" ALTER COLUMN "fonts_selected_element" SET DEFAULT 'body'::text;
  DROP TYPE "public"."enum_site_settings_fonts_selected_element";
  CREATE TYPE "public"."enum_site_settings_fonts_selected_element" AS ENUM('body', 'h1', 'postText', 'buttonText', 'allPostsLink', 'cardCategory', 'cardText', 'footerMenu', 'footerText');
  ALTER TABLE "site_settings" ALTER COLUMN "fonts_selected_element" SET DEFAULT 'body'::"public"."enum_site_settings_fonts_selected_element";
  ALTER TABLE "site_settings" ALTER COLUMN "fonts_selected_element" SET DATA TYPE "public"."enum_site_settings_fonts_selected_element" USING "fonts_selected_element"::"public"."enum_site_settings_fonts_selected_element";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_font_family";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_size";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_line_height";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_weight";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_mobile_font_style";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_size";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_line_height";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_weight";
  ALTER TABLE "site_settings" DROP COLUMN "fonts_header_menu_desktop_font_style";
  DROP TYPE "public"."enum_site_settings_fonts_header_menu_font_family";
  DROP TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_weight";
  DROP TYPE "public"."enum_site_settings_fonts_header_menu_mobile_font_style";
  DROP TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_weight";
  DROP TYPE "public"."enum_site_settings_fonts_header_menu_desktop_font_style";`)
}
