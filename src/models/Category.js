import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  slug: {
    type: String,
    index: true,
    unique: true,
    required: true
  },
  image: String
}, { timestamps: true });

categorySchema.pre('save', function () {
  this.slug = slugify(this.name);
});

export default model('Category', categorySchema);
