import Order from '../models/Order.js';
import Product from '../models/Product.js';

// Create Order
export async function createOrder(req, res) {
  const { products } = req.body;

  try {
    if (!products || products.length === 0) {
      return res.status(400).json({ message: 'No products in order' });
    }

    let totalAmount = 0;
    const orderProducts = [];

    for (const item of products) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product not found: ${item.product}` });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({ message: `Insufficient stock for product: ${product.name}` });
      }

      product.stock -= item.quantity;
      await product.save();

      const price = product.price * item.quantity;
      totalAmount += price;

      orderProducts.push({
        product: product._id,
        quantity: item.quantity,
        price,
      });
    }

    const order = await Order.create({
      user: req.user._id,
      products: orderProducts,
      totalAmount,
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get All Orders (Admin and Moderator)
export async function getOrders(req, res) {
  try {
    const orders = await Order.find()
      .populate('user', 'name email')
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get User Orders
export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({ user: req.user._id })
      .populate('products.product', 'name price');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get Single Order (Admin can access any, users can access their own)
export async function getOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('products.product', 'name price');

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (req.user.role !== 'admin' && req.user.role !== 'moderator' && order.user._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Update Order Status (Admin and Moderator)
export async function updateOrder(req, res) {
  const { status } = req.body;

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status ?? order.status;

    await order.save();
    res.json(order);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Delete Order (Admin and Moderator)
export async function deleteOrder(req, res) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Optionally, restock products
    for (const item of order.products) {
      const product = await Product.findById(item.product);
      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.remove();
    res.json({ message: 'Order removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(500).send('Server Error');
  }
}
