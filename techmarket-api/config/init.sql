DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS categories;

CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT
);

CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT NOT NULL CHECK (length(description) <= 10000),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category_id INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_category FOREIGN KEY (category_id)
      REFERENCES categories(id) ON DELETE SET NULL
);

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE CHECK (username <> ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    product_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    comment TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-------------------------------------------------------------
-- Inicjalne dane
-------------------------------------------------------------

INSERT INTO categories (name, description) VALUES
  ('Komputery', 'Laptopy, komputery stacjonarne i akcesoria komputerowe'),
  ('Smartfony', 'Telefony komórkowe i smartfony różnych marek'),
  ('Słuchawki', 'Słuchawki przewodowe i bezprzewodowe'),
  ('Tablety', 'Tablety i czytniki e-booków'),
  ('Akcesoria', 'Różne akcesoria elektroniczne')
ON CONFLICT (name) DO NOTHING;

INSERT INTO products (name, description, price, stock_quantity, category_id, created_at) VALUES
  ('MacBook Pro 16', 'Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD', 9999.99, 15,
    (SELECT id FROM categories WHERE name = 'Komputery'), '2023-01-15 14:30:00'),
  ('Dell XPS 13', 'Ultrabook Dell z ekranem 13 cali, 8GB RAM, 256GB SSD', 3499.99, 10,
    (SELECT id FROM categories WHERE name = 'Komputery'), '2023-02-10 09:00:00'),
  ('iPhone 13', 'Smartfon Apple iPhone 13 z 128GB pamięci, podwójnym aparatem', 4299.99, 20,
    (SELECT id FROM categories WHERE name = 'Smartfony'), '2023-03-05 12:30:00'),
  ('iPhone 14', 'Smartfon Apple iPhone 14 z 128GB pamięci, podwójnym aparatem', 4599.99, 20,
    (SELECT id FROM categories WHERE name = 'Smartfony'), '2023-03-05 12:34:00'),
  ('Sony EarBuds Wireless', 'Bezprzewodowe słuchawki Sony z aktywną redukcją szumów', 699.99, 3,
    (SELECT id FROM categories WHERE name = 'Słuchawki'), '2025-03-06 13:40:29.085')
ON CONFLICT (name) DO NOTHING;

INSERT INTO users (username, email, password_hash, first_name, last_name) VALUES
  ('admin', 'admin@techmarket.com', '$2a$10$xVQZqS5K0NmJbpj3AYWoYuF7HV8lyPx1F0yBgI5bjvKhvwD2jLVJq', 'Admin', 'System'),
  ('jankowalski', 'jan.kowalski@example.com', '$2a$10$zH1bUFJ.MhPJANRyjsh0suHz6h.7TiT.yuWMveQjeCQY75Sx/TqEi', 'Jan', 'Kowalski'),
  ('annanowak', 'anna.nowak@example.com', '$2a$10$1qAz2wSx3eCO7Tr5nD8Xhee4uFtgGTfG1slNUZX.aqlsmsRVPDBPe', 'Anna', 'Nowak')
ON CONFLICT (username) DO NOTHING;

INSERT INTO reviews (product_id, user_id, rating, comment) VALUES
  ((SELECT id FROM products WHERE name = 'MacBook Pro 16'),
    (SELECT id FROM users WHERE username = 'jankowalski'), 5, 'Świetny laptop, bardzo wydajny i elegancki.'),
  ((SELECT id FROM products WHERE name = 'MacBook Pro 16'),
    (SELECT id FROM users WHERE username = 'annanowak'), 4, 'Dobry sprzęt, ale trochę za drogi.'),
  ((SELECT id FROM products WHERE name = 'Dell XPS 13'),
    (SELECT id FROM users WHERE username = 'jankowalski'), 5, 'Idealny ultrabook do pracy.'),
  ((SELECT id FROM products WHERE name = 'iPhone 13'),
    (SELECT id FROM users WHERE username = 'annanowak'), 3, 'Przeciętny telefon, spodziewałam się więcej po tej cenie.')
ON CONFLICT DO NOTHING;
