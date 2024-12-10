import Product from '../models/Product.js';
import ProductType from '../models/ProductType.js';

const validateAttributes = (attributes, schema) => {
  for (const key in schema) {
    if (schema[key].required && !(key in attributes)) {
      return `Missing required attribute: ${key}`;
    }
    // Add more validation rules as needed
  }
  return null;
};

// Create Product
export async function createProduct(req, res) {
  const { productType, name, attributes, category, tags, price, stock } = req.body;

  try {
    const pType = await ProductType.findById(productType);
    if (!pType) {
      return res.status(400).json({ message: 'Invalid ProductType' });
    }

    const error = validateAttributes(attributes, pType.schema);
    if (error) {
      return res.status(400).json({ message: error });
    }

    const product = await Product.create({
      productType,
      name,
      attributes,
      category,
      tags,
      price,
      stock,
    });

    res.status(201).json(product);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get All Products
export async function getProducts(req, res) {
  try {
    const products = await Product.find()
      .populate('productType')
      .populate('category')
      .populate('tags');
    res.json(products);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
}

// Get Single Product
export async function getProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id)
      .populate('productType')
      .populate('category')
      .populate('tags');
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Update Product
export async function updateProduct(req, res) {
  const { productType, name, attributes, category, tags, price, stock } = req.body;

  try {
    let product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    if (productType) {
      const pType = await ProductType.findById(productType);
      if (!pType) {
        return res.status(400).json({ message: 'Invalid ProductType' });
      }

      const error = validateAttributes(attributes, pType.schema);
      if (error) {
        return res.status(400).json({ message: error });
      }

      product.productType = productType;
    }

    product.name = name || product.name;
    product.attributes = attributes || product.attributes;
    product.category = category ?? product.category;
    product.tags = tags || product.tags;
    product.price = price ?? product.price;
    product.stock = stock ?? product.stock;

    await product.save();
    res.json(product);
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
}

// Delete Product
export async function deleteProduct(req, res) {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    await product.remove();
    res.json({ message: 'Product removed' });
  } catch (err) {
    console.error(err.message);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Product not found' });
    }
    res.status(500).send('Server Error');
  }
}
