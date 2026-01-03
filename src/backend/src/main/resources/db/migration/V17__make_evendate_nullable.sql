ALTER TABLE media_user_history
    ALTER COLUMN event_date DROP NOT NULL,
    ALTER COLUMN precision DROP NOT NULL;