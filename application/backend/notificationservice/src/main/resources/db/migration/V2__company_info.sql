CREATE TABLE company_info (
    id BIGINT PRIMARY KEY CHECK (id = 1),
    name VARCHAR(255) NOT NULL,
    street VARCHAR(255) NOT NULL,
    postal_code VARCHAR(20) NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    tax_number VARCHAR(50),
    vat_id VARCHAR(50),
    vat_rate NUMERIC(5, 4) NOT NULL CHECK (vat_rate >= 0 AND vat_rate < 1),
    CHECK (tax_number IS NOT NULL OR vat_id IS NOT NULL)
);

-- Ausschließlich Testdaten; vor produktivem Rechnungsversand ersetzen.
INSERT INTO company_info (id, name, street, postal_code, city, country, tax_number, vat_id, vat_rate)
VALUES (1, 'Firma invalid', 'Musterstraße 1', '40210', 'Düsseldorf', 'Deutschland',
        '123/4567/8901', 'DE123456789', 0.1900);
