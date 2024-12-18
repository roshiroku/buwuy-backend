import { Schema, isValidObjectId, model } from 'mongoose';
import Category from './Category.js';
import Tag from './Tag.js';
import { slugifyProp } from '../utils/schema.utils.js';

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
    unique: true,
    required: true
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
    type: String,
    ref: 'Category',
    index: true
  },
  tags: [{
    type: String,
    ref: 'Tag'
  }]
}, { timestamps: true });

slugifyProp(productSchema);

productSchema.pre('insertMany', async function (next, docs) {
  const categories = await Category.find();
  const tags = await Tag.find();

  for (const doc of docs) {
    doc.category = categories.find(({ _id, slug }) => {
      return _id === doc.category || slug === doc.category;
    })._id;

    doc.tags = doc.tags.map((tag) => {
      const { _id } = tags.find((other) => other._id === tag || other.slug === tag);
      return _id;
    });
  }
});

productSchema.pre('save', async function () {
  if (this.isModified('category') && !isValidObjectId(this.category)) {
    const category = await Category.findOne({ slug: this.category });
    this.category = category._id;
  }

  if (this.isModified('tags') && this.tags.length && this.tags.some((tag) => !isValidObjectId(tag))) {
    const tags = [];
    for (const tag of this.tags) {
      if (isValidObjectId(tag)) {
        tags.push(tag);
      } else {
        const { _id } = await Tag.findOne({ slug: tag });
        tags.push(_id);
      }
    }
    this.tags = tags;
  }
});

export default model('Product', productSchema);
