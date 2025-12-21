import * as migration_20251218_112446 from './20251218_112446';
import * as migration_20251218_184504 from './20251218_184504';
import * as migration_20251220_071335_add_news_posts_block from './20251220_071335_add_news_posts_block';

export const migrations = [
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
    name: '20251220_071335_add_news_posts_block'
  },
];
