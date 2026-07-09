// Self-validating session tokens (HMAC). No DB lookup needed to verify a token;
// the signature proves authenticity. Secrets from env (falls back to a dev key).
const crypto = require('crypto');

const SECRET = process.env.AUTH_SECRET || 'ayur-dev-secret-change-me';
const TTL_MS = 1000 * 60 * 60 * 24 * 7; // 7 days

function sign(payload) {
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const sig = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  return body + '.' + sig;
}

function verify(token) {
  if (!token || typeof token !== 'string') return null;
  const [body, sig] = token.split('.');
  if (!body || !sig) return null;
  const expected = crypto.createHmac('sha256', SECRET).update(body).digest('base64url');
  // constant-time compare
  const a = Buffer.from(sig), b = Buffer.from(expected);
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (!payload.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch (e) { return null; }
}

function createSession(role, refId, extra = {}) {
  const payload = { role, refId, exp: Date.now() + TTL_MS, ...extra };
  return sign(payload);
}

// Express middleware: attaches req.user from Authorization: Bearer <token>
function requireAuth(roles) {
  return (req, res, next) => {
    const h = req.headers.authorization || '';
    const token = h.startsWith('Bearer ') ? h.slice(7) : null;
    const user = verify(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    if (roles && !roles.includes(user.role)) return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  };
}

module.exports = { createSession, verify, requireAuth };
