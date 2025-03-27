CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT NOT NULL CHECK (length(description) <= 10000),
    price DECIMAL(10, 2) NOT NULL,
    stock_quantity INTEGER NOT NULL DEFAULT 0,
    category VARCHAR(255) NOT NULL CHECK (category <> ''),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM products) THEN
    INSERT INTO products (id, name, description, price, stock_quantity, category, created_at) 
    VALUES
      (1, 'MacBook Pro 16', 'Laptop Apple z procesorem M1 Pro, 16GB RAM, 512GB SSD', 9999.99, 15, 'Komputery', '2023-01-15 14:30:00'),
      (2, 'Dell XPS 13', 'Ultrabook Dell z ekranem 13 cali, 8GB RAM, 256GB SSD', 3499.99, 10, 'Komputery', '2023-02-10 09:00:00'),
      (3, 'iPhone 13', 'Smartfon Apple iPhone 13 z 128GB pamięci, podwójnym aparatem', 4299.99, 20, 'Smartfony', '2023-03-05 12:30:00'),
      (4, 'iPhone 14', 'Smartfon Apple iPhone 14 z 128GB pamięci, podwójnym aparatem', 4599.99, 20, 'Smartfony', '2023-03-05 12:34:00'),
      (5, 'Sony EarBuds Wireless', 'Bezprzewodowe słuchawki Sony z aktywną redukcją szumów', 699.99, 3, 'Słuchawki', '2025-03-06 13:40:29.085');
      
    PERFORM setval('products_id_seq', (SELECT MAX(id) FROM products));
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS categories (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE CHECK (name <> ''),
    description TEXT
);

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE CHECK (username <> ''),
    email VARCHAR(255) NOT NULL UNIQUE CHECK (email <> ''),
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS reviews (
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

ALTER TABLE products ADD COLUMN IF NOT EXISTS category_id INTEGER;
ALTER TABLE products ADD CONSTRAINT fk_category FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM categories) THEN
    INSERT INTO categories (id, name, description) 
    VALUES
      (1, 'Komputery', 'Laptopy, komputery stacjonarne i akcesoria komputerowe'),
      (2, 'Smartfony', 'Telefony komórkowe i smartfony różnych marek'),
      (3, 'Słuchawki', 'Słuchawki przewodowe i bezprzewodowe'),
      (4, 'Tablety', 'Tablety i czytniki e-booków'),
      (5, 'Akcesoria', 'Różne akcesoria elektroniczne');
      
    PERFORM setval('categories_id_seq', (SELECT MAX(id) FROM categories));
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM users) THEN
    INSERT INTO users (id, username, email, password_hash, first_name, last_name) 
    VALUES
      (1, 'admin', 'admin@techmarket.com', '$2a$10$xVQZqS5K0NmJbpj3AYWoYuF7HV8lyPx1F0yBgI5bjvKhvwD2jLVJq', 'Admin', 'System'),
      (2, 'jankowalski', 'jan.kowalski@example.com', '$2a$10$zH1bUFJ.MhPJANRyjsh0suHz6h.7TiT.yuWMveQjeCQY75Sx/TqEi', 'Jan', 'Kowalski'),
      (3, 'annanowak', 'anna.nowak@example.com', '$2a$10$1qAz2wSx3eCO7Tr5nD8Xhee4uFtgGTfG1slNUZX.aqlsmsRVPDBPe', 'Anna', 'Nowak');
      
    PERFORM setval('users_id_seq', (SELECT MAX(id) FROM users));
  END IF;
END $$;

UPDATE products SET category_id = 1 WHERE category = 'Komputery' AND category_id IS NULL;
UPDATE products SET category_id = 2 WHERE category = 'Smartfony' AND category_id IS NULL;
UPDATE products SET category_id = 3 WHERE category = 'Słuchawki' AND category_id IS NULL;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM reviews) THEN
    INSERT INTO reviews (product_id, user_id, rating, comment) 
    VALUES
      (1, 2, 5, 'Świetny laptop, bardzo wydajny i elegancki.'),
      (1, 3, 4, 'Dobry sprzęt, ale trochę za drogi.'),
      (2, 2, 5, 'Idealny ultrabook do pracy.'),
      (3, 3, 3, 'Przeciętny telefon, spodziewałam się więcej po tej cenie.');
  END IF;
END $$;
