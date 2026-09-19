const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'rsy-supplier-secure-token-key-2026-auth';

function generateToken(payload, expiresInMs = 7 * 24 * 60 * 60 * 1000) {
  const exp = Date.now() + expiresInMs;
  const data = JSON.stringify({ ...payload, exp });
  const encodedData = Buffer.from(data).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(encodedData)
    .digest('base64url');
  return `${encodedData}.${signature}`;
}

function verifyTokenString(token) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [encodedData, signature] = parts;

  try {
    const expectedSignature = crypto
      .createHmac('sha256', JWT_SECRET)
      .update(encodedData)
      .digest('base64url');

    if (signature !== expectedSignature) return null;

    const decoded = JSON.parse(Buffer.from(encodedData, 'base64url').toString('utf8'));
    if (decoded.exp && Date.now() > decoded.exp) {
      return null;
    }
    return decoded;
  } catch (e) {
    return null;
  }
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Access denied. No token provided.' });
  }

  const token = authHeader.split(' ')[1];
  const decoded = verifyTokenString(token);
  if (!decoded) {
    return res.status(401).json({ error: 'Invalid or expired session. Please log in again.' });
  }

  req.user = decoded;
  next();
}

function requireAdmin(req, res, next) {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privileges required.' });
  }
  next();
}

module.exports = {
  generateToken,
  verifyTokenString,
  verifyToken,
  requireAdmin
};
