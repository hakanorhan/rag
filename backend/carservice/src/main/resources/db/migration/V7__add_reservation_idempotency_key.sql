ALTER TABLE reservation
    ADD COLUMN idempotency_key VARCHAR(255);

CREATE UNIQUE INDEX reservation_user_idempotency_key_idx
    ON reservation (user_id, idempotency_key)
    WHERE idempotency_key IS NOT NULL;
