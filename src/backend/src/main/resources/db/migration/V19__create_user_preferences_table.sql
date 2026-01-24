CREATE TABLE user_preferences(
    user_id BIGINT PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
    prefs JSONB NOT NULL DEFAULT '{}'::JSONB,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_user_preferences_prefs_gin ON user_preferences USING gin (prefs);