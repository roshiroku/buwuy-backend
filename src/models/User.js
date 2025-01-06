import { Schema, model } from 'mongoose';
import { fileProp, hashProp } from '../utils/schema.utils.js';
import { addressSchema } from './Order.js';

const userSchema = new Schema({
  name: { type: String, required: true, maxlength: 64 },
  email: { type: String, required: true, unique: true, maxlength: 64 },
  password: { type: String, required: true },
  phone: {
    type: String,
    validate: {
      validator: function (v) {
        return /^[-+()#0-9\s]*$/.test(v);
      },
      message: props => `${props.value} is not a valid phone number!`
    },
    maxlength: 32,
  },
  avatar: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^(\/uploads\/|https?:\/\/)[\w\-./]+(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid image path!`
    }
  },
  address: addressSchema,
  role: {
    type: String,
    enum: ['admin', 'moderator', 'user'],
    default: 'user',
  },
  settings: {
    theme: { mode: { type: String, enum: ['light', 'dark'], default: null } }
  }
}, { timestamps: true });

hashProp(userSchema);
fileProp(userSchema, 'avatar');

export default model('User', userSchema);
