import { Schema, model } from 'mongoose';
import { fileProp, hashProp } from '../utils/schema.utils.js';

const userSchema = new Schema({
  name: {
    first: {
      type: String,
      required: true
    },
    last: {
      type: String,
      required: true
    }
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
fileProp(userSchema, 'avatar');

export default model('User', userSchema);
