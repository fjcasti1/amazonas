import express from 'express';
import 'colors';

import data from './data.js';

const app = express();

const PORT = process.env.PORT || 5000;

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

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.MODE} mode on port ${PORT}`.yellow.bold
      .underline,
  );
});
