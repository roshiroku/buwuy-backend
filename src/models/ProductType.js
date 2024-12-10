import { Schema, model } from 'mongoose';

const ProductTypeSchema = new Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  schema: {
    type: Object, // Define the schema fields dynamically
    required: true,
  },
}, { timestamps: true });

export default model('ProductType', ProductTypeSchema);
