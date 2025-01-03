import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';

function handleUploads(req) {
  const { images = [], variants = [] } = req.body;
  const { files = [] } = req;

  [images, ...variants.map(({ images }) => images)].forEach((images, i) => {
    images.forEach((image, j) => {
      if (!image.src) {
        const index = files.findIndex(({ fieldname }) => {
          return fieldname.match(new RegExp(
            `${i ? `variants\\[${i - 1}\\]\\[images\\]` : 'images'}\\[${j}\\]\\[src\\]`
          ));
        });
        if (index > -1) {
          image.src = normalizeFilePath(files[index]);
          files.splice(index, 1);
        }
      }
    });
  });

  while (files.length) {
    deleteFile(files.pop());
  }
}

// Create Product
export async function createProduct(req, res) {
  try {
    handleUploads(req);
    const { name, description, category, price, stock, images = [], tags = [] } = req.body;

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
    const { skip, limit, sort, categorySlug, ...params } = req.query;

    if (categorySlug) {
      const category = await Category.findOne({ slug: categorySlug });
      params.category = [params.category, category?._id].filter(Boolean);
    }

    const pipeline = [
      { $match: params },
      { $addFields: { category: { $toObjectId: '$category' } } },
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'category'
        }
      },
      { $unwind: { path: '$category', preserveNullAndEmptyArrays: true } }
    ];

    if (sort) {
      const sortBy = sort.startsWith('-') ? sort.slice(1) : sort;
      const sortDir = sort.startsWith('-') ? -1 : 1;
      pipeline.push({
        $sort: {
          [sortBy === 'category' ? 'category.name' : sortBy]: sortDir,
          name: sortDir,
        }
      });
    }

    skip && pipeline.push({ $skip: Number(skip) });
    limit && pipeline.push({ $limit: Number(limit) });

    const results = await Product.aggregate(pipeline);
    const count = await Product.countDocuments(params);

    res.json({ results, count });
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
    const { name, description, category, price, stock, images = [], tags = [], variants = [] } = req.body;
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
    product.variants = variants ?? product.variants;

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
