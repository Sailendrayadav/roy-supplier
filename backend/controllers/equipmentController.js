const { db } = require('../config/database');

exports.getEquipment = (req, res) => {
  const { search } = req.query;
  let sql = `SELECT * FROM equipment WHERE 1=1`;
  const params = [];

  if (search) {
    sql += ` AND (name LIKE ? OR description LIKE ? OR specs LIKE ?)`;
    const searchPattern = `%${search}%`;
    params.push(searchPattern, searchPattern, searchPattern);
  }

  sql += ` ORDER BY id ASC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching equipment:', err.message);
      return res.status(500).json({ error: 'Failed to fetch equipment' });
    }
    res.json({ success: true, data: rows });
  });
};
