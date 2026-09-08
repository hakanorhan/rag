-- Verhindert doppelte / überlappende Reservierungen
CREATE EXTENSION IF NOT EXISTS btree_gist;

ALTER TABLE reservation
ADD CONSTRAINT no_overlapping_car_reservations
EXCLUDE USING gist (
    car_id WITH =,
    tstzrange(pickup_at, return_at, '[)') WITH &&
)
WHERE (
    status IN ('RESERVED', 'ACTIVE')
);