import * as migration_20251218_112446 from './20251218_112446';
import * as migration_20251218_184504 from './20251218_184504';

export const migrations = [
  {
    up: migration_20251218_112446.up,
    down: migration_20251218_112446.down,
    name: '20251218_112446',
  },
  {
    up: migration_20251218_184504.up,
    down: migration_20251218_184504.down,
    name: '20251218_184504'
  },
];
