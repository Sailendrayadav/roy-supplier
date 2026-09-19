const { db } = require('../config/database');

exports.getServices = (req, res) => {
  const { search } = req.query;
  let sql = `
    SELECT s.*, c.name as category_name 
    FROM services s 
    LEFT JOIN categories c ON s.category_id = c.id
    WHERE 1=1
  `;
  const params = [];

  if (search) {
    sql += ` AND (s.name LIKE ? OR s.description LIKE ? OR s.service_type LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  sql += ` ORDER BY s.id ASC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching services:', err.message);
      return res.status(500).json({ error: 'Failed to fetch services' });
    }
    res.json({ success: true, data: rows });
  });
};
