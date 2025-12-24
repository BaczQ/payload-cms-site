import * as migration_20250220_120000_add_libre_franklin_font from './20250220_120000_add_libre_franklin_font';
import * as migration_20251218_112446 from './20251218_112446';
import * as migration_20251218_184504 from './20251218_184504';
import * as migration_20251220_071335_add_news_posts_block from './20251220_071335_add_news_posts_block';
import * as migration_20251223_162014_update_font_settings from './20251223_162014_update_font_settings';
import * as migration_20251223_174007 from './20251223_174007';
import * as migration_20251224_015519_add_avatar_to_users from './20251224_015519_add_avatar_to_users';

export const migrations = [
  {
    up: migration_20250220_120000_add_libre_franklin_font.up,
    down: migration_20250220_120000_add_libre_franklin_font.down,
    name: '20250220_120000_add_libre_franklin_font',
  },
  {
    up: migration_20251218_112446.up,
    down: migration_20251218_112446.down,
    name: '20251218_112446',
  },
  {
    up: migration_20251218_184504.up,
    down: migration_20251218_184504.down,
    name: '20251218_184504',
  },
  {
    up: migration_20251220_071335_add_news_posts_block.up,
    down: migration_20251220_071335_add_news_posts_block.down,
    name: '20251220_071335_add_news_posts_block',
  },
  {
    up: migration_20251223_162014_update_font_settings.up,
    down: migration_20251223_162014_update_font_settings.down,
    name: '20251223_162014_update_font_settings',
  },
  {
    up: migration_20251223_174007.up,
    down: migration_20251223_174007.down,
    name: '20251223_174007',
  },
  {
    up: migration_20251224_015519_add_avatar_to_users.up,
    down: migration_20251224_015519_add_avatar_to_users.down,
    name: '20251224_015519_add_avatar_to_users'
  },
];
