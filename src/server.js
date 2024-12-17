import { config } from 'dotenv';
import app from './app.js';
import connectDB from './config/db.config.js';
import seedData from './config/seed.config.js';

config();

const PORT = process.env.PORT || 5000;

// Start server
app.listen(PORT, async () => {
  await connectDB();
  await seedData();
  console.log(`Server running on port ${PORT}`);
});
