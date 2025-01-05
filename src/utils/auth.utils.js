import jwt from 'jsonwebtoken';

// Generate JWT
export function generateToken(input, expiresIn = '30d') {
  return jwt.sign(input, process.env.JWT_SECRET, { expiresIn });
}
