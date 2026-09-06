CREATE TABLE IF NOT EXISTS rag_document (
    id UUID PRIMARY KEY,
    category VARCHAR(32) NOT NULL,
    filename VARCHAR(255) NOT NULL,
    content_type VARCHAR(64) NOT NULL DEFAULT 'application/pdf',
    pdf_data BYTEA NOT NULL,
    sha256 VARCHAR(64) NOT NULL UNIQUE,
    version INTEGER NOT NULL CHECK (version > 0),
    page_count INTEGER NOT NULL,
    chunk_count INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL,
    updated_at TIMESTAMPTZ NOT NULL
);
