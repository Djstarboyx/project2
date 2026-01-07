
import mongoose from 'mongoose'

let isConnected = false

export const connectDB = async() => {
 if(isConnected) {
    console.log('Database is already connected')
    return;
 }

 try{
    const db = await mongoose.connect(process.env.MONGO_URI)
    isConnected = db.connections[0].readyState
    console.log('Database connected successfully')
 }catch(err){
    if(err instanceof Error){
        console.error(err.message)
    }
 }
}
// ...existing code...
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb://localhost:27017/confessions';

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

module.exports = connectDB;
// ...existing code...
// ...existing code...
const connectDB = require('./db');
const app = require('./app'); // adjust path if different

const PORT = process.env.PORT || 3000;

(async () => {
  await connectDB(); // exits process on failure
  app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
  });
})();
// ...existing code...
// ...existing code...
const mongoose = require('mongoose');

app.use((req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    return res.status(503).json({ success: false, message: 'Service unavailable - DB connecting' });
  }
  next();
});
// ...existing code...