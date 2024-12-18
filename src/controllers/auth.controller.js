import jwt from 'jsonwebtoken';
import { omit, pick } from '../utils/object.utils.js';
import User from '../models/User.js';

// Generate JWT
const generateToken = (input, expiresIn = '30d') => {
  return jwt.sign(input, process.env.JWT_SECRET, { expiresIn });
};

// Register User
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    
    const duplicate = await User.find({ email });
    if (duplicate) return res.status(400).json({ message: 'Duplicate email' });

    const user = await User.create({ name, email, password });
    const token = generateToken(pick(user, '_id', 'role', 'avatar'));

    res.status(201).json({ ...omit(user.toObject(), 'password'), token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Login User
export async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    const token = generateToken(pick(user, '_id', 'role', 'avatar'));

    res.json({ ...omit(user.toObject(), 'password'), token });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
