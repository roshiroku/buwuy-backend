import { Schema, model } from 'mongoose';
import { slugify } from '../utils/string.utils.js';

const imageSchema = new Schema({
  src: {
    type: String,
    required: true
  },
  alt: String,
  description: String
}, { _id: false });

const variantSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  description: String,
  images: [imageSchema],
  price: Number,
  stock: Number
}, { _id: false });

const productSchema = new Schema({
  name: {
    type: String,
    unique: true,
    required: true
  },
  slug: {
    type: String,
    index: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  images: [imageSchema],
  price: {
    type: Number,
    required: true
  },
  stock: {
    type: Number,
    default: 0
  },
  variants: [variantSchema],
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
    index: true
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag'
  }]
}, { timestamps: true });

productSchema.pre('save', function (next) {
  if (!this.isModified('name')) return next();
  this.slug = slugify(this.name);
  next();
});

export default model('Product', productSchema);
