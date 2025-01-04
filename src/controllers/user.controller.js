import User from '../models/User.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';
import { omit } from '../utils/object.utils.js';

// Create User
export async function createUser(req, res) {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const avatar = normalizeFilePath(req.file) ?? req.body.avatar;

    const duplicate = await User.findOne({ email });
    if (duplicate) {
      deleteFile(req.file);
      return res.status(400).json({ message: 'Duplicate email' });
    }

    const user = await User.create({ name, email, password, phone, avatar, address, role });

    res.status(201).json(omit(user.toObject(), 'password'));
  } catch (err) {
    deleteFile(req.file);
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Users
export async function getUsers(req, res) {
  try {
    const { skip, limit, sort, ...params } = req.query;

    const query = User.find(params).select('-password');

    if (sort) {
      const sortBy = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortDir = sort.startsWith('-') ? -1 : 1;
      query.sort({ [sortBy]: sortDir });
    }

    skip && query.skip(Number(skip));
    limit && query.limit(Number(limit));

    const users = await query;
    const count = await User.countDocuments(params);

    res.json({ results: users, count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Single User
export async function getUser(req, res) {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update User
export async function updateUser(req, res) {
  try {
    const { name, email, password, phone, address, role } = req.body;
    const avatar = normalizeFilePath(req.file) ?? req.body.avatar;
    const user = await User.findById(req.params.id);

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
    user.role = role ?? user.role;

    await user.save();
    res.json(omit(user.toObject(), 'password'));
  } catch (err) {
    deleteFile(req.file);
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
    res.json(omit(user.toObject(), 'password'));
  } catch (err) {
    deleteFile(req.file);
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Delete User
export async function deleteUser(req, res) {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.role === 'admin') {
      return res.status(403).json({ message: 'Admin users cannot be deleted' });
    }

    await User.findByIdAndDelete(req.params.id);

    res.json({ message: 'User removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
