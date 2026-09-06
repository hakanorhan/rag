UPDATE cars
SET image_url = '/images/rentcars/audi-A5-cabrio.png'
WHERE brand = 'Audi' AND model = 'A5';

INSERT INTO cars (brand, model, car_type_id, location_id, license_plate, image_url, status)
VALUES
    (
        'Dacia', 'Bigster',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-BG-1001', '/images/rentcars/dacia-bigster.png', 'AVAILABLE'
    ),
    (
        'Hyundai', 'Ioniq 5',
        (SELECT id FROM car_type WHERE name = 'Premium'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HY-1001', '/images/rentcars/hyundai-ioniq5.png', 'AVAILABLE'
    ),
    (
        'Škoda', 'Kodiaq',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Köln' LIMIT 1),
        'K-SK-1001', '/images/rentcars/skoda-kodiaq.png', 'AVAILABLE'
    ),
    (
        'Volkswagen', 'Polo',
        (SELECT id FROM car_type WHERE name = 'Economy'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-VW-1001', '/images/rentcars/vw-polo.png', 'AVAILABLE'
    ),
    (
        'Volkswagen', 'Tayron',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-VW-1002', '/images/rentcars/vw-tayron.png', 'AVAILABLE'
    );
