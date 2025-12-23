-- Reset site-settings global to allow Payload to recreate it with new structure
-- Run this if you get "column does not exist" errors

DELETE FROM site_settings WHERE "globalType" = 'site-settings';

-- After running this, Payload will create a new record with the correct structure
-- when you access /admin/globals/site-settings

