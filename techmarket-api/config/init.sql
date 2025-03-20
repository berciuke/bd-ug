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