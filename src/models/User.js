import { Schema, model } from 'mongoose';
import { fileProp, hashProp } from '../utils/schema.utils.js';
import { addressSchema } from './Order.js';

const userSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  avatar: String,
  address: addressSchema,
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  }
}, { timestamps: true });

hashProp(userSchema);
fileProp(userSchema, 'avatar');

export default model('User', userSchema);
