import { Schema, model } from 'mongoose';
import { slugify } from '../utils/string.utils.js';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  slug: {
    type: String,
    index: true,
    unique: true
  },
  image: String
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name);
  next();
});

export default model('Category', categorySchema);
