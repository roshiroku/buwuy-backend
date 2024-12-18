import { readFileSync } from 'fs';
import path from 'path';
import config from 'config';
import User from '../models/User.js';
import Tag from '../models/Tag.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

const seed = config.has('seed') && config.get('seed');
const userData = seed.users && JSON.parse(readFileSync(path.resolve(seed.users)));
const tagData = seed.tags && JSON.parse(readFileSync(path.resolve(seed.tags)));
const categoryData = seed.categories && JSON.parse(readFileSync(path.resolve(seed.categories)));
const productData = seed.products && JSON.parse(readFileSync(path.resolve(seed.products)));

// Async function to seed data
export default async function seedData() {
  try {
    let isSeeding = false;

    // Seed Users
    if (userData && !await User.countDocuments()) {
      isSeeding = true;
      await User.insertMany(userData);
      console.log('Users seeded');
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
    }

    // Seed Products
    if (productData && !await Product.countDocuments()) {
      isSeeding = true;
      await Product.insertMany(productData);
      console.log('Products seeded');
    }

    if (isSeeding) {
      console.log('All data seeded successfully!');
    }
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}
