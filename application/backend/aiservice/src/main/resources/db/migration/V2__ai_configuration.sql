CREATE TABLE IF NOT EXISTS ai_configuration (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    provider VARCHAR(32) NOT NULL,
    base_url VARCHAR(512) NOT NULL,
    model VARCHAR(255) NOT NULL,
    api_key TEXT NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
