import fs from 'fs';
import path from 'path';
import config from 'config';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { copyFilesSync } from '../utils/file.utils.js';

const seed = config.has('seed') && config.get('seed') || {};
const userData = seed.users && JSON.parse(fs.readFileSync(path.resolve(seed.users)));
const tagData = seed.tags && JSON.parse(fs.readFileSync(path.resolve(seed.tags)));
const categoryData = seed.categories && JSON.parse(fs.readFileSync(path.resolve(seed.categories)));
const productData = seed.products && JSON.parse(fs.readFileSync(path.resolve(seed.products)));
const { assets } = seed;

// Async function to seed data
export default async function seedData() {
  try {
    const images = new Set();
    let isSeeding = false;

    // Seed Users
    if (userData && !await User.countDocuments()) {
      isSeeding = true;
      await User.insertMany(userData);
      console.log('Users seeded');

      userData.forEach((user) => {
        if (user.avatar?.startsWith('/uploads/')) {
          images.add(user.avatar.replace('/uploads/', ''));
        }
      });
    }

    // Seed Tags
    if (tagData && !await Tag.countDocuments()) {
      isSeeding = true;
      await Tag.insertMany(tagData);
      console.log('Tags seeded');
    }

    // Seed Categories
    if (categoryData && !await Category.countDocuments()) {
      isSeeding = true;
      await Category.insertMany(categoryData);
      console.log('Categories seeded');

      categoryData.forEach((category) => {
        if (category.image?.startsWith('/uploads/')) {
          images.add(category.image.replace('/uploads/', ''));
        }
      });
    }

    // Seed Products
    if (productData && !await Product.countDocuments()) {
      isSeeding = true;
      await Product.insertMany(productData);
      console.log('Products seeded');

      productData.forEach(product => {
        if (Array.isArray(product.images)) {
          product.images.forEach((image) => {
            if (image.src?.startsWith('/uploads/')) {
              images.add(image.src.replace('/uploads/', ''));
            }
          });
        }
      });
    }

    if (isSeeding) {
      console.log('All data seeded successfully!');
    }

    if (assets && images.size > 0) {
      const sourceDir = path.resolve(assets);
      const targetDir = path.resolve('uploads');

      copyFilesSync(Array.from(images), sourceDir, targetDir);
      console.log('Referenced assets copied successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
