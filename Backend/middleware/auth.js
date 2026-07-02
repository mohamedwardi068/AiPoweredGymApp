import jwt from 'jsonwebtoken';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token is required. Please log in.' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'super_secret_gymbot_jwt_token_key_12345!', (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Session expired or invalid token. Please log in again.' });
    }
    
    req.user = user;
    next();
  });
}
