import bcryptjs from 'bcryptjs';
import { slugify, ucFirst } from './string.utils.js';

export function hashProp(schema, { src = 'password', dst = 'password' } = {}) {
  schema.pre('validate', async function () {
    if (!this.isModified(src)) return;
    const salt = await bcryptjs.genSalt(10);
    this[dst] = await bcryptjs.hash(this[src], salt);
  });

  schema.methods['match' + ucFirst(dst)] = async function (input) {
    return await bcryptjs.compare(input, this[dst]);
  };
}

export function slugifyProp(schema, { src = 'name', dst = 'slug' } = {}) {
  schema.pre('validate', function (next) {
    if (!this.isModified(src)) return next();
    this[dst] = slugify(this[src]);
    next();
  });
}
