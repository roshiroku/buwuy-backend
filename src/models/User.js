import { Schema, model } from 'mongoose';
import { hashProp } from '../utils/schema.utils.js';

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  avatar: String
}, { timestamps: true });

hashProp(userSchema);

export default model('User', userSchema);
