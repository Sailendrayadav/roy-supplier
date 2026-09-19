const { db, hashPassword, verifyPassword } = require('../config/database');
const { generateToken } = require('../middleware/authMiddleware');

exports.register = (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists
    db.get(`SELECT id FROM users WHERE email = ?`, [normalizedEmail], (err, existing) => {
      if (err) {
        console.error('Error checking user existence:', err);
        return res.status(500).json({ error: 'Database error during registration.' });
      }

      if (existing) {
        return res.status(409).json({ error: 'An account with this email address already exists.' });
      }

      const { hash, salt } = hashPassword(password);
      const role = 'user';

      const insertSql = `
        INSERT INTO users (name, email, phone, password_hash, salt, role)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const params = [name.trim(), normalizedEmail, phone ? phone.trim() : '', hash, salt, role];

      db.run(insertSql, params, function (insertErr) {
        if (insertErr) {
          console.error('Error inserting new user:', insertErr);
          return res.status(500).json({ error: 'Failed to create user account.' });
        }

        const newUserId = this.lastID;
        const userObj = {
          id: newUserId,
          name: name.trim(),
          email: normalizedEmail,
          phone: phone ? phone.trim() : '',
          role
        };

        const token = generateToken(userObj);

        res.status(201).json({
          success: true,
          message: 'Account created successfully!',
          token,
          user: userObj
        });
      });
    });
  } catch (err) {
    console.error('Register exception:', err);
    res.status(500).json({ error: 'Unexpected error during registration.' });
  }
};

exports.login = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Please enter both email and password.' });
    }

    const normalizedEmail = email.toLowerCase().trim();

    db.get(`SELECT * FROM users WHERE email = ?`, [normalizedEmail], (err, user) => {
      if (err) {
        console.error('Error querying user for login:', err);
        return res.status(500).json({ error: 'Database error during authentication.' });
      }

      if (!user) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const isValidPassword = verifyPassword(password, user.salt, user.password_hash);
      if (!isValidPassword) {
        return res.status(401).json({ error: 'Invalid email or password.' });
      }

      const userObj = {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone || '',
        role: user.role || 'user'
      };

      const token = generateToken(userObj);

      res.json({
        success: true,
        message: 'Login successful!',
        token,
        user: userObj
      });
    });
  } catch (err) {
    console.error('Login exception:', err);
    res.status(500).json({ error: 'Unexpected error during login.' });
  }
};

exports.getMe = (req, res) => {
  try {
    const userId = req.user.id;
    db.get(
      `SELECT id, name, email, phone, role, created_at FROM users WHERE id = ?`,
      [userId],
      (err, user) => {
        if (err || !user) {
          return res.status(404).json({ error: 'User profile not found.' });
        }
        res.json({ success: true, user });
      }
    );
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve profile.' });
  }
};
