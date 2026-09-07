INSERT INTO car_type (
    name,
    description,
    daily_rate,
    minimum_age
)
VALUES
    ('Economy', 'Kleine und günstige Fahrzeuge', 49.90, 18),
    ('Comfort', 'Komfortable Mittelklassefahrzeuge', 69.90, 21),
    ('Premium', 'Hochwertige Premiumfahrzeuge', 89.90, 25),
    ('Sports Car', 'Leistungsstarke Sportwagen', 149.90, 25),
    ('Electric Car', 'Elektrisches Auto', 149.90, 25);
    

-- Mietstationen / Flottenstandorte
INSERT INTO location (
    name,
    address,
    postal_code,
    city,
    country
)
VALUES
    (
        'Düsseldorf',
        'Musterstraße 1',
        '40210',
        'Düsseldorf',
        'Germany'
    ),
    (
        'Essen',
        'Musterstraße 1',
        '45127',
        'Essen',
        'Germany'
    ),
    (
        'Köln',
        'Musterstraße 1',
        '50667',
        'Köln',
        'Germany'
    );


-- Erstes Auto
INSERT INTO cars (
    brand,
    model,
    car_type_id,
    location_id,
    license_plate,
    image_url,
    status
)
VALUES (
    'Audi',
    'A5',

    (SELECT id
     FROM car_type
     WHERE name = 'Sports Car'),

    (SELECT id
     FROM location
     WHERE city = 'Düsseldorf'
     LIMIT 1),

    'M-HO-5001',
    '/images/rentcars/audi-a5-cabrio.png',
    'AVAILABLE'
);