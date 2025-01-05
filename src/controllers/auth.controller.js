import User from '../models/User.js';
import { omit, pick } from '../utils/object.utils.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';
import { generateToken } from '../utils/auth.utils.js';

// Register User
export async function register(req, res) {
  try {
    const { name, email, password } = req.body;
    const avatar = normalizeFilePath(req.file) ?? req.body.avatar;

    const duplicate = await User.findOne({ email });
    if (duplicate) {
      deleteFile(req.file);
      return res.status(400).json({ message: 'Duplicate email' });
    }

    const user = await User.create({ name, email, password, avatar });
    const token = generateToken(pick(user, '_id', 'role', 'avatar'));

    res.status(201).json({ ...omit(user.toObject(), 'password'), token });
  } catch (err) {
    deleteFile(req.file);
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

// Auth User
export async function auth(req, res) {
  try {
    res.status(201).json(omit(req.user, 'password'));
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update Profile
export async function updateProfile(req, res) {
  try {
    const { name, email, password, phone, address } = req.body;
    const avatar = normalizeFilePath(req.file) ?? req.body.avatar;
    const user = await User.findById(req.user._id);

    if (!user) {
      deleteFile(req.file);
      return res.status(404).json({ message: 'User not found' });
    }

    user.name = name ?? user.name;
    user.email = email ?? user.email;
    user.password = password ?? user.password;
    user.phone = phone ?? user.phone;
    user.avatar = avatar ?? user.avatar;
    user.address = address ?? user.address;

    await user.save();

    const token = generateToken(pick(user, '_id', 'role', 'avatar'));
    res.status(201).json({ ...omit(user.toObject(), 'password'), token });
  } catch (err) {
    deleteFile(req.file);
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
