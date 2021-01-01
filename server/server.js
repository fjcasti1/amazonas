import express, { urlencoded } from 'express';
import 'colors';
import dotenv from 'dotenv';
import connectDB from './config/mongoDB.js';
import databaseRouter from './routes/databaseRoutes.js';
import productRouter from './routes/productRoutes.js';
import userRouter from './routes/userRoutes.js';

const app = express();
app.use(express.json());
app.use(urlencoded({ extended: true }));

// Access to env variables
dotenv.config();

// Connect database
connectDB();

const PORT = process.env.PORT || 5000;

// Routes
app.use('/api/database', databaseRouter);
app.use('/api/products', productRouter);
app.use('/api/users', userRouter);

app.get('/', (req, res) => res.send('API running...'));

app.use((err, req, res, next) => {
  res.status(500).send({ message: err.message });
});

app.listen(PORT, () => {
  console.log(
    `Server running in ${process.env.MODE} mode on port ${PORT}`.yellow.bold
      .underline,
  );
});
