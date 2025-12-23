-- Run this SQL command to delete the old site-settings record
-- This will allow Payload to create a new one with the correct structure

DELETE FROM site_settings WHERE "globalType" = 'site-settings';

-- After running this, restart the server and access /admin/globals/site-settings
-- Payload will automatically create a new record with the correct structure

