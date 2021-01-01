import express from 'express';
import 'colors';
import dotenv from 'dotenv';
import connectDB from './config/mongoDB.js';

import data from './data.js';
import databaseRouter from './routes/databaseRoutes.js';

const app = express();

// Access to env variables
dotenv.config();

// Connect database
connectDB();

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/database', databaseRouter);

app.get('/', (req, res) => res.send('API running...'));
app.get('/api/products', (req, res) => {
  res.send(data.products);
});
app.get('/api/products/:id', (req, res) => {
  const product = data.products.find((x) => x._id === req.params.id);
  if (product) {
    res.send(product);
  } else {
    res.status(404).send({ message: 'Product not Found' });
  }
});

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.MODE} mode on port ${PORT}`.yellow.bold
      .underline,
  );
});
