import { Schema, model } from 'mongoose';

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  contact: {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  address: {
    country: { type: String, required: true },
    state: String,
    city: { type: String, required: true },
    street: { type: String, required: true },
    apt: { type: String, required: true },
    zip: { type: String, required: true }
  },
  items: {
    type: [{
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      amount: { type: Number, default: 1 }
    }],
    validate: [(val) => {
      return val.length;
    }, 'Order cannot be empty']
  },
  subtotal: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'processed', 'shipped', 'delivered', 'cancelled']
  },
}, { timestamps: true });

orderSchema.path('items').set(function (items) {
  this.subtotal = items.reduce((total, item) => total + item.price * item.amount, 0);
  return items;
});

export default model('Order', orderSchema);
