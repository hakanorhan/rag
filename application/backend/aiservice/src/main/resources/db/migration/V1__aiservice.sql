CREATE TABLE IF NOT EXISTS rag_document (
    id UUID PRIMARY KEY,
    category VARCHAR(32) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(64) NOT NULL DEFAULT 'application/pdf',
    s3_key VARCHAR(512) NOT NULL,
    size_bytes BIGINT NOT NULL,
    sha256 VARCHAR(64) NOT NULL UNIQUE,
    version INTEGER NOT NULL CHECK (version > 0),
    page_count INTEGER NOT NULL,
    chunk_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS rag_interaction (
    id UUID PRIMARY KEY,
    user_message TEXT NOT NULL,
    assistant_answer TEXT NOT NULL,
    model VARCHAR(255) NOT NULL,
    response_time BIGINT NOT NULL CHECK (response_time >= 0),
    created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS rag_interaction_source (
    id UUID PRIMARY KEY,
    interaction_id UUID NOT NULL REFERENCES rag_interaction(id) ON DELETE CASCADE,
    document_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    page_number INTEGER NOT NULL,
    chunk_id VARCHAR(255) NOT NULL,
    similarity_score DOUBLE PRECISION
);

CREATE INDEX IF NOT EXISTS rag_interaction_source_interaction_idx
ON rag_interaction_source(interaction_id);
