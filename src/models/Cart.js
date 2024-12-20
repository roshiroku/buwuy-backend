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
  products: {
    type: [{
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true
      },
      variant: {
        type: Number,
        min: 0,
        required: true,
        default: 0
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
    _id: doc.products.map(({ product }) => product)
  })).map((product) => [product._id, product]));
  const cart = {};

  for (const { product: productId, variant: variantId = 0, amount } of doc.products) {
    const product = products[productId];
    const key = `${productId}_${variantId}`;
    const variant = variantId > 0 ? product.variants[variantId - 1] : product;

    if (cart[key]) {
      cart[key].amount += amount;
    } else {
      cart[key] = { product: productId, variant: variantId, amount };
    }

    if (cart[key].amount < 1) {
      delete cart[key];
    } else if (cart[key].amount > variant.stock) {
      throw new Error('Cart Error: Out of stock');
    }
  }

  doc.products = Object.values(cart);
}

export default model('Cart', cartSchema);
