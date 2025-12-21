import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_news_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Новости',
  	"category_slug" varchar DEFAULT 'news',
  	"limit" numeric DEFAULT 12,
  	"show_more_link" boolean DEFAULT true,
  	"more_link_text" varchar DEFAULT 'Все новости',
  	"more_link_url" varchar DEFAULT '/posts',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_news_posts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar DEFAULT 'Новости',
  	"category_slug" varchar DEFAULT 'news',
  	"limit" numeric DEFAULT 12,
  	"show_more_link" boolean DEFAULT true,
  	"more_link_text" varchar DEFAULT 'Все новости',
  	"more_link_url" varchar DEFAULT '/posts',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_news_posts" ADD CONSTRAINT "pages_blocks_news_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_news_posts" ADD CONSTRAINT "_pages_v_blocks_news_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_news_posts_order_idx" ON "pages_blocks_news_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_news_posts_parent_id_idx" ON "pages_blocks_news_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_news_posts_path_idx" ON "pages_blocks_news_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_news_posts_order_idx" ON "_pages_v_blocks_news_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_news_posts_parent_id_idx" ON "_pages_v_blocks_news_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_news_posts_path_idx" ON "_pages_v_blocks_news_posts" USING btree ("_path");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_news_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_news_posts" CASCADE;`)
}
