import { connect } from 'mongoose';

export default async function connectDB() {
  try {
    await connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};
