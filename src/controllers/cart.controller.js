import Cart from "../models/Cart.js";

export async function getCart(req, res) {
  try {
    const { _id: user } = req.user;
    const cart = await Cart
      .findOne({ user })
      .populate('items.product')
      .select('-user');
    res.json(cart || { items: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

export async function updateCart(req, res) {
  try {
    const { _id: user } = req.user;
    const { items } = req.body;
    let cart = { items: [] };

    if (items?.some(({ amount }) => amount > 0)) {
      cart = await Cart
        .findOneAndUpdate({ user }, { user, items }, { upsert: true, new: true })
        .populate('items.product')
        .select('-user');
    } else {
      await Cart.findOneAndDelete({ user });
    }

    res.json(cart);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

export async function clearCart(req, res) {
  try {
    await Cart.findOneAndDelete({ user: req.user._id });
    res.json({ items: [] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
