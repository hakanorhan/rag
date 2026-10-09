UPDATE cars
SET image_url = '/optimized/rentcars/premium-cabrio.webp'
WHERE car_category = 'Premium Cabrio';

INSERT INTO cars (car_category, car_type_id, location_id, license_plate, image_url, status)
VALUES
    (
        'Family SUV',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-1001', '/optimized/rentcars/family-suv.webp', 'AVAILABLE'
    ),
    (
        'Luxury Gran Turismo',
        (SELECT id FROM car_type WHERE name = 'Electric Car'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HO-1001', '/optimized/rentcars/luxury-gran-turismo.webp', 'AVAILABLE'
    ),
    (
        'Performance Hatch',
        (SELECT id FROM car_type WHERE name = 'Performance'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-1011', '/optimized/rentcars/performance-hatch.webp', 'AVAILABLE'
    ),
    (
        'Premium SUV Coupe',
        (SELECT id FROM car_type WHERE name = 'Premium'),
        (SELECT id FROM location WHERE city = 'Köln' LIMIT 1),
        'K-HO-1002', '/optimized/rentcars/premium-suv-coupe.webp', 'AVAILABLE'
    ),
    (
        'Electric City Car',
        (SELECT id FROM car_type WHERE name = 'Economy'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HO-1098E', '/optimized/rentcars/electric-city-car.webp', 'AVAILABLE'
    ),
    (
        'Luxury Sports Coupe',
        (SELECT id FROM car_type WHERE name = 'Sports Car'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-3453', '/optimized/rentcars/luxury-sports-coupe.webp', 'AVAILABLE'
    ),
    (
        'Performance Compact',
        (SELECT id FROM car_type WHERE name = 'Sports Car'),
        (SELECT id FROM location WHERE city = 'Köln' LIMIT 1),
        'K-HO-3473', '/optimized/rentcars/performance-compact.webp', 'AVAILABLE'
    ),
    (
        'City Compact',
        (SELECT id FROM car_type WHERE name = 'Economy'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HO-7273E', '/optimized/rentcars/city-compact.webp', 'AVAILABLE'
    ),
    (
        'Urban Compact',
        (SELECT id FROM car_type WHERE name = 'Comfort'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-279', '/optimized/rentcars/urban-compact.webp', 'AVAILABLE'
    ),
    (
        'Large SUV',
        (SELECT id FROM car_type WHERE name = 'Premium'),
        (SELECT id FROM location WHERE city = 'Köln' LIMIT 1),
        'K-HO-1349', '/optimized/rentcars/large-suv.webp', 'AVAILABLE'
    ),
    (
        'Executive Sedan',
        (SELECT id FROM car_type WHERE name = 'Premium'),
        (SELECT id FROM location WHERE city = 'Essen' LIMIT 1),
        'E-HO-9999', '/optimized/rentcars/executive-sedan.webp', 'AVAILABLE'
    ),
    (
        'Premium Electric SUV',
        (SELECT id FROM car_type WHERE name = 'Premium'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-3333E', '/optimized/rentcars/premium-electric-suv.webp', 'AVAILABLE'
    ),
        (
        'Stretch Limousine',
        (SELECT id FROM car_type WHERE name = 'Luxury Car'),
        (SELECT id FROM location WHERE city = 'Düsseldorf' LIMIT 1),
        'D-HO-4071', '/optimized/rentcars/stretch-limousine.webp', 'AVAILABLE'
    );