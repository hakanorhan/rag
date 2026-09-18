INSERT INTO users (
    keycloak_id,
    email,
    phone,
    driver_license_number
)
VALUES (
           '9aa1989a-4b86-40f0-93cb-e7785853b7ac',
           'max.mustermann@example.com',
           '+491701234567',
           'B123456789'
       );

INSERT INTO users (
    keycloak_id,
    email,
    driver_license_number
)
VALUES (
           '3f89d314-1121-4537-a949-f0146ef8fdcd',
           'hakan@test.de',
           'DEV-3F89D314'
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
            WHERE car_category = 'Premium Cabrio'
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
    149.90,
    1049.30
);
