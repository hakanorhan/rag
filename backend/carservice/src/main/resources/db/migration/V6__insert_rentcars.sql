UPDATE cars
SET image_url = '/optimized/rentcars/premium-cabrio.webp'
WHERE car_category = 'Premium Cabrio';

INSERT INTO cars (car_category, car_type_id, location_id, license_plate, image_url, status)
VALUES
    (
        'Family SUV',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-BG-1001', '/optimized/rentcars/family-suv.webp', 'AVAILABLE'
    ),
    (
        'Luxury Gran Turismo',
        (SELECT id FROM car_type WHERE name = 'Electric Car'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HY-1001', '/optimized/rentcars/luxury-gran-turismo.webp', 'AVAILABLE'
    ),
    (
        'Family SUV',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Köln' LIMIT 1),
        'K-SK-1001', '/optimized/rentcars/family-suv.webp', 'AVAILABLE'
    ),
    (
        'Performance Hatch',
        (SELECT id FROM car_type WHERE name = 'Economy'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-VW-1001', '/optimized/rentcars/performance-hatch.webp', 'AVAILABLE'
    ),
    (
        'Family SUV',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-VW-1002', '/optimized/rentcars/family-suv.webp', 'AVAILABLE'
    );
