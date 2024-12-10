import { config } from 'dotenv';
import { listen } from './app';
import connectDB from './config/db.config.js';

config();

const PORT = process.env.PORT || 5000;

// Start server
listen(PORT, async () => {
  await connectDB();
  console.log(`Server running on port ${PORT}`);
});
