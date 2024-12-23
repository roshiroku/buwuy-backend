import bcryptjs from 'bcryptjs';
import { slugify, ucFirst } from './string.utils.js';
import { deleteFile } from './file.utils.js';

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
  schema.path(src).set(function (value) {
    this[dst] = slugify(value);
    return value;
  });
}

export function fileProp(schema, prop = 'image') {
  const path = prop.split('.');
  const oldFilesProp = `_old${ucFirst(path.map(ucFirst).join(''))}Files`;

  // Pre-save hook to capture the previous file
  schema.pre('save', async function () {
    if (this._id) {
      const oldDoc = await this.model().findById(this._id);
      this[oldFilesProp] = getFiles(oldDoc, path);
    } else {
      this[oldFilesProp] = [];
    }
  });

  // Post-save hook to delete previous file if the src has changed
  schema.post('save', function (doc, next) {
    const oldFiles = doc[oldFilesProp];
    const newFiles = getFiles(doc, path);
    const files = oldFiles?.filter((file) => !newFiles.includes(file));
    files?.forEach((file) => deleteFile(file.substring(1)));
    next();
  });

  // Post findOneAndDelete hook to delete the file
  schema.post('findOneAndDelete', function (doc, next) {
    const files = getFiles(doc, path);
    files.forEach((file) => deleteFile(file.substring(1)));
    next();
  });

  // Pre deleteOne hook to capture the document being deleted
  schema.pre('deleteOne', { document: false, query: true }, async function () {
    const doc = await this.model.findOne(this.getFilter()).exec();
    this[oldFilesProp] = getFiles(doc, path);
  });

  // Post deleteOne hook to delete the captured file
  schema.post('deleteOne', { document: false, query: true }, function (res, next) {
    const files = this[oldFilesProp];
    files.forEach((file) => deleteFile(file.substring(1)));
    next();
  });

  // Pre deleteMany hook to capture all documents being deleted
  schema.pre('deleteMany', { document: false, query: true }, async function () {
    const docs = await this.model.find(this.getFilter()).exec();
    const files = this[oldFilesProp] = [];
    docs.forEach((doc) => files.push(...getFiles(doc, path)));
  });

  // Post deleteMany hook to delete all captured files
  schema.post('deleteMany', { document: false, query: true }, function (res, next) {
    const files = this[oldFilesProp];
    files.forEach((file) => deleteFile(file.substring(1)));
    next();
  });

  function getFiles(doc, path) {
    if (!doc) return [];

    const files = [];
    const [prop] = path;

    if (Array.isArray(doc[prop])) {
      if (path.length > 1) {
        doc[prop].forEach((value) => files.push(...getFiles(value, path.slice(1))));
      } else {
        files.push(...doc[prop].filter((file) => file.startsWith('/')));
      }
    } else {
      if (path.length > 1) {
        files.push(...getFiles(doc[prop], path.slice(1)));
      } else if (doc[prop]?.startsWith('/')) {
        files.push(doc[prop]);
      }
    }

    return files;
  }
}
