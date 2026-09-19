const { db } = require('../config/database');

exports.submitContact = (req, res) => {
  const { name, phone, email, message } = req.body;

  if (!name || !phone || !message) {
    return res.status(400).json({ error: 'Name, Phone, and Message are required' });
  }

  const sql = `INSERT INTO contacts (name, phone, email, message) VALUES (?, ?, ?, ?)`;
  const params = [name, phone, email || '', message];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error submitting contact form:', err.message);
      return res.status(500).json({ error: 'Failed to submit contact message' });
    }

    res.status(201).json({
      success: true,
      contact_id: this.lastID,
      message: 'Thank you! Your message has been received.'
    });
  });
};

exports.getContacts = (req, res) => {
  const sql = `SELECT * FROM contacts ORDER BY created_at DESC`;
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('Error fetching contacts:', err.message);
      return res.status(500).json({ error: 'Failed to fetch contact inquiries' });
    }
    res.json({ success: true, data: rows });
  });
};
