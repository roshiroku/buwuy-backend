import { Schema, model } from 'mongoose';
import { fileProp, slugifyProp } from '../utils/schema.utils.js';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    maxlength: 32
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true,
    maxlength: 32
  },
  byline: {
    type: String,
    required: true,
    maxlength: 128
  },
  description: {
    type: String,
    required: true,
    maxlength: 1024
  },
  image: {
    type: String,
    validate: {
      validator: function (v) {
        return !v || /^(\/uploads\/|https?:\/\/)[\w\-./]+(\.jpg|\.jpeg|\.png|\.gif|\.bmp|\.webp)$/i.test(v);
      },
      message: (props) => `${props.value} is not a valid image path!`
    }
  }
}, { timestamps: true });

slugifyProp(categorySchema);
fileProp(categorySchema);

export default model('Category', categorySchema);
