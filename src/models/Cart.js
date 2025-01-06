import { Schema, model } from 'mongoose';
import Product from './Product.js';

const cartSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    index: true,
    unique: true,
    required: true
  },
  items: {
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      amount: {
        type: Number,
        min: 1,
        required: true,
        default: 1
      }
    }],
    required: true,
    default: []
  }
}, { timestamps: true });

cartSchema.pre('save', function () {
  return normalizeCart(this);
});
cartSchema.pre('findOneAndUpdate', function () {
  return normalizeCart(this._update);
});

async function normalizeCart(doc) {
  const products = Object.fromEntries((await Product.find({
    _id: doc.items.map(({ product }) => product)
  })).map((product) => [product._id, product]));
  const cart = {};

  for (const { product: productId, amount } of doc.items) {
    const product = products[productId];

    if (cart[productId]) {
      cart[productId].amount += amount;
    } else {
      cart[productId] = { product: productId, amount };
    }

    if (cart[productId].amount < 1) {
      delete cart[productId];
    } else if (cart[productId].amount > product.stock) {
      throw new Error('Cart Error: Out of stock');
    }
  }

  doc.items = Object.values(cart);
}

export default model('Cart', cartSchema);
