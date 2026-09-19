const { db } = require('../config/database');

exports.getProducts = (req, res) => {
  const { category, search, type } = req.query;
  let sql = `
    SELECT p.*, c.name as category_name, c.slug as category_slug 
    FROM products p 
    LEFT JOIN categories c ON p.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (category && category !== 'all') {
    sql += ` AND (c.slug = ? OR p.category_id = ?)`;
    params.push(category, category);
  }

  if (type) {
    sql += ` AND p.type = ?`;
    params.push(type);
  }

  if (search) {
    sql += ` AND (p.name LIKE ? OR p.name_np LIKE ? OR p.description LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  sql += ` ORDER BY p.id ASC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching products:', err.message);
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json({ success: true, data: rows });
  });
};

exports.addProduct = (req, res) => {
  const { category_id, name, name_np, description, image, unit, availability, price_range, type } = req.body;

  if (!name || !category_id) {
    return res.status(400).json({ error: 'Name and Category ID are required' });
  }

  const sql = `
    INSERT INTO products (category_id, name, name_np, description, image, unit, availability, price_range, type)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const params = [
    category_id,
    name,
    name_np || '',
    description || '',
    image || 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=800&q=80',
    unit || 'Unit',
    availability || 'In Stock',
    price_range || 'Contact for Price',
    type || 'material'
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error creating product:', err.message);
      return res.status(500).json({ error: 'Failed to create product' });
    }
    res.status(201).json({ success: true, id: this.lastID, message: 'Product created successfully' });
  });
};

exports.updateProductAvailability = (req, res) => {
  const { id } = req.params;
  const { availability } = req.body;

  if (!availability) {
    return res.status(400).json({ error: 'Availability state is required' });
  }

  const sql = `UPDATE products SET availability = ? WHERE id = ?`;
  db.run(sql, [availability, id], function (err) {
    if (err) {
      console.error('Error updating product availability:', err.message);
      return res.status(500).json({ error: 'Failed to update availability' });
    }
    res.json({ success: true, message: 'Product availability updated' });
  });
};
