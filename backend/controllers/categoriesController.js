const { db } = require('../config/database');

exports.getCategories = (req, res) => {
  const sql = `SELECT * FROM categories ORDER BY id ASC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching categories:', err.message);
      return res.status(500).json({ error: 'Failed to fetch categories' });
    }
    res.json({ success: true, data: rows });
  });
};
