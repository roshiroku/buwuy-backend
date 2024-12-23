import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';

function handleUploads(req) {
  const { images } = req.body;
  const { files = [] } = req;
  let index = 0;
  images?.forEach((image) => image.src ||= normalizeFilePath(files[index++]));
  while (index < files.length) {
    deleteFile(files[index++]);
  }
  return { images };
}

// Create Product
export async function createProduct(req, res) {
  try {
    handleUploads(req);
    const { name, description, price, stock, images, category, tags } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      images,
      category,
      tags
    });

    res.status(201).json(product);
  } catch (err) {
    req.files?.forEach((file) => deleteFile(file));
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Products
export async function getProducts(req, res) {
  try {
    const { skip, limit, categorySlug, ...params } = req.query;

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      params.category = [params.category, category?._id].filter(Boolean);
    }

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
    const { name, description, price, stock, images, category, tags } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      req.files?.forEach((file) => deleteFile(file));
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;
    product.images = images ?? product.images;
    product.category = category ?? product.category;
    product.tags = tags ?? product.tags;

    await product.save();
    res.json(product);
  } catch (err) {
    req.files?.forEach((file) => deleteFile(file));
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

// Create Variant
export async function createVariant(req, res) {
  try {
    handleUploads(req);
    const { name, description, images, price, stock } = req.body;
    const variant = { name, description, images, price, stock };
    const product = await Product.findById(req.params.id);

    if (!product) {
      req.files?.forEach((file) => deleteFile(file));
      return res.status(404).json({ message: 'Product not found' });
    }

    product.variants = [...product.variants, variant];
    await product.save();

    res.status(201).json(product.variants.pop());
  } catch (err) {
    req.files?.forEach((file) => deleteFile(file));
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update Variant
export async function updateVariant(req, res) {
  try {
    handleUploads(req);
    const { name, description, images, price, stock } = req.body;
    const product = await Product.findById(req.params.id);
    const variant = product && product.variants[req.params.variant];

    if (!variant) {
      req.files?.forEach((file) => deleteFile(file));
      return res.status(404).json({ message: 'Variant not found' });
    }

    variant.name = name ?? variant.name;
    variant.description = description ?? variant.description;
    variant.images = images ?? variant.images;
    variant.price = price ?? variant.price;
    variant.stock = stock ?? variant.stock;
    await product.save();

    res.status(201).json(variant);
  } catch (err) {
    req.files?.forEach((file) => deleteFile(file));
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Delete Variant
export async function deleteVariant(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    const variant = product && product.variants[req.params.variant];

    if (!variant) {
      return res.status(404).json({ message: 'Variant not found' });
    }

    product.variants = product.variants.filter((v) => v !== variant);
    await product.save();

    res.json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
