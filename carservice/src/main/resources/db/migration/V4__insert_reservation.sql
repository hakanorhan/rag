INSERT INTO users (
    first_name,
    last_name,
    email,
    phone,
    driver_license_number
)
VALUES (
           'Max',
           'Mustermann',
           'max.mustermann@example.com',
           '+491701234567',
           'B123456789'
       );

INSERT INTO reservation (
    user_id,
    car_id,
    pickup_location_id,
    return_location_id,
    pickup_at,
    return_at,
    status,
    daily_rate,
    total_price
)
VALUES (
           (SELECT id
            FROM users
            WHERE email = 'max.mustermann@example.com'),

           (SELECT id FROM cars
            WHERE brand = 'Audi' AND model = 'A5'
               LIMIT 1),

       (SELECT id FROM location
           WHERE city = 'Düsseldorf'
           LIMIT 1),

       (SELECT id FROM location
           WHERE city = 'Düsseldorf'
           LIMIT 1),

    TIMESTAMPTZ '2026-09-02 12:30:00 Europe/Berlin',
    TIMESTAMPTZ '2026-09-09 10:00:00 Europe/Berlin',

    'RESERVED',
    69.90,
    489.30
);