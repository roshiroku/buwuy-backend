import Product from '../models/Product.js';
import Order from '../models/Order.js';

async function cartOrderItems(cart) {
  const products = Object.fromEntries((await Product.find({
    _id: cart.products.map(({ product }) => product)
  })).map((product) => [product._id, product]));
  const items = {};

  for (const { product: id, amount } of cart.products) {
    const product = products[id];

    if (!items[id]) {
      items[id] = { product: id, name: product.name, price: product.price, amount: 0 };
    }

    items[id].amount += amount;

    if (items[id].amount < 1) {
      delete items[id];
    } else if (items[id].amount > product.stock) {
      throw new Error('Order Error: Out of stock');
    }
  }

  return Object.values(items);
}

export async function startCheckout(req, res) {
  try {
    const { user } = req;
    const { contact, address, cart } = req.body;
    const items = await cartOrderItems(cart);
    const order = await Order.create({ user: user?._id, contact, address, items });
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

export async function finishCheckout(req, res) {
  try {
    const { user } = req;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: user?._id, status: null });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = 'pending';
    await order.save();

    /** @todo reduce products stock X_X */
    /** @todo increase product sales */

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

export async function getCheckout(req, res) {
  try {
    const { user } = req;
    const { id } = req.params;
    const order = await Order.findOne({ _id: id, user: user?._id, status: null });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
