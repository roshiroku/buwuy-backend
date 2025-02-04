import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export async function auth(req, res, next) {
  let token;

  // Check for token in headers
  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) return next();

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findById(decoded._id).select('-password');
    next();
  } catch (err) {
    console.error(err.message);
    res.status(400).json({ message: 'Authentication failed' });
  }
}

export async function protect(req, res, next) {
  try {
    await auth(req, res, () => { });

    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized, no token' });
    }

    next();
  } catch (err) {
    console.error(err.message);
    res.status(401).json({ message: 'Not authorized, token failed' });
  }
}

// Role-based access
export function authorize(...roles) {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: `User role '${req.user.role}' is not authorized` });
    }
    next();
  };
}
