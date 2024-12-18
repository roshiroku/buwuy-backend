import Product from '../models/Product.js';

// Create Product
export async function createProduct(req, res) {
  try {
    const { name, description, price, stock, variants, category, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      variants,
      category,
      tags
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Products
export async function getProducts(req, res) {
  try {
    const { skip, limit, ...params } = req.query;
    const products = await Product.find(params).skip(skip).limit(limit);
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Single Product
export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update Product
export async function updateProduct(req, res) {
  try {
    const { name, description, price, stock, variants, category, tags } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.variants = variants ?? product.variants;
    product.category = category ?? product.category;
    product.tags = tags ?? product.tags;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Delete Product
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
