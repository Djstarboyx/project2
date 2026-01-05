const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require('dotenv').config();

const authRoutes = require('./routes/auth');
const confessionRoutes = require('./routes/confessions');

const app = express();

// Middleware
app.use(express.json());
app.use(cookieParser());

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/confessions-db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log(' MongoDB Connected'))
.catch(err => console.error(' MongoDB Connection Error:', err));

// Routes
app.use('/auth', authRoutes);
app.use('/api/confessions', confessionRoutes);

// Health check
app.get('/', (req, res) => {
  res.json({ message: 'Anonymous Confessions API is running!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});