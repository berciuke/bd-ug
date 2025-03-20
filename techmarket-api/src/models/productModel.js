const pool = require('../../config/db');

const Product = {
  getAll: async (filters = {}) => {
    let query = `
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
    `;
    
    const params = [];
    const conditions = [];

    if (filters.available === 'true') {
      conditions.push('p.stock_quantity > 0');
    } else if (filters.available === 'false') {
      conditions.push('p.stock_quantity = 0');
    }

    if (filters.category_id) {
      conditions.push('p.category_id = $' + (params.length + 1));
      params.push(filters.category_id);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    if (filters.sort === 'price_asc') {
      query += ' ORDER BY p.price ASC';
    } else if (filters.sort === 'price_desc') {
      query += ' ORDER BY p.price DESC';
    } else {
      query += ' ORDER BY p.id ASC';
    }

    const { rows } = await pool.query(query, params);
    return rows;
  },

  getById: async (id) => {
    const { rows } = await pool.query(`
      SELECT p.*, c.name as category_name, c.description as category_description
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.id
      WHERE p.id = $1
    `, [id]);
    
    if (rows.length === 0) return null;
    
    const reviewsQuery = await pool.query(`
      SELECT r.*, u.username as user_username
      FROM reviews r
      JOIN users u ON r.user_id = u.id
      WHERE r.product_id = $1
      ORDER BY r.created_at DESC
    `, [id]);
    
    const product = rows[0];
    product.reviews = reviewsQuery.rows;
    
    if (product.reviews.length > 0) {
      const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
      product.average_rating = totalRating / product.reviews.length;
    } else {
      product.average_rating = 0;
    }
    
    return product;
  },

  create: async (productData) => {
    const { name, description, price, stock_quantity, category_id } = productData;
    
    if (category_id) {
      const categoryCheck = await pool.query('SELECT 1 FROM categories WHERE id = $1', [category_id]);
      if (categoryCheck.rows.length === 0) {
        throw new Error('Kategoria nie została znaleziona');
      }
    }
    
    const { rows } = await pool.query(
      'INSERT INTO products (name, description, price, stock_quantity, category_id) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, description, price, stock_quantity || 0, category_id || null]
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
    
    if (productData.category_id) {
      const categoryCheck = await pool.query('SELECT 1 FROM categories WHERE id = $1', [productData.category_id]);
      if (categoryCheck.rows.length === 0) {
        throw new Error('Kategoria nie została znaleziona');
      }
    }
    
    const { rows: updatedRows } = await pool.query(
      'UPDATE products SET name = $1, description = $2, price = $3, stock_quantity = $4, category_id = $5, updated_at = $6 WHERE id = $7 RETURNING *',
      [updates.name, updates.description, updates.price, updates.stock_quantity, updates.category_id, updates.updated_at, id]
    );
    
    return updatedRows[0];
  },

  delete: async (id) => {
    const { rowCount } = await pool.query('DELETE FROM products WHERE id = $1', [id]);
    return rowCount > 0;
  }
};

module.exports = Product;
