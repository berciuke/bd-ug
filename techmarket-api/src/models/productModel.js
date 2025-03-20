  const pool = require('../../config/db');

const Product = {
  getAll: async (filters = {}) => {
    let query = 'SELECT * FROM products';
    const params = [];
    const conditions = [];

    if (filters.available === 'true') {
      conditions.push('stock_quantity > 0');
    } else if (filters.available === 'false') {
      conditions.push('stock_quantity = 0');
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (filters.sort === 'price_asc') {
      query += ' ORDER BY price ASC';
    } else if (filters.sort === 'price_desc') {
      query += ' ORDER BY price DESC';
    } else {
      query += ' ORDER BY id ASC';
    }

    const { rows } = await pool.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    return rows[0];
  },

  create: async (productData) => {
    const { name, description, price, stock_quantity, category } = productData;
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity, category) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock_quantity || 0, category]
    );
    return rows[0];
  },

  update: async (id, productData) => {
    const { rows } = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
    if (rows.length === 0) {
      return null;
    }

    const currentProduct = rows[0];
    const updates = { ...currentProduct, ...productData, updated_at: new Date() };
    
    const { rows: updatedRows } = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category = $5, updated_at = $6 WHERE id = $7 RETURNING *',
      [updates.name, updates.description, updates.price, updates.stock_quantity, updates.category, updates.updated_at, id]
    );
    
    return updatedRows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Product;
