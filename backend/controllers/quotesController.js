const { db } = require('../config/database');

exports.createQuote = (req, res) => {
  const {
    customer_name,
    phone,
    product_or_service,
    category_type,
    quantity,
    unit,
    pickup_location,
    delivery_location,
    material_type,
    vehicle_required,
    required_date,
    message
  } = req.body;

  // Validation
  if (!customer_name || !phone || !product_or_service) {
    return res.status(400).json({ error: 'Customer Name, Phone number, and Item / Service name are required.' });
  }

  const sql = `
    INSERT INTO quote_requests (
      customer_name, phone, product_or_service, category_type, quantity, unit,
      pickup_location, delivery_location, material_type, vehicle_required,
      required_date, message, status
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending')
  `;

  const params = [
    customer_name,
    phone,
    product_or_service,
    category_type || 'General',
    quantity || null,
    unit || '',
    pickup_location || '',
    delivery_location || '',
    material_type || '',
    vehicle_required || '',
    required_date || '',
    message || ''
  ];

  db.run(sql, params, function (err) {
    if (err) {
      console.error('Error inserting quote request:', err.message);
      return res.status(500).json({ error: 'Failed to submit quote request. Please try again.' });
    }

    res.status(201).json({
      success: true,
      quote_id: this.lastID,
      message: 'Your quote request has been submitted successfully! Our team will contact you shortly.'
    });
  });
};

exports.getQuotes = (req, res) => {
  const { status } = req.query;
  let sql = `SELECT * FROM quote_requests WHERE 1=1`;
  const params = [];

  if (status && status !== 'all') {
    sql += ` AND status = ?`;
    params.push(status);
  }

  sql += ` ORDER BY created_at DESC`;

  db.all(sql, params, (err, rows) => {
    if (err) {
      console.error('Error fetching quotes:', err.message);
      return res.status(500).json({ error: 'Failed to fetch quote requests' });
    }
    res.json({ success: true, data: rows });
  });
};

exports.updateQuoteStatus = (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const validStatuses = ['pending', 'in_review', 'quoted', 'completed', 'cancelled'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status value' });
  }

  const sql = `UPDATE quote_requests SET status = ? WHERE id = ?`;
  db.run(sql, [status, id], function (err) {
    if (err) {
      console.error('Error updating quote status:', err.message);
      return res.status(500).json({ error: 'Failed to update quote status' });
    }

    res.json({ success: true, message: `Quote status updated to ${status}` });
  });
};
