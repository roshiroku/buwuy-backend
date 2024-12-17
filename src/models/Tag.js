import { Schema, model } from 'mongoose';

const tagSchema = new Schema({
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
  }
}, { timestamps: true });

tagSchema.pre('save', function () {
  this.slug = slugify(this.name);
});

export default model('Tag', tagSchema);
