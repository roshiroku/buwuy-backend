import { Schema, model } from 'mongoose';

const ProductSchema = new Schema({
  productType: {
    type: Schema.Types.ObjectId,
    ref: 'ProductType',
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  attributes: {
    type: Schema.Types.Mixed, // Flexible field for dynamic attributes
    required: true,
  },
  category: {
    type: Schema.Types.ObjectId,
    ref: 'Category',
  },
  tags: [{
    type: Schema.Types.ObjectId,
    ref: 'Tag',
  }],
  price: {
    type: Number,
    required: true,
  },
  stock: {
    type: Number,
    default: 0,
  },
}, { timestamps: true });

export default model('Product', ProductSchema);
