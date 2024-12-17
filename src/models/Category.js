import { Schema, model } from 'mongoose';
import { slugifyProp } from '../utils/schema.utils.js';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  image: String
}, { timestamps: true });

slugifyProp(categorySchema);

export default model('Category', categorySchema);
