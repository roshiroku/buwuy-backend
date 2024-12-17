import bcryptjs from 'bcryptjs';
import { slugify, ucFirst } from './string.utils.js';

export function hashProp(schema, { src = 'password', dst = 'password' } = {}) {
  schema.pre('insertMany', async function (next, docs) {
    for (const doc of docs) {
      const salt = await bcryptjs.genSalt(10);
      doc[dst] = await bcryptjs.hash(doc[src], salt);
    }
    next();
  });

  schema.pre('save', async function (next) {
    if (!this.isModified(src)) return next();
    const salt = await bcryptjs.genSalt(10);
    this[dst] = await bcryptjs.hash(this[src], salt);
    next();
  });

  schema.methods['match' + ucFirst(dst)] = async function (input) {
    return await bcryptjs.compare(input, this[dst]);
  };
}

export function slugifyProp(schema, { src = 'name', dst = 'slug' } = {}) {
  schema.pre('insertMany', function (next, docs) {
    docs.forEach((doc) => doc[dst] = slugify(doc[src]));
    next();
  });

  schema.pre('save', function (next) {
    if (!this.isModified(src)) return next();
    this[dst] = slugify(this[src]);
    next();
  });
}
