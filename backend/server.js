require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/productRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', productRoutes);

const PORT = process.env.PORT || 5000;

// Tạo connection string từ biến môi trường
const {
  MONGO_DB_HOST,
  MONGO_DB_PORT,
  MONGO_DB_DATABASE,
  MONGO_DB_USERNAME,
  MONGO_DB_PASSWORD
} = process.env;

const MONGODB_URI = `mongodb://${MONGO_DB_USERNAME}:${encodeURIComponent(MONGO_DB_PASSWORD)}@${MONGO_DB_HOST}:${MONGO_DB_PORT}/${MONGO_DB_DATABASE}?authSource=admin`;

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('MongoDB connected');
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}).catch(err => {
  console.error('MongoDB connection error:', err);
}); 