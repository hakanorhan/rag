CREATE INDEX idx_reservation_user_pickup_id
    ON reservation(user_id, pickup_at DESC, id DESC);
