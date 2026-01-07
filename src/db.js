const mongoose = require('mongoose');
const connectDB = require('./db');
const app = require('./app'); // adjust path if different

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/confessions';
const PORT = process.env.PORT || 3000;

async function connectDB() {
  try {
    // Optional: make mongoose fail fast if server not reachable
    await mongoose.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error('MongoDB connection error:', err.message);
    // exit so process manager / developer sees immediate failure
    process.exit(1);
  }
}

(async () => {
  await connectDB(); // exits process on failure
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();