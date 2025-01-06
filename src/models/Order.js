import { Schema, model } from 'mongoose';

export const addressSchema = new Schema({
  country: { type: String, required: true, maxlength: 64 },
  state: { type: String, maxlength: 64 },
  city: { type: String, required: true, maxlength: 64 },
  street: { type: String, required: true, maxlength: 64 },
  apt: { type: String, required: true, maxlength: 16 },
  zip: { type: String, required: true, maxlength: 16 }
}, { _id: false });

const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User' },
  client: {
    name: {
      first: { type: String, required: true },
      last: { type: String, required: true }
    },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  address: addressSchema,
  items: {
    type: [new Schema({
      product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
      name: { type: String, required: true },
      price: { type: Number, required: true },
      amount: { type: Number, default: 1 }
    }, { _id: false })],
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
