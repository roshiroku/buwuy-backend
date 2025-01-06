import { isValidObjectId, Types } from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import { omit } from '../utils/object.utils.js';

async function normalizeOrderItems(input) {
  const products = Object.fromEntries((await Product.find({
    _id: input.map(({ product }) => product)
  })).map((product) => [product._id, product]));
  const items = {};

  for (const { product: id, name, price, amount } of input) {
    const product = products[id];

    if (!items[id]) {
      items[id] = {
        product: id,
        name: name ?? product.name,
        price: price ?? product.price,
        amount: 0
      };
    }

    items[id].amount += amount;

    if (items[id].amount < 1) {
      delete items[id];
    }
  }

  return Object.values(items);
}

// Create Order
export async function createOrder(req, res) {
  const { user, client, address, ...params } = req.body;

  try {
    const items = normalizeOrderItems(params.items);
    const order = await Order.create({ user, client, address, items });
    res.status(201).json(order);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get All Orders (Admin, Moderator, and Users)
export async function getOrders(req, res) {
  try {
    const { skip, limit, sort, user, ...params } = req.query;

    if (user) {
      const userId = isValidObjectId(user) ? Types.ObjectId.createFromHexString(user) : null;
      params.user = userId;
    }

    if (!['admin', 'moderator'].includes(req.user.role) && !params.user.equals(req.user._id)) {
      return res.status(403).json({ message: 'Not authorized to view orders for other users' });
    }

    const pipeline = [
      { $match: params },
      {
        $addFields: {
          'client.fullName': {
            $concat: [
              { $ifNull: ['$client.name.last', ''] },
              ' ',
              { $ifNull: ['$client.name.first', ''] }
            ]
          }
        }
      }
    ];

    if (sort) {
      const sortBy = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortDir = sort.startsWith('-') ? -1 : 1;
      pipeline.push({
        $sort: {
          [
            sortBy === 'name' ? 'client.fullName' :
              sortBy === 'email' ? 'client.email' :
                sortBy
          ]: sortDir,
          _id: sortDir
        }
      });
    }

    skip && pipeline.push({ $skip: Number(skip) });
    limit && pipeline.push({ $limit: Number(limit) });

    const orders = await Order.aggregate(pipeline);
    const count = await Order.countDocuments(params);

    res.json({ results: orders, count });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get User Orders
export async function getUserOrders(req, res) {
  try {
    const orders = await Order.find({
      user: req.user._id
    }).populate('items.product', 'name price');
    res.json(orders);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get Single Order (Admin can access any, users can access their own)
export async function getOrder(req, res) {
  try {
    const { user } = req;
    const order = await Order.findById(req.params.id);
    const isOwner = !(user || order?.user) || order?.user.equals(user?._id);
    const isMod = ['admin', 'moderator'].includes(user?.role);

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    if (!isMod && !isOwner) {
      return res.status(403).json({ message: 'Not authorized to view this order' });
    }

    res.json(order.user || isMod ? order : omit(order.toObject(), 'client', 'address'));
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Update Order (Admin and Moderator)
export async function updateOrder(req, res) {
  const { status, client, address, ...params } = req.body;
  const items = await normalizeOrderItems(params.items);

  try {
    let order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    order.status = status ?? order.status;
    order.client = client ?? order.client;
    order.address = address ?? order.address;
    order.items = items ?? order.items;

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
