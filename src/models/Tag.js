import { Schema, model } from 'mongoose';
import { slugifyProp } from '../utils/schema.utils.js';

const tagSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true
  }
}, { timestamps: true });

slugifyProp(tagSchema);

export default model('Tag', tagSchema);
