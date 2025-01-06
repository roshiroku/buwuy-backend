import { isValidObjectId, Types } from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Tag from '../models/Tag.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';

function handleUploads(req) {
  const { images = [] } = req.body;
  const { files = [] } = req;

  images.forEach((image, i) => {
    if (!image.src) {
      const index = files.findIndex(({ fieldname }) => {
        return fieldname.match(new RegExp(`images\[${i}\]\[src\]`));
      });
      if (index > -1) {
        image.src = normalizeFilePath(files[index]);
        files.splice(index, 1);
      }
    }
  });

  while (files.length) {
    deleteFile(files.pop());
  }
}

// Create Product
export async function createProduct(req, res) {
  try {
    handleUploads(req);
    const { name, byline, description, category, price, stock, images = [], tags = [] } = req.body;

    const product = await Product.create({
      name,
      byline,
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
    const { skip, limit, sort, _id, category, q: search, tags, ...params } = req.query;

    // Handle _id filter
    if (_id) {
      const ids = Array.isArray(_id) ? _id : [_id];
      const objectIds = ids.map((id) => (
        isValidObjectId(id) ? Types.ObjectId.createFromHexString(id) : null
      )).filter(Boolean);
      params._id = { $in: objectIds };
    }

    // Handle tag filtering
    if (tags?.filter(Boolean).length) {
      const tagList = Array.isArray(tags) ? tags : [tags];
      const tagConditions = await Promise.all(tagList.map(async (tag) => {
        if (isValidObjectId(tag)) return tag;
        const foundTag = await Tag.findOne({ slug: tag });
        return foundTag?._id.toString() || null;
      }));
      params.tags = { $all: tagConditions.filter(Boolean) };
    }

    // Handle category filtering
    if (category) {
      const categoryList = Array.isArray(category) ? category : [category];
      const categoryConditions = await Promise.all(categoryList.map(async (cat) => {
        if (isValidObjectId(cat)) return cat;
        const foundCategory = await Category.findOne({ slug: cat });
        return foundCategory?._id.toString() || null;
      }));
      params.category = { $in: categoryConditions.filter(Boolean) };
    }

    const pipeline = [
      { $match: { ...params } },
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

    // Handle search (free-text search)
    if (search) {
      pipeline.push({
        $match: {
          $or: [
            { name: { $regex: search, $options: 'i' } },
            { byline: { $regex: search, $options: 'i' } },
            // { description: { $regex: search, $options: 'i' } }
          ]
        }
      });
    }

    // Handle sorting
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

    // Handle pagination
    skip && pipeline.push({ $skip: Number(skip) });
    limit && pipeline.push({ $limit: Number(limit) });

    // Execute aggregation
    const results = await Product.aggregate(pipeline);

    // Correct document count
    const countPipeline = pipeline.filter(({ $skip, $limit }) => !$skip && !$limit);
    const [{ count = 0 } = {}] = await Product.aggregate([...countPipeline, { $count: 'count' }]);

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
    const { name, byline, description, category, price, stock, images = [], tags = [] } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      req.files?.forEach((file) => deleteFile(file));
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name ?? product.name;
    product.byline = byline ?? product.byline;
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
