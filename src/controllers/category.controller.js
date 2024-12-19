import Category from '../models/Category.js';
import { deleteFile, normalizeFilePath } from '../utils/file.utils.js';

// Create Category
export async function createCategory(req, res) {
  try {
    const { name } = req.body;
    const image = normalizeFilePath(req.file) ?? req.body.image;
    const category = await Category.create({ name, image });
    res.status(201).json(category);
  } catch (err) {
    deleteFile(req.file);
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Categories
export async function getCategories(req, res) {
  try {
    const { skip, limit, ...params } = req.query;
    const categories = await Category.find(params).skip(skip).limit(limit);
    res.json(categories);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Get Single Category
export async function getCategory(req, res) {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Update Category
export async function updateCategory(req, res) {
  try {
    const { name } = req.body;
    const image = normalizeFilePath(req.file) ?? req.body.image;
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    category.name = name ?? category.name;
    category.image = image ?? category.image;

    await category.save();
    res.json(category);
  } catch (err) {
    deleteFile(req.file);
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}

// Delete Category
export async function deleteCategory(req, res) {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json({ message: 'Category removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: 'Server Error' });
  }
}
