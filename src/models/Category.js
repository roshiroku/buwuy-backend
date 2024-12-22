import { Schema, model } from 'mongoose';
import { fileProp, slugifyProp } from '../utils/schema.utils.js';

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
  description: {
    type: String,
    required: true
  },
  image: String
}, { timestamps: true });

slugifyProp(categorySchema);
fileProp(categorySchema);

export default model('Category', categorySchema);
