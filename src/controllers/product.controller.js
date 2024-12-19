import Product from '../models/Product.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';

function handleUploads(req) {
  const { images, variants } = req.body;
  const { imageFiles = [], variantImageFiles = [] } = req.files;
  let index = 0;

  images?.forEach((image) => {
    image.src ??= normalizeFilePath(imageFiles[index++]);
  });

  index = 0;
  variants?.forEach((variant) => {
    variant.images?.forEach((image) => {
      image.src ??= normalizeFilePath(variantImageFiles[index++]);
    });
  });

  return { images, variants };
}

// Create Product
export async function createProduct(req, res) {
  try {
    handleUploads(req);
    const { name, description, price, stock, images, variants, category, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      images,
      variants,
      category,
      tags
    });

    res.status(201).json(product);
  } catch (err) {
    req.files.imageFiles?.forEach((file) => deleteFile(file));
    req.files.variantImageFiles?.forEach((file) => deleteFile(file));
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
    handleUploads(req);
    const { name, description, price, stock, images, variants, category, tags } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.images = images ?? product.images;
    product.variants = variants ?? product.variants;
    product.category = category ?? product.category;
    product.tags = tags ?? product.tags;

    await product.save();
    res.json(product);
  } catch (err) {
    req.files.imageFiles?.forEach((file) => deleteFile(file));
    req.files.variantImageFiles?.forEach((file) => deleteFile(file));
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
